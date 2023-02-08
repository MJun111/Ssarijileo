import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import styles from '@/styles/room/Loading.module.scss';

function Loading() {
  const [themeMode, setThemeMode] = useState('light');

  const storeTheme = useSelector<any>(state => state.theme);
  useEffect(() => {
    setThemeMode(localStorage.getItem('theme') || 'light');
  }, [themeMode, storeTheme]);

  const img = {
    loading: `img/ssari/${themeMode || 'light'}/${
      themeMode || 'light'
    }_ssari_loading_image.svg`,
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
