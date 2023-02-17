package com.ssafy.ssarijileo.api.song.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SongDto {

	// PK (AUTO_INCREMENT)
	Long songId;

	// 제목
	String title;

	// 가수
	String singer;

	// 앨범명
	String album;

	// 앨범이미지
	String image;

	// 발매일자
	String releaseDate;
}

