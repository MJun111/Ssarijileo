package com.ssafy.ssarijileo.api.favoritesong.service;

import com.ssafy.ssarijileo.api.favoritesong.entity.FavoriteSong;
import com.ssafy.ssarijileo.api.favoritesong.repository.FavoriteSongJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Set;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class FavoriteSongServiceImpl implements FavoriteSongService {

    private final FavoriteSongJpaRepository favoriteSongJpaRepository;
    private final RedisTemplate<String, String> redisTemplate;

    @Override
    public void subscribe(String userId, Long songId) {
        redisTemplate.opsForSet().add("subscribe:" + userId, String.valueOf(songId));
        redisTemplate.expire("subscribe:" + userId, 1, TimeUnit.DAYS);
    }

    @Override
    public void unsubscribe(String userId, Long songId) {
        redisTemplate.opsForSet().remove("subscribe:" + userId, String.valueOf(songId));
    }

    @Override
    public Boolean hasSubscribed(String userId, Long songId) {
        return redisTemplate.opsForSet().isMember("subscribe:" + userId, String.valueOf(songId));
    }

    @Override
    public Set<String> getUsersFavoriteSong(String userId) {
        return redisTemplate.opsForSet().members("subscribe:" + userId);
    }

    @Override
    public Set<String> getKeys() {
        return redisTemplate.keys("subscribe:*");
    }

    @Override
    public Boolean hasKey(String userId) {
        return redisTemplate.hasKey("subscribe:" + userId);
    }

    // Test Code
    public void removeAll(String userId) {
        for (int i = 1; i <= 31; i++)
            redisTemplate.opsForSet().remove("subscribe:" + userId, String.valueOf(i));
    }

    @Override
    public void getFavoriteSongFromDB(String userId) {
        // 캐시에 유저 애창곡 정보가 없을 경우 DB에서 받아옴
        if (!hasKey(userId)) {
        	try {
        		String[] favoriteSong = favoriteSongJpaRepository.findLatestSongIdByUserId(userId)[0].split(" ");
        		for (String songId : favoriteSong) {
        			subscribe(userId, Long.parseLong(songId));
        		}
                // 캐시에서 불러온 구분
                subscribe(userId, 0L);
        	} catch (Exception e) {
                log.info("Exception={}", e);
        	}
        }
    }

    // 매일 3시 저장
    @Override
    @Scheduled(cron = "0 0 3 * * *")
    public void saveFavoriteSongToDB() {
        Set<String> keys = getKeys();

        for (String key : keys) {
            StringBuffer sb = new StringBuffer();
            String userId = key.split(":")[1];

            Set<String> values = getUsersFavoriteSong(userId);
            for (String value : values) {
                if (value.equals("0")) continue;
                sb.append(value).append(" ");
            }

            FavoriteSong favoriteSong = FavoriteSong.builder()
                                        .userId(userId)
                                        .songId(sb.toString())
                                        .registerDate(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
                                        .build();
            favoriteSongJpaRepository.save(favoriteSong);
        }
    }
}
