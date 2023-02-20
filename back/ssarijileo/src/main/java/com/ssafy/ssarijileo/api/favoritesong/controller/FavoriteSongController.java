package com.ssafy.ssarijileo.api.favoritesong.controller;

import com.ssafy.ssarijileo.api.favoritesong.service.FavoriteSongService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 *  ranking <-> business
 */
@RequiredArgsConstructor
@RestController
@Slf4j
@RequestMapping("/api/v1/favorite-song")
public class FavoriteSongController {

    private final FavoriteSongService favoriteSongService;

    @GetMapping("/{userId}/{songId}")
    Boolean isFavoriteSong(@RequestParam("userId") String userId, @RequestParam("songId") Long songId) {
        return favoriteSongService.hasSubscribed(userId, songId);
    }
}
