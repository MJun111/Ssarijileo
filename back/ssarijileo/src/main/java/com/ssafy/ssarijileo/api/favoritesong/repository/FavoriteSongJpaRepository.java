package com.ssafy.ssarijileo.api.favoritesong.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ssafy.ssarijileo.api.favoritesong.entity.FavoriteSong;

public interface FavoriteSongJpaRepository extends JpaRepository<FavoriteSong, Long> {

	@Query("SELECT favoriteSong.songId FROM FavoriteSong favoriteSong WHERE favoriteSong.userId = :userId ORDER BY favoriteSong.registerDate DESC")
	String[] findLatestSongIdByUserId(String userId);

}
