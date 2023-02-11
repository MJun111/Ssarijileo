import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import styles from '@/styles/room/CommonState.module.scss';
import { setSsari } from '@/redux/store/ssariSlice';

function CommonState({ title }: any) {
  const [time, setTime] = useState(0);

  // 저장되어있는 상태값 불러오기
  const [nowState, setNowState] = useState(0);
  const storeSsari = useSelector((state: RootState) => state.ssari);
  const dispatch = useDispatch();

  useEffect(() => {
    setNowState(storeSsari.ssari);
  }, [storeSsari]);

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
          if (nowState === 2) {
            dispatch(setSsari(3));
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
        {nowState !== 2 && title}
        {nowState === 2 && (
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
                    dispatch(setSsari(3));
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
                    dispatch(setSsari(3));
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
        {nowState === 2 && (
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
