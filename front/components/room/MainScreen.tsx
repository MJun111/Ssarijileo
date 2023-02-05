import React, { useRef, useEffect } from 'react';

import styles from '@/styles/room/Screen.module.scss';

function MainScreen({ streamManager }: any) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const screen = streamManager;

  useEffect(() => {
    if (screen && !!videoRef) {
      screen.addVideoElement(videoRef.current);
    }
  }, [screen]);

  return (
    <div className={styles.myScreen}>
      <video className={styles.video} autoPlay ref={videoRef}>
        <track kind="captions" />
      </video>
    </div>
  );
}

export default MainScreen;
