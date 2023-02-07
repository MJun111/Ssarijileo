import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '@/styles/room/Nomal.module.scss';

function Nomal(props: { setState: any; reserv: any }) {
  const { setState, reserv } = props;
  const [time, setTime] = useState(0);
  const [lyricA, setTextA] = useState('간주중');
  const [lyricB, setTextB] = useState('...');

  // let lyricA = '';
  // let lyricB = '';
  useEffect(() => {
    const audio = new Audio('sounds/가을아침MR.mp3');
    audio.play();
    const interval = setInterval(() => {
      setTime(prev => {
        if (prev === reserv.time) {
          audio.pause();
          audio.load();
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
        {lyricA} <br />
        {lyricB}
        <video
          className={styles.discoA}
          autoPlay={true}
          loop={true}
          muted={true}
          playsInline={true}
          width={73}
          height={73}
          src="video/disco-ball.mp4"
        >
          <track kind="captions" />{' '}
        </video>
        <video
          className={styles.discoB}
          autoPlay={true}
          loop={true}
          muted={true}
          playsInline={true}
          width={73}
          height={73}
          src="video/disco-ball.mp4"
        >
          <track kind="captions" />{' '}
        </video>
        <video
          className={styles.mic}
          autoPlay={true}
          loop={true}
          muted={true}
          playsInline={true}
          width={73}
          height={73}
          src="video/microphone.mp4"
        >
          <track kind="captions" />{' '}
        </video>
        <video
          className={styles.speaker}
          autoPlay={true}
          loop={true}
          muted={true}
          playsInline={true}
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
            // audio.pause();
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
