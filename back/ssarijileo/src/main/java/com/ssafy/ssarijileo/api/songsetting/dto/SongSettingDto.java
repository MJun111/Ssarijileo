package com.ssafy.ssarijileo.api.songsetting.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SongSettingDto {

	// PK
	private String songSettingId;

	// 에코
	private double eco;

	// 음량
	private double volume;
}
