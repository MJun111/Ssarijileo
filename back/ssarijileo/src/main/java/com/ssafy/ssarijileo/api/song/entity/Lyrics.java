package com.ssafy.ssarijileo.api.song.entity;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import com.ssafy.ssarijileo.api.song.dto.LyricsDto;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Getter;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Lyrics {

	// PK (AUTO_INCREMENT)
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long lyricsId;

	// 노래PK
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "song_id")
	private Song song;

	// 한소절
	private String verse;

	// 시간
	private String time;

	// Entity to Dto
	public LyricsDto toDto() {
		return new LyricsDto(lyricsId, verse, time);
	}
}
