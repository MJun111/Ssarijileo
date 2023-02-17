package com.ssafy.ssarijileo.api.song.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

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
}
