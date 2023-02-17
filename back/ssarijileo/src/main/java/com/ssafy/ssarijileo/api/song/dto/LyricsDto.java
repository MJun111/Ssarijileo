package com.ssafy.ssarijileo.api.song.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class LyricsDto {

	// PK (AUTO_INCREMENT)
	Long lyricsId;

	// 한소절
	String verse;

	// 시간
	private String time;
}
