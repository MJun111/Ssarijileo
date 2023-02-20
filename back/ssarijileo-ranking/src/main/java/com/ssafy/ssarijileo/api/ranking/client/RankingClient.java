package com.ssafy.ssarijileo.api.ranking.client;

import com.ssafy.ssarijileo.api.ranking.dto.RankingDto;
import com.ssafy.ssarijileo.api.ranking.dto.RankingType;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "ranking-client", url = "192.168.49.2:31000/api/v1/ranking")
public interface RankingClient {

    @GetMapping("/{rankingType}")
    List<RankingDto> getRanking(@PathVariable RankingType rankingType);

    @PostMapping("/{rankingType}")
    void setRanking(@PathVariable RankingType rankingType, @RequestBody List<RankingDto> list);

}
