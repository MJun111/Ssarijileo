package com.ssafy.ssarijileo.api.songsetting.service;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.ssafy.ssarijileo.api.songsetting.dto.SongSettingDto;
import com.ssafy.ssarijileo.api.songsetting.entity.SongSetting;
import com.ssafy.ssarijileo.api.songsetting.repository.SongSettingJpaRepository;
import com.ssafy.ssarijileo.common.exception.NotFoundException;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
@Transactional
public class SongSettingServiceImpl implements SongSettingService{

	private final SongSettingJpaRepository songSettingJpaRepository;

	@Override
	public SongSettingDto findSongSettingByUserId(String userId) {
		return songSettingJpaRepository.findById(userId).orElseThrow(NotFoundException::new).toDto();
	}

	@Override
	public void updateSongSetting(SongSettingDto songSettingDto) {
		SongSetting songSetting = songSettingJpaRepository.findById(songSettingDto.getSongSettingId()).orElseThrow(NotFoundException::new);
		songSetting.updateSetting(songSettingDto.getEco(), songSettingDto.getVolume());
	}
}
