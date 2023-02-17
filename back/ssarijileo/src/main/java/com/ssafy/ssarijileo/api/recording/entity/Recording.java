package com.ssafy.ssarijileo.api.recording.entity;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import org.hibernate.annotations.DynamicInsert;

import com.ssafy.ssarijileo.api.profile.entitiy.Profile;
import com.ssafy.ssarijileo.api.recording.dto.RecordingDto;
import com.ssafy.ssarijileo.api.recording.dto.RecordingResponseDto;
import com.ssafy.ssarijileo.api.song.entity.Song;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.Getter;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@DynamicInsert
public class Recording {

	// PK (AUTO_INCREMENT)
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long recordingId;

	// 사용자PK
	@ManyToOne
	@JoinColumn(name = "user_id")
	private Profile profile;

	// 노래PK
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "song_id")
	private Song song;

	// 녹화파일
	private String file;

	// 녹화일시
	private String registerDate;

	// 상태(V:노출,D:삭제)
	private String status;

	// Dto to Entity
	@Builder
	public Recording(RecordingDto recordingDto, Profile profile, Song song) {
		this.recordingId = recordingDto.getRecordingId();
		this.profile = profile;
		this.song = song;
		this.file = recordingDto.getFile();
		this.registerDate = recordingDto.getRegisterDate();
		this.status = recordingDto.getStatus();
	}

	// Entity to Dto
	public RecordingResponseDto toDto(){
		return new RecordingResponseDto(recordingId, song.getTitle(), song.getSinger(), file, registerDate, status);
	}

	public void updateStatus(String status) {
		this.status = status;
	}
}
