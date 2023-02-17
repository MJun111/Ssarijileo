package com.ssafy.ssarijileo.api.song.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "favorite-song-client", url = "192.168.49.2:31000/api/v1/favorite-song")
public interface FavoriteSongClient {

    @GetMapping("/{userId}/{songId}")
    Boolean isFavoriteSong(@RequestParam("userId") String userId, @RequestParam("songId") Long songId);

}
