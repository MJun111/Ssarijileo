package com.ssafy.ssarijileo.api.ranking.service;


import com.ssafy.ssarijileo.api.ranking.dto.RankingDto;
import com.ssafy.ssarijileo.api.ranking.dto.RankingType;

import java.text.ParseException;
import java.util.List;

public interface RankingService {
    List<RankingDto> findRanking(String userId, RankingType rankingType);
    List<RankingDto> findRankingDB(String userId, RankingType rankingType);
    List<RankingDto> getRanking(RankingType rankingType);
//    void dailyGetRanking();
//    void weeklyGetRanking();
//    void monthlyGetRanking();

}
