package com.ssafy.ssarijileo.api.favoritesong.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteSongDto {

	// PK (AUTO_INCREMENT)
	Long favoriteSongId;

	// 사용자PK
	String userId;

	// 노래PK
	Long songId;
	
	// 좋아요 여부
	String isLike;
}
