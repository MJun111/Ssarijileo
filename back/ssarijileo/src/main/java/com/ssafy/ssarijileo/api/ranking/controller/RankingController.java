package com.ssafy.ssarijileo.api.ranking.controller;

import com.ssafy.ssarijileo.api.ranking.dto.RankingDto;
import com.ssafy.ssarijileo.api.ranking.dto.RankingType;
import com.ssafy.ssarijileo.api.ranking.service.RankingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/ranking")
public class RankingController {

    private final RankingService rankingService;

    @GetMapping("/{rankingType}")
    public List<RankingDto> getRanking(@PathVariable RankingType rankingType) {
        return rankingService.getRanking(rankingType);
    }

    @PostMapping("/{rankingType}")
    public void setRanking(@PathVariable RankingType rankingType, @RequestBody List<RankingDto> list) {
        rankingService.setRanking(rankingType, list);
    }

}
