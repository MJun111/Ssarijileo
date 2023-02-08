import React, { useState, useEffect } from 'react';
import Image from 'next/image';

import { useCanvas } from '@/hooks/useCanvas';
import { useAnimation } from '@/hooks/useAnimation';

import styles from '@/styles/room/Nomal.module.scss';

function Nomal(props: { setState: any; reserv: any }) {
  const { setState, reserv } = props;
  const [time, setTime] = useState(0);
  const [lyricA, setTextA] = useState('간주중');
  const [lyricB, setTextB] = useState('...');

  const canvasWidth = 950;
  const canvasHeight = 174;
  const canvasRef = useCanvas(canvasWidth, canvasHeight);
  const drawLyrics = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = '#1f5c7d';
    ctx.textAlign = 'center';
    ctx.font = '32px Jalnan';
    ctx.fillText(lyricA, canvasWidth / 2, canvasHeight - 94);
    ctx.fillText(lyricB, canvasWidth / 2, canvasHeight - 42);
  };

  useAnimation(drawLyrics, 0);

  const audio = new Audio('sounds/가을아침MR.mp3');
  useEffect(() => {
    audio.play();
    const interval = setInterval(() => {
      setTime(prev => {
        if (prev === reserv.time) {
          audio.pause();
          //   audio.load();
          setState(1);
        }
        if (
          reserv.lyricsList.length &&
          reserv.lyricsList[0].time === prev + 1
        ) {
          setTextA(reserv.lyricsList[0].verse);
          reserv.lyricsList.shift();
          if (reserv.lyricsList.length > 0) {
            setTextB(reserv.lyricsList[0].verse);
            reserv.lyricsList.shift();
          }
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <canvas
          id="screen-screen"
          width={canvasWidth}
          height={canvasHeight}
          ref={canvasRef}
        ></canvas>
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
          <track kind="captions" />{' '}
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
          <track kind="captions" />{' '}
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
          <track kind="captions" />{' '}
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
          <track kind="captions" />{' '}
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
            value={(time * 100) / reserv.time}
          />
        </div>
        <div className={styles.value}>
          <div>
            {Math.floor(time / 60) < 10
              ? `0${Math.floor(time / 60)}`
              : Math.floor(time / 60)}{' '}
            :{' '}
            {Math.floor(time % 60) < 10
              ? `0${Math.floor(time % 60)}`
              : Math.floor(time % 60)}
          </div>
          <div>
            {Math.floor(reserv.time / 60) < 10
              ? `0${Math.floor(reserv.time / 60)}`
              : Math.floor(reserv.time / 60)}{' '}
            :{' '}
            {Math.floor(reserv.time % 60) < 10
              ? `0${Math.floor(reserv.time % 60)}`
              : Math.floor(reserv.time % 60)}
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            audio.pause();
            // audio.load();
            setState(2);
          }}
          className={styles.nextBtn}
        >
          다음 곡으로
        </button>
      </div>
    </div>
  );
}

export default Nomal;
