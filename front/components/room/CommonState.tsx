import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '@/styles/room/CommonState.module.scss';

function CommonState(props: { title: any; setState: any; state: number }) {
  const { title, setState, state } = props;
  const [time, setTime] = useState(0);

  const nextSong = [
    {
      title: '가을 아침',
      singer: '아이유',
    },
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => {
        if (prev === 600) {
          if (state === 2) {
            setState(3);
          } else {
            window.close();
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
        {state !== 2 && title}
        {state === 2 && (
          <div className={styles.btn}>
            <div className={styles.item}>
              <div className={styles.back}>
                <Image
                  src="img/room/room_video_image.svg"
                  width={58}
                  height={38}
                  alt="video"
                  className={styles.icon}
                  onClick={() => {
                    setState(3);
                  }}
                />
              </div>
              <div className={styles.context}>
                녹화모드로 <br /> 시작하기
              </div>
            </div>
            <div className={styles.item}>
              <div className={styles.back}>
                <Image
                  src="img/room/room_play_image.svg"
                  width={50}
                  height={58}
                  alt="play"
                  className={styles.icon}
                  onClick={() => {
                    setState(3);
                  }}
                />
              </div>
              <div className={styles.context}>
                일반모드로 <br /> 시작하기
              </div>
            </div>
          </div>
        )}
      </div>
      <div className={styles.timeLine}>
        {state === 2 && (
          <span className={styles.nextInfo}>
            {nextSong[0].title}-{nextSong[0].singer}
          </span>
        )}
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
            value={time / 6}
            readOnly
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
          <div>10 : 00</div>
        </div>
      </div>
    </div>
  );
}
export default CommonState;
