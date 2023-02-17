package com.ssafy.ssarijileo.api.singingcontest.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class LikeServiceImpl implements LikeService{

    private final RedisTemplate<String, String> redisTemplate;

    @Override
    public void like(String userId, Long singingContestId) {
        redisTemplate.opsForSet().add("likes:" + singingContestId, userId);
    }

    @Override
    public void unlike(String userId, Long singingContestId) {
        redisTemplate.opsForSet().remove("likes:" + singingContestId, userId);
    }

    @Override
    public Long getLikeCount(Long singingContestId) {
        return redisTemplate.opsForSet().size("likes:" + singingContestId);
    }

    @Override
    public Set<String> getLikeUsers(Long singingContestId) {
        return redisTemplate.opsForSet().members("likes:" + singingContestId);
    }

    @Override
    public Boolean hasLiked(String userId, Long singingContestId) {
        return redisTemplate.opsForSet().isMember("likes:" + singingContestId, userId);
    }
}
