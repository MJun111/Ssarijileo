package com.ssafy.ssarijileo.api.ranking.client;

import com.ssafy.ssarijileo.api.ranking.dto.RankingDto;
import com.ssafy.ssarijileo.api.ranking.dto.RankingType;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "ranking-client", url = "192.168.49.2:31000/api/v1/ranking")
public interface RankingClient {

    @GetMapping("/{rankingType}")
    List<RankingDto> getRanking(@RequestParam RankingType rankingType);

    @PostMapping("/{rankingType}")
    void setRanking(@RequestParam RankingType rankingType, @RequestBody List<RankingDto> list);

}
