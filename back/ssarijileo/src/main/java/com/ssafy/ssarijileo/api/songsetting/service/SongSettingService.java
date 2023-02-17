package com.ssafy.ssarijileo.api.songsetting.service;

import com.ssafy.ssarijileo.api.songsetting.dto.SongSettingDto;
import com.ssafy.ssarijileo.api.songsetting.entity.SongSetting;

public interface SongSettingService {

	SongSettingDto findSongSettingByUserId(String userId);

	void updateSongSetting(SongSettingDto songSettingDto);
}
