package com.ssafy.ssarijileo.api.singingcontest.dto;

import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import com.ssafy.ssarijileo.api.recording.entity.Recording;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SingingContestResponseDto {

	// PK (AUTO_INCREMENT)
	private Long singingContestId;

	// 사용자 닉네임
	String nickname;

	// 사용자 프로필 이미지
	String image;

	// 제목
	String title;

	// 가수
	String singer;

	// 녹화 파일
	String file;

	// 등록 일시
	String registerDate;

	// 좋아요 갯수
	Long likeCount;

	// 사용자 좋아요 여부
	boolean isLike;
}
