import React, { useRef, useEffect, useState } from 'react';
import classnames from 'classnames';
import styles from '@/styles/room/Screen.module.scss';

function SingerScreen(props: { streamManager: any; session: any }) {
  const { streamManager, session } = props;
  const [isBtn, setIsBtn] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const screen = streamManager;

  useEffect(() => {
    if (screen && !!videoRef.current) {
      screen.addVideoElement(videoRef.current);
    }
  }, [screen]);

  let screenClass = classnames({
    [styles.singerScreen]: true,
  });

  useEffect(() => {
    screenClass = classnames({
      [styles.singerScreen]: true,
      [styles.ok]: isBtn === 'ok',
      [styles.no]: isBtn === 'no',
    });
  }, [isBtn]);

  useEffect(() => {
    session.on('signal:btn', (event: any) => {
      const btnType = event.data;
      console.log('예약리스트', btnType);
      setIsBtn(btnType);
      setTimeout(() => {
        setIsBtn('');
        console.log(isBtn);
      }, 3000);
    });
  }, []);

  // console.log(isBtn);
  // const screenClass = classnames({
  //   [styles.singerScreen]: true,
  //   [styles.ok]: isBtn === 'ok',
  //   [styles.no]: isBtn === 'no',
  // });

  return (
    <div className={screenClass}>
      <video className={styles.video} autoPlay ref={videoRef}>
        <track kind="captions" />
      </video>
    </div>
  );
}

export default SingerScreen;
