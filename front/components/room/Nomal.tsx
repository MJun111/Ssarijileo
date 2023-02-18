import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { RootState } from '@/redux/store';

import { useCanvas } from '@/hooks/useCanvas';
import { useAnimation } from '@/hooks/useAnimation';
import { NextSong } from '@/components/room/MainScreen';

import { setSsari } from '@/redux/store/ssariSlice';
import { getCookie } from '@/util/cookie';

import styles from '@/styles/room/Nomal.module.scss';

function Nomal(props: {
  nextSong: NextSong;
  screenShare: (
    audioContext: AudioContext,
    mp3AudioDestination: MediaStreamAudioDestinationNode,
  ) => void;
  screen: any;
  recordStop: () => void;
}) {
  const { nextSong, screenShare, screen, recordStop } = props;
  const [nowtime, setTime] = useState(0);
  const [isPlay, setIsPlay] = useState(false);
  const dispatch = useDispatch();

  // 저장되어있는 상태값 불러오기
  const storeSsari = useSelector((state: RootState) => state.ssari);

  const videoRef = useRef<HTMLVideoElement>(null);
  const musicRef = useRef<AudioBufferSourceNode>();
  const startTimeRef = useRef<number>(Date.now());
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
    const deltaTime = (Date.now() - startTimeRef.current) / 1000;
    setTime(Math.floor(deltaTime));
    if (nextSong.time < deltaTime) {
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

  const stopMusic = async () => {
    await axios.delete('api/v1/reservation/sing', {
      headers: {
        Authorization: getCookie('Authorization'),
        refreshToken: getCookie('refreshToken'),
      },
      data: {
        songId: nextSong.songId,
        time: Math.floor((Date.now() - startTimeRef.current) / 1000),
      },
    });
    dispatch(setSsari(7));
    recordStop();
  };

  useEffect(() => {
    const fetchMusic = async () => {
      if (storeSsari.ssari === 6) return;
      const musicAudioCtx = new AudioContext();
      const gainNode = musicAudioCtx.createGain();
      const response = await fetch(nextSong.file);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await musicAudioCtx.decodeAudioData(arrayBuffer);
      const musicSource = musicAudioCtx.createBufferSource();
      const mp3AudioDestination = musicAudioCtx.createMediaStreamDestination();
      gainNode.gain.value = 0.5;
      musicSource.connect(gainNode);
      musicSource.buffer = audioBuffer;
      musicSource.connect(musicAudioCtx.destination);
      musicSource.connect(mp3AudioDestination);
      musicRef.current = musicSource;
      musicRef.current.onended = () => {
        stopMusic();
      };
      musicRef.current.start();
      startTimeRef.current = Date.now();
      await axios.post(
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
      );
      setIsPlay(true);
      screenShare(musicAudioCtx, mp3AudioDestination);
    };
    fetchMusic();
  }, [storeSsari.ssari]);

  useEffect(() => {
    if (screen !== undefined && !!videoRef.current) {
      screen.addVideoElement(videoRef.current);
    }
  }, [screen]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {storeSsari.ssari === 5 && (
          <canvas
            id="screen-screen"
            width={canvasWidth}
            height={canvasHeight}
            ref={canvasRef}
            className={styles.canvas}
          />
        )}
        {storeSsari.ssari === 6 && (
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
          onClick={async () => {
            musicRef.current?.stop(0);
            await stopMusic();
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
