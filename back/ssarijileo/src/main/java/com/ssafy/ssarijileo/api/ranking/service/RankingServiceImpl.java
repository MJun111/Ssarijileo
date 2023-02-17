package com.ssafy.ssarijileo.api.ranking.service;

import com.ssafy.ssarijileo.api.ranking.dto.RankingDto;
import com.ssafy.ssarijileo.api.ranking.dto.RankingType;
import com.ssafy.ssarijileo.common.redis.RedisBase;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.time.Duration;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RankingServiceImpl implements RankingService {

    private final RedisBase redisBase;

    public void setRanking(RankingType rankingType, List<RankingDto> list) {
        int days;
        switch(rankingType) {
            case MONTH: days = 30; break;
            case WEEK: days = 7; break;
            default: days = 1; break;
        }
        redisBase.set("ranking:" + rankingType, list, Duration.ofDays(days));
    }

    public List<RankingDto> getRanking(RankingType rankingType) {
        return redisBase.getList("ranking:" + rankingType, RankingDto.class);
    }
}
