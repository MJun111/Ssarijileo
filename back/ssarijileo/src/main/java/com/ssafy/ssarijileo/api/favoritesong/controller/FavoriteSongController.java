package com.ssafy.ssarijileo.api.favoritesong.controller;

import com.ssafy.ssarijileo.api.favoritesong.service.FavoriteSongService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *  ranking <-> business
 */
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/favorite-song")
public class FavoriteSongController {

    private final FavoriteSongService favoriteSongService;

    @GetMapping("/{userId}/{songId}")
    Boolean isFavoriteSong(@RequestParam("userId") String userId, @RequestParam("songId") Long songId) {
        return favoriteSongService.hasSubscribed(userId, songId);
    }
}
