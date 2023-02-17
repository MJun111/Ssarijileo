package com.ssafy.ssarijileo.api.ranking.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RankingDto implements Serializable {

    // 순위
    int ranking;

    // 노래 ID
    Long songId;

    // 노래 제목
    String title;

    // 가수
    String singer;

    // 앨범 제목
    String album;

    // 앨범 이미지
    String image;

    // 애창곡 여부
    boolean isFavoriteSong;

    public void updateFavoriteSong(boolean isFavoriteSong) {
        this.isFavoriteSong = isFavoriteSong;
    }

}
