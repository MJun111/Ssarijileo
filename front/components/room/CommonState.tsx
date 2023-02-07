import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '@/styles/room/CommonState.module.scss';

function CommonState({ title }: any) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => {
        if (prev === 600) {
          window.close();
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.content}>{title}</div>
      <div className={styles.timeLine}>
        <Image
          src="img/room/room_wifi_image.svg"
          width={32}
          height={30}
          alt="wifi"
          className={styles.icon}
        />
        <div className={styles.bar}>
          <input className={styles.input} type="range" value={time / 6} />
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
