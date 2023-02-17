package com.ssafy.ssarijileo.api.singing.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import com.ssafy.ssarijileo.api.profile.entitiy.Profile;
import com.ssafy.ssarijileo.api.profile.repository.ProfileJpaRepository;
import com.ssafy.ssarijileo.common.exception.NotFoundException;
import com.ssafy.ssarijileo.api.singing.dto.SingingDto;
import com.ssafy.ssarijileo.api.singing.entity.Singing;
import com.ssafy.ssarijileo.api.singing.repository.SingingJpaRepository;
import com.ssafy.ssarijileo.api.song.entity.Song;
import com.ssafy.ssarijileo.api.song.repository.SongJpaRepository;

import lombok.RequiredArgsConstructor;

@Slf4j
@Service
@RequiredArgsConstructor
public class SingingServiceImpl implements SingingService{

	private final SingingJpaRepository singingJpaRepository;
	private final ProfileJpaRepository profileJpaRepository;
	private final SongJpaRepository songJpaRepository;

	@Override
	public void insertSinging(SingingDto singingDto) {
		Profile profile = profileJpaRepository.findById(singingDto.getUserId()).orElseThrow(NotFoundException::new);
		Song song = songJpaRepository.findById(singingDto.getSongId()).orElseThrow(NotFoundException::new);
		singingDto.setSingingTime(songJpaRepository.findTimeBySongId(singingDto.getSongId()));
		Singing singing = Singing.builder().singingDto(singingDto).profile(profile).song(song).build();
		singingJpaRepository.save(singing);
	}

	@Override
	public void deleteSinging(SingingDto singingDto) {
		Profile profile = profileJpaRepository.findById(singingDto.getUserId()).orElseThrow(NotFoundException::new);
		Song song = songJpaRepository.findById(singingDto.getSongId()).orElseThrow(NotFoundException::new);
		Singing singing = Singing.builder().singingDto(singingDto).profile(profile).song(song).build();
		singingJpaRepository.save(singing);
	}
}
