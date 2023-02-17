package com.ssafy.ssarijileo.api.song.repository;

import java.util.List;
import java.util.Optional;

import com.ssafy.ssarijileo.api.song.dto.SongDto;

public interface SongRepository {

	Optional<List<SongDto>> findFavoriteSongByUserId(String userId);
}
