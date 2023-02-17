package com.ssafy.ssarijileo.api.song.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.ssarijileo.api.song.dto.SongDto;
import com.ssafy.ssarijileo.api.favoritesong.entity.QFavoriteSong;
import com.ssafy.ssarijileo.api.song.entity.QSong;
import com.ssafy.ssarijileo.api.favoritesong.service.FavoriteSongService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Repository
@RequiredArgsConstructor
public class SongRepositoryImpl implements SongRepository{

	private final JPAQueryFactory jpaQueryFactory;
	private final FavoriteSongService favoriteSongService;

	QSong song = QSong.song;
	QFavoriteSong favoriteSong = QFavoriteSong.favoriteSong;

	@Override
	public Optional<List<SongDto>> findFavoriteSongByUserId(String userId) {
		// List<SongDto> songList = jpaQueryFactory
		// 	.select(Projections.fields(SongDto.class,
		// 		song.songId,
		// 		song.title,
		// 		song.singer,
		// 		song.album,
		// 		song.image,
		// 		song.releaseDate))
		// 	.from(song)
		// 	.where(song.songId.in(
		// 		JPAExpressions
		// 			.select(favoriteSong.song.songId)
		// 			.from(favoriteSong)
		// 			.where(favoriteSong.userId.eq(userId))
		// 			.groupBy(favoriteSong.song.songId)
		// 			.having(favoriteSong.song.songId.castToNum(Long.class).count().mod(2L).eq(1L))
		// 	))
		// 	.fetch();

		List<String> songIdList = new ArrayList<>(favoriteSongService.getUsersFavoriteSong(userId));
		List<SongDto> songList = jpaQueryFactory
			.select(Projections.fields(SongDto.class,
				song.songId,
				song.title,
				song.singer,
				song.album,
				song.image,
				song.releaseDate))
			.from(song)
			.where(song.songId.in(
				songIdList.stream().map(Long::parseLong).collect(Collectors.toList())
			))
			.fetch();

		if (songList == null) return Optional.empty();
		return Optional.ofNullable(songList);
	}
}
