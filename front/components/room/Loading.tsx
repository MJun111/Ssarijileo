import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import styles from '@/styles/room/Loading.module.scss';
import { RootState } from '@/redux/store';

function Loading() {
  const storeTheme = useSelector((state: RootState) => state.theme);
  const { theme } = storeTheme;

  const img = {
    loading: `img/ssari/${theme}/${theme}_ssari_loading_image.svg`,
  };
  return (
    <div className={styles.container}>
      <div className={styles.loading}>
        <div className={styles.loadImg}>
          <Image
            src={img.loading}
            alt="load img"
            width={200}
            height={200}
            priority
          />
        </div>
        <div className={styles.loadContext}>
          방을 만드는 중입니다. 잠시만 기다려 주세요.
        </div>
      </div>
    </div>
  );
}

export default Loading;
