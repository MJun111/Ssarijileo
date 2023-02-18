import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

import { Session } from 'openvidu-browser';
import { NextSong } from '@/components/room/MainScreen';

import styles from '@/styles/room/Guess.module.scss';

function Guess(props: { session: Session; nextSong: NextSong; screen: any }) {
  const { session, nextSong, screen } = props;
  const videoRef = useRef<HTMLVideoElement>(null);

  const lyricList = nextSong.lyricsList.map((item: any) => {
    // setInterval로 다음 가사 시간 전까지 class지정
    return (
      <div className={styles.item} key={item.lyricsId}>
        {item.verse}
      </div>
    );
  });

  useEffect(() => {
    if (screen !== undefined && !!videoRef.current) {
      screen.addVideoElement(videoRef.current);
    }
  }, [screen]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.lyric}>{lyricList}</div>
        <div className={styles.btnList}>
          <Image
            className={styles.o}
            src="img/ssari/ssari_o_image.svg"
            width={50}
            height={50}
            alt="o"
            onClick={() => {
              session.signal({
                data: 'ok', // Any string (optional)
                to: [], // Array of Connection objects (optional. Broadcast to everyone if empty)
                type: 'btn', // The type of message (optional)
              });
            }}
          />
          <Image
            className={styles.x}
            src="img/ssari/ssari_x_image.svg"
            width={50}
            height={50}
            alt="x"
            onClick={() => {
              session.signal({
                data: 'no', // Any string (optional)
                to: [], // Array of Connection objects (optional. Broadcast to everyone if empty)
                type: 'btn', // The type of message (optional)
              });
            }}
          />
<<<<<<< front/components/room/Guess.tsx
          <video className={styles.video} autoPlay ref={videoRef}>
            <track kind="captions" />
          </video>
=======
          <canvas id="screen-screen" />
>>>>>>> front/components/room/Guess.tsx
        </div>
      </div>
    </div>
  );
}

export default Guess;
