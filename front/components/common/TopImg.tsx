import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import styles from '@/styles/common/TopImg.module.scss';

function TopImg() {
  const [themeMode, setThemeMode] = useState('light');
  const storeTheme = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    setThemeMode(storeTheme.theme);
  }, [storeTheme]);

  const img = {
    background: `img/common/${themeMode}/${themeMode}_background_img.svg`,
  };
  return (
    <Image
      src={img.background}
      width={798}
      height={701}
      alt="background"
      className={styles.background}
      priority
    />
  );
}

export default TopImg;
