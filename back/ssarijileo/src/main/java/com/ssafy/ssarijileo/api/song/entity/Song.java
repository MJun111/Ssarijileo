package com.ssafy.ssarijileo.api.song.entity;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import com.ssafy.ssarijileo.api.song.dto.LyricsDto;
import com.ssafy.ssarijileo.api.song.dto.SongDetailDto;
import com.ssafy.ssarijileo.api.song.dto.SongDto;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Getter;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Song {

	// PK (AUTO_INCREMENT)
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long songId;

	// 제목
	private String title;

	// 가수
	private String singer;

	// 앨범명
	private String album;

	// 시간
	private String time;

	// 앨범이미지
	private String image;

	// 노래 파일
	private String file;

	// 발매일자
	private String releaseDate;

	// 시간음정
	private String note;

	// 가사 목록
	@OneToMany(mappedBy = "song")
	private List<Lyrics> lyricsList = new ArrayList<>();

	// Entity to Dto
	public SongDto toDto() {
		return new SongDto(songId, title, singer, album, image, releaseDate);
	}

	// Entity to Dto
	public SongDetailDto toDetailDto() {
		List<LyricsDto> lyricsDtoList = lyricsList.stream().map(Lyrics::toDto).collect(Collectors.toList());
		return new SongDetailDto(songId, title, singer, album, time, image, file, releaseDate, note, lyricsDtoList);
	}
}
