package com.ssafy.ssarijileo.api.singing.entity;

import com.ssafy.ssarijileo.api.singing.dto.SingingDto;
import com.ssafy.ssarijileo.api.song.entity.Song;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.context.annotation.Profile;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Singing {

    // PK (AUTO_INCREMENT)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long singingId;

    // 노래PK
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "song_id")
    private Song song;

    // 모드(N:일반,P:퍼펙트스코어,O:가사순서맞추기,R:이어부르기)
    private char mode;

    // 점수
    private int score;

    // 부른시간
    private String singingTime;

    // 예약 추가, 취소 구분(I:추가, C:취소)
    String state;

    String singingDate;

    // Dto to Entity
    @Builder
    public Singing(SingingDto singingDto, Song song) {
        this.singingId = singingDto.getSingingId();
        this.song = song;
//		this.mode = singingDto.getMode();
//		this.score = singingDto.getScore();
        this.singingTime = singingDto.getSingingTime();
        this.state = singingDto.getState();
    }
}
