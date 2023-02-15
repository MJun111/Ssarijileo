import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { RootState } from '@/redux/store';

import { useCanvas } from '@/hooks/useCanvas';
import { useAnimation } from '@/hooks/useAnimation';
import { NextSong } from '@/components/room/MainScreen';

import styles from '@/styles/room/Nomal.module.scss';
import { setSsari } from '@/redux/store/ssariSlice';
import { getCookie } from '@/util/cookie';

function Nomal(props: {
  nextSong: NextSong;
  screenShare: any;
  screen: any;
  propState: any;
}) {
  const { nextSong, screenShare, screen, propState } = props;
  const [nowtime, setTime] = useState(0);
  const [isPlay, setIsPlay] = useState(false);
  const dispatch = useDispatch();

  // 저장되어있는 상태값 불러오기
  const [nowState, setNowState] = useState(propState);
  const storeSsari = useSelector((state: RootState) => state.ssari);
  useEffect(() => {
    setNowState(storeSsari.ssari);
  }, [storeSsari]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const sourceRef = useRef<AudioBufferSourceNode>();
  const startTime = useRef<number>(Date.now());
  const lyrics = nextSong.lyricsList;

  const canvasWidth = 910;
  const canvasHeight = 174;
  const canvasRef = useCanvas(canvasWidth, canvasHeight);
  const flag = useRef(true);
  const drawLyrics = () => {
    if (lyrics.length === 0) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.roundRect(0, 0, canvasWidth, canvasHeight, 10);
    ctx.fill();
    // ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    const deltaTime = (Date.now() - startTime.current) / 1000;
    setTime(Math.floor(deltaTime));
    if (nextSong.time < deltaTime) {
      dispatch(setSsari(7));
      // 예약목록 0번 인덱스 삭제...
      sourceRef.current?.stop(0);
      return;
    }
    if (lyrics.length > 1 && lyrics[1].time < deltaTime) {
      lyrics.shift();
      flag.current = !flag.current;
    }
    let lyricA: string;
    let lyricB: string;
    if (lyrics.length > 1) {
      lyricA = flag.current ? lyrics[0].verse : lyrics[1].verse;
      lyricB = flag.current ? lyrics[1].verse : lyrics[0].verse;
    } else if (lyrics.length === 1) {
      lyricA = flag.current ? lyrics[0].verse : ' ';
      lyricB = flag.current ? ' ' : lyrics[0].verse;
    } else {
      lyricA = ' ';
      lyricB = ' ';
    }
    if (lyrics.length === 1 && lyrics[0].time < deltaTime) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      // ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    } else if (lyrics[0].verse === '') {
      lyricA = '간주중';
      lyricB = '...';
      ctx.fillStyle = '#1f5c7d';
      ctx.fillText(lyricA, canvasWidth / 2, canvasHeight - 94);
      ctx.fillText(lyricB, canvasWidth / 2, canvasHeight - 42);
    } else {
      ctx.textAlign = 'center';
      ctx.font = '32px Jalnan';
      if (flag.current) {
        ctx.fillStyle = '#1f5c7d';
        ctx.fillText(lyricA, canvasWidth / 2, canvasHeight - 94);
        ctx.fillStyle = '#969696';
        ctx.fillText(lyricB, canvasWidth / 2, canvasHeight - 42);
      } else {
        ctx.fillStyle = '#969696';
        ctx.fillText(lyricA, canvasWidth / 2, canvasHeight - 94);
        ctx.fillStyle = '#1f5c7d';
        ctx.fillText(lyricB, canvasWidth / 2, canvasHeight - 42);
      }
    }
  };

  useAnimation(drawLyrics, 0);

  useEffect(() => {
    if (nowState === 5) {
      console.log('노말');
      fetch('sounds/사건의지평선_mr.mp3')
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => {
          const audioContext = new AudioContext();
          audioContext.decodeAudioData(arrayBuffer, audioBuffer => {
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            const mp3AudioDestination =
              audioContext.createMediaStreamDestination();
            source.connect(mp3AudioDestination);
            source.connect(audioContext.destination);
            source.start();
            console.log('현재 곡 정보', nextSong);
            axios
              .post(
                'api/v1/reservation/sing',
                {
                  songId: nextSong.songId,
                },
                {
                  headers: {
                    Authorization: `${getCookie('Authorization')}`,
                    refreshToken: `${getCookie('refreshToken')}`,
                  },
                },
              )
              .then(res => {
                console.log('노래 시작 요청 응답 : ', res);
              });
            sourceRef.current = source;
            startTime.current = Date.now();
            setIsPlay(true);
            screenShare(audioContext, mp3AudioDestination);
          });
        });
    }
  }, [nowState]);

  useEffect(() => {
    console.log('nowState!!', nowState);
    console.log('!!!!!!!!!', videoRef.current);
    if (screen !== undefined && !!videoRef.current) {
      screen.addVideoElement(videoRef.current);
      console.log('!!!!!!!!!2', videoRef.current);
    }
  }, [screen]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {nowState === 5 && (
          <canvas
            id="screen-screen"
            width={canvasWidth}
            height={canvasHeight}
            ref={canvasRef}
            className={styles.canvas}
          />
        )}
        {nowState === 6 && (
          <video className={styles.video} autoPlay ref={videoRef}>
            <track kind="captions" />
          </video>
        )}
        <video
          className={styles.discoA}
          autoPlay
          loop
          muted
          playsInline
          width={73}
          height={73}
          src="video/disco-ball.mp4"
        >
          <track kind="captions" />
        </video>
        <video
          className={styles.discoB}
          autoPlay
          loop
          muted
          playsInline
          width={73}
          height={73}
          src="video/disco-ball.mp4"
        >
          <track kind="captions" />
        </video>
        <video
          className={styles.mic}
          autoPlay
          loop
          muted
          playsInline
          width={73}
          height={73}
          src="video/microphone.mp4"
        >
          <track kind="captions" />
        </video>
        <video
          className={styles.speaker}
          autoPlay
          loop
          muted
          playsInline
          width={73}
          height={73}
          src="video/speakers.mp4"
        >
          <track kind="captions" />
        </video>
      </div>
      <div className={styles.timeLine}>
        <Image
          src="img/room/room_wifi_image.svg"
          width={32}
          height={30}
          alt="wifi"
          className={styles.icon}
        />
        <div className={styles.bar}>
          <input
            className={styles.input}
            type="range"
            value={(nowtime * 100) / nextSong.time}
            readOnly
          />
        </div>
        <div className={styles.value}>
          <div>
            {Math.floor(nowtime / 60) < 10
              ? `0${Math.floor(nowtime / 60)}`
              : Math.floor(nowtime / 60)}{' '}
            :{' '}
            {Math.floor(nowtime % 60) < 10
              ? `0${Math.floor(nowtime % 60)}`
              : Math.floor(nowtime % 60)}
          </div>
          <div>
            {Math.floor(nextSong.time / 60) < 10
              ? `0${Math.floor(nextSong.time / 60)}`
              : Math.floor(nextSong.time / 60)}{' '}
            :{' '}
            {Math.floor(nextSong.time % 60) < 10
              ? `0${Math.floor(nextSong.time % 60)}`
              : Math.floor(nextSong.time % 60)}
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            console.log('노래 취소 곡 정보 : ', nextSong);
            axios
              .delete('api/v1/reservation/sing', {
                data: {
                  songId: nextSong.songId,
                  time: nowtime,
                },
                headers: {
                  Authorization: `${getCookie('Authorization')}`,
                  refreshToken: `${getCookie('refreshToken')}`,
                },
              })
              .then(res => {
                console.log('노래 취소 요청 응답 : ', res.data);
              });
            sourceRef.current?.stop(0);
            // screenSession.forceunpublish(screen);
            console.log(sourceRef.current);
            dispatch(setSsari(7));
          }}
          className={styles.nextBtn}
          disabled={!isPlay}
        >
          다음 곡으로
        </button>
      </div>
    </div>
  );
}

export default Nomal;
