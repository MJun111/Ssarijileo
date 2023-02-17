package com.ssafy.ssarijileo.api.song.repository;

import com.ssafy.ssarijileo.api.song.entity.FavoriteSong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavoriteSongJpaRepository extends JpaRepository<FavoriteSong, Long> {
    List<FavoriteSong> findByRegisterDateBetween(String startDate, String endDate);
}
