package com.ssafy.ssarijileo.api.profile.service;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.ssafy.ssarijileo.api.profile.client.ProfileClient;
import com.ssafy.ssarijileo.api.profile.dto.ProfileDto;
import com.ssafy.ssarijileo.api.profile.dto.ProfileInfoDto;
import com.ssafy.ssarijileo.api.profile.entitiy.Profile;
import com.ssafy.ssarijileo.api.profile.repository.ProfileJpaRepository;
import com.ssafy.ssarijileo.api.songsetting.entity.SongSetting;
import com.ssafy.ssarijileo.api.songsetting.repository.SongSettingJpaRepository;
import com.ssafy.ssarijileo.api.songsetting.service.SongSettingService;
import com.ssafy.ssarijileo.common.exception.NotFoundException;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@AllArgsConstructor
@Slf4j
public class ProfileServiceImpl implements ProfileService{

	private final ProfileJpaRepository profileJpaRepository;
	private final SongSettingJpaRepository songSettingJpaRepository;

	private final ProfileClient profileClient;

	@Override
	public void insertProfile(ProfileDto profileDto) {
		log.info("profileDto id = {}",profileDto.getProfileId());
		Profile profile = Profile.builder().profileDto(profileDto).build();
		log.info("profile id = {}",profile.getProfileId());
		profileJpaRepository.save(profile);

		SongSetting songSetting = SongSetting.builder().userId(profileDto.getProfileId()).build();
		songSettingJpaRepository.save(songSetting);

		// 알림을 위한 SSE 연결
		profileClient.connection(profileDto.getProfileId());
	}

	@Override
	public ProfileInfoDto findProfileById(String userId) {
		return  profileJpaRepository.findById(userId).orElseThrow(NotFoundException::new).toDto();
	}

	@Override
	public void updateProfile(ProfileInfoDto profileInfoDto) {
		Profile profile = profileJpaRepository.findById(profileInfoDto.getProfileId()).orElseThrow(NotFoundException::new);
		profile.updateNickname(profileInfoDto.getNickname());
		profileJpaRepository.save(profile);

		SongSetting songSetting = songSettingJpaRepository.findById(profileInfoDto.getProfileId()).orElseThrow(NotFoundException::new);
		songSetting.updateSetting(profileInfoDto.getEco(), profileInfoDto.getVolume());
		songSettingJpaRepository.save(songSetting);
	}

	@Override
	public void updateImage(ProfileDto profileDto) {
		Profile profile = profileJpaRepository.findById(profileDto.getProfileId()).orElseThrow(NotFoundException::new);
		profile.updateImage(profile.getImage());
		profileJpaRepository.save(profile);
	}
}
