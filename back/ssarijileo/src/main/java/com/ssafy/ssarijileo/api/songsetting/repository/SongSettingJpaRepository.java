package com.ssafy.ssarijileo.api.songsetting.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.ssarijileo.api.songsetting.entity.SongSetting;

@Repository
public interface SongSettingJpaRepository extends JpaRepository<SongSetting, String> {
}
