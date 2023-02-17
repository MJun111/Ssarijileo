package com.ssafy.ssarijileo.api.ranking.service;

import com.ssafy.ssarijileo.api.ranking.dto.RankingDto;
import com.ssafy.ssarijileo.api.ranking.dto.RankingType;

import java.util.List;

public interface RankingService {
    void setRanking(RankingType rankingType, List<RankingDto> list);
    List<RankingDto> getRanking(RankingType rankingType);
}
