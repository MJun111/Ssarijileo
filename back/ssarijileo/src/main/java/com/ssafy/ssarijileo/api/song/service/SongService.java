package com.ssafy.ssarijileo.api.song.service;

import java.util.List;

import com.ssafy.ssarijileo.api.song.dto.FavoriteSongDto;
import com.ssafy.ssarijileo.api.song.dto.SongDetailDto;
import com.ssafy.ssarijileo.api.song.dto.SongDto;

public interface SongService {

	List<SongDto> findAllSong();

	List<SongDetailDto> findAllSongDetail();

	SongDetailDto findSongDetailById(Long songId);

	List<SongDto> findSongByUserId(String userId);

	void setFavoriteSong(FavoriteSongDto favoriteSongDto);

	void saveFavoriteSong();
}
