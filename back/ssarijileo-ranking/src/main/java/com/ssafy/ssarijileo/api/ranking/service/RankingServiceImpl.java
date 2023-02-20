package com.ssafy.ssarijileo.api.ranking.service;

import com.ssafy.ssarijileo.api.ranking.client.RankingClient;
import com.ssafy.ssarijileo.api.ranking.dto.RankingDto;
import com.ssafy.ssarijileo.api.ranking.dto.RankingType;
import com.ssafy.ssarijileo.api.singing.entity.Singing;
import com.ssafy.ssarijileo.api.singing.repsoitory.SingingJpaRepository;
import com.ssafy.ssarijileo.api.song.client.FavoriteSongClient;
import com.ssafy.ssarijileo.api.song.entity.FavoriteSong;
import com.ssafy.ssarijileo.api.song.entity.Song;
import com.ssafy.ssarijileo.api.song.repository.FavoriteSongJpaRepository;
import com.ssafy.ssarijileo.api.song.repository.SongJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class RankingServiceImpl implements RankingService {

    private final SongJpaRepository songJpaRepository;
    private final SingingJpaRepository singingJpaRepository;
    private final FavoriteSongJpaRepository favoriteSongJpaRepository;
    private final FavoriteSongClient favoriteSongClient;
    private final RankingClient rankingClient;

    @Override
    public List<RankingDto> findRanking(String userId, RankingType rankingType) {

        List<RankingDto> list = rankingClient.getRanking(rankingType);

        if (list.isEmpty()) { list = getRanking(rankingType); }

        if (userId.isEmpty()) { return list; }

        for (RankingDto dto : list) { dto.updateFavoriteSong(favoriteSongClient.isFavoriteSong(userId, dto.getSongId())); }

        return list;
    }

    // 매일 새벽 3시 30분에 일간랭킹 연산 후 캐시 저장
    @Scheduled(cron = "0 30 3 * * *")
    public void dailyGetRanking() {
        getRanking(RankingType.DAY);
    }

    // 매주 월요일 새벽 3시 40분
    @Scheduled(cron = "0 40 3 * * 1")
    public void weeklyGetRanking() {
        getRanking(RankingType.WEEK);
    }

    // 매월 1일 새벽 4시
    @Scheduled(cron = "0 0 4 1 * *")
    public void monthlyGetRanking() {
        getRanking(RankingType.MONTH);
    }

    @Override
    public List<RankingDto> getRanking(RankingType rankingType) {

        /////// 날짜 구분
        DateTimeFormatter dateFormat = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        String startDate = "";
        String endDate = "";
        String startTime = " 00:00:00";
        String endTime = " 23:59:59";

        switch(rankingType) {
            case DAY:
                startDate = LocalDate.now().minusDays(1).format(dateFormat) + startTime;
                endDate = LocalDate.now().minusDays(1).format(dateFormat) + endTime;
                break;
            case WEEK:
                startDate = LocalDateTime.now().with(TemporalAdjusters.previous(DayOfWeek.SUNDAY)).minusDays(6).format(dateFormat) + startTime;
                endDate = LocalDateTime.now().with(TemporalAdjusters.previous(DayOfWeek.SUNDAY)).format(dateFormat) + endTime;
                break;
            case MONTH:
                startDate = LocalDateTime.now().minusMonths(1).with(TemporalAdjusters.firstDayOfMonth()).format(dateFormat) + startTime;
                endDate = LocalDateTime.now().minusMonths(1).with(TemporalAdjusters.lastDayOfMonth()).format(dateFormat) + endTime;
                break;
            default: break;
        }
        log.info("start date = {}, end date = {}", startDate, endDate);

        ///////

        // (임시) 노래 목록 불러오기
        List<Song> songList = songJpaRepository.findAll();
        List<Singing> singingList = singingJpaRepository.findBySingingDateBetween(startDate, endDate);
        List<FavoriteSong> favoriteSongList = favoriteSongJpaRepository.findByRegisterDateBetween(startDate, endDate);

        // 랭킹 계산
        Map<Long, Double> map = new HashMap<>();
        Map<Long, Song> songMap = new HashMap<>();

        DateTimeFormatter timeFormat = DateTimeFormatter.ofPattern("H:mm:ss");

        // 노래 목록 랭킹 리스트업
        for (Song song : songList) {
            map.put(song.getSongId(), 0.001);
            songMap.put(song.getSongId(), song);
        }

        // 날짜간 부른 횟수 계산
        for (Singing singing : singingList) {
            // 현재 노래 정보
            Song song = singing.getSong();
            // songId
            Long key = song.getSongId();
            // 부른 횟수
            Double val = 1.0;

            // 노래 부른 기록일 경우
            if (singing.getState().equals("I")) {
                if (map.containsKey(key)) {
                    val += map.get(key);
                }
            } else {    // 노래 취소한 기록일 경우

                // 원곡 시간
                double originSongTime = LocalTime.parse(singing.getSong().getTime(), timeFormat).toSecondOfDay();
                // 부른 시간
                double singTime = LocalTime.parse(singing.getSingingTime(), timeFormat).toSecondOfDay();
                
                // 1 - (부른 시간 / 원곡 시간)
                val = 1 - (singTime / originSongTime);
                if (map.containsKey(key)) {
                    val = map.get(key) - val;
                }
            }
            // 노래 랭킹점수 저장
            map.put(key, val);

            // 노래 정보 저장
            songMap.put(key, song);
        }

        // 기간 내에 활동한 유저의 애창곡
        for (FavoriteSong favoriteSong : favoriteSongList) {
            String[] songs = favoriteSong.getSongId().split(" ");

            // 애창곡 리스트
            for (String songId : songs) {
                Long key = Long.parseLong(songId);

                // 기간 내에 부른 이력이 있는 노래에 대해서만
                if (songMap.containsKey(key)) {
                    map.put(key, map.get(key) + 10);
                }
            }
        }

        // 점수 순으로 정렬
        List<Long> keySet = new ArrayList<>(map.keySet());
        keySet.sort((o1, o2) -> map.get(o2).compareTo(map.get(o1)));

        List<RankingDto> rankingList = new ArrayList<>();

        // 순위 지정
        int ranking = 1;
        for (Long key : keySet) {
            Song song = songMap.get(key);
            rankingList.add(
                RankingDto.builder()
                        .ranking(ranking++)
                        .songId(song.getSongId())
                        .title(song.getTitle())
                        .singer(song.getSinger())
                        .album(song.getAlbum())
                        .image(song.getImage()).build()
            );
            
            // Top 100 까지만
            if (ranking > 100) break;
        }

        rankingClient.setRanking(rankingType, rankingList);
        return rankingList;
    }

    @Override
    public List<RankingDto> findRankingDB(String userId, RankingType rankingType) {

        List<RankingDto> list = rankingClient.getRanking(rankingType);

        if (userId.isEmpty()) { return list; }

        for (RankingDto dto : list) { dto.updateFavoriteSong(favoriteSongClient.isFavoriteSong(userId, dto.getSongId())); }

        return list;
    }
}
