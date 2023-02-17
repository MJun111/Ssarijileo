package com.ssafy.ssarijileo.api.singingcontest.entity;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import org.hibernate.annotations.DynamicInsert;

import com.ssafy.ssarijileo.api.recording.entity.Recording;
import com.ssafy.ssarijileo.api.singingcontest.dto.SingingContestResponseDto;
import com.ssafy.ssarijileo.api.singingcontest.dto.SingingContestUpdateDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@DynamicInsert
public class SingingContest {

	// PK (AUTO_INCREMENT)
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long singingContestId;

	// 녹화PK
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "recording_id")
	private Recording recording;

	// 등록일시
	private String registerDate;

	// 상태(V:노출,D:삭제,B:신고)
	private String status;

	// Dto to Entity
	@Builder
	public SingingContest(Recording recording) {
		this.recording = recording;
	}

	// Entity to Dto
	public SingingContestResponseDto toDto() {
		return new SingingContestResponseDto(
						singingContestId, recording.getProfile().getNickname()
						, recording.getProfile().getImage(), recording.getSong().getTitle()
						, recording.getSong().getSinger(), recording.getFile()
						, registerDate, 0L, false);
	}

	public void updateStatus(String status) {
		this.status = status;
	}
}
