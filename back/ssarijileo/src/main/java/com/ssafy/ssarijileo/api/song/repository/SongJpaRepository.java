package com.ssafy.ssarijileo.api.song.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ssafy.ssarijileo.api.song.entity.Song;

@Repository
public interface SongJpaRepository extends JpaRepository<Song, Long> {
    @Query("SELECT song.time FROM Song song WHERE song.songId = :songId")
    String findTimeBySongId(Long songId);
}
