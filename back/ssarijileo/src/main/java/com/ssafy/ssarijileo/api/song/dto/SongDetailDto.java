package com.ssafy.ssarijileo.api.song.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SongDetailDto {

	// PK (AUTO_INCREMENT)
	Long songId;

	// 제목
	String title;

	// 가수
	String singer;

	// 앨범명
	String album;

	// 시간
	String time;

	// 앨범이미지
	String image;

	// 노래 파일
	String file;

	// 발매일자
	String releaseDate;

	// 시간음정
	String note;

	// 가사 목록
	List<LyricsDto> lyricsList = new ArrayList<>();
}

