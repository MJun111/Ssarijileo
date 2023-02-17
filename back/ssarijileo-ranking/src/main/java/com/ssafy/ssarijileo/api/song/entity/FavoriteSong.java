package com.ssafy.ssarijileo.api.song.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteSong {

    // PK (AUTO_INCREMENT)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long favoriteSongId;

    // 사용자PK
    private String userId;

    // 노래PK
    private String songId;

    // 등록 날짜
    private String registerDate;

}