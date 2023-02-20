package com.ssafy.ssarijileo.api.ranking.controller;

import com.ssafy.ssarijileo.api.ranking.dto.RankingDto;
import com.ssafy.ssarijileo.api.ranking.dto.RankingType;
import com.ssafy.ssarijileo.api.ranking.service.RankingService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/ranking")
@RequiredArgsConstructor
public class RankingController {

    private final RankingService rankingService;

    @GetMapping("/daily")
    public ResponseEntity<List<RankingDto>> findDailyRanking(@RequestHeader Optional<String> userId) {
        return ResponseEntity.status(200).body(rankingService.findRanking(userId.orElse(new String()), RankingType.DAY));
    }
    @GetMapping("/weekly")
    public ResponseEntity<List<RankingDto>> findWeeklyRanking(@RequestHeader Optional<String> userId) {
        return ResponseEntity.status(200).body(rankingService.findRanking(userId.orElse(new String()), RankingType.WEEK));
    }
    @GetMapping("/monthly")
    public ResponseEntity<List<RankingDto>> findMonthlyRanking(@RequestHeader Optional<String> userId) {
        return ResponseEntity.status(200).body(rankingService.findRanking(userId.orElse(new String()), RankingType.MONTH));
    }

    // Redis 안거치고 DB 정보로 바로 업데이트 테스트코드
    @GetMapping("/db")
    public ResponseEntity<List<RankingDto>> findRankingDB(@RequestParam String type, @RequestHeader Optional<String> userId) {
        switch(type) {
            case "DAY" :
                return ResponseEntity.status(200).body(rankingService.findRankingDB(userId.orElse(new String()), RankingType.DAY));
            case "WEEK" :
                return ResponseEntity.status(200).body(rankingService.findRankingDB(userId.orElse(new String()), RankingType.WEEK));
            case "MONTH" :
                return ResponseEntity.status(200).body(rankingService.findRankingDB(userId.orElse(new String()), RankingType.MONTH));
        }
        return ResponseEntity.status(200).body(rankingService.findRankingDB(userId.orElse(new String()), RankingType.DAY));
    }
}
