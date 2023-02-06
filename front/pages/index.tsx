// Path: '/'
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// import { Inter } from '@next/font/google';

import MainTop from '@/components/main/MainTop';
import SoundBar from '@/components/common/SoundBar';
import TodayChart from '@/components/main/TodayChart';
import TodayContest from '@/components/main/TodayContest';
import Team from '@/components/main/Team';

import styles from '@/styles/Home.module.scss';

// const inter = Inter({ subsets: ['latin'] });

function Home() {
  const [themeMode, setThemeMode] = useState('light');
  const storeTheme: any = useSelector<any>(state => state.theme);

  useEffect(() => {
    setThemeMode(storeTheme.theme);
  }, [storeTheme]);

  const img = {
    team: `img/common/${themeMode || 'light'}/${
      themeMode || 'light'
    }_team_info_image.svg`,
  };

  return (
    <main className={styles.main}>
      <MainTop />
      <div className={styles.container}>
        <SoundBar />
        <TodayChart />
        <SoundBar />
        <TodayContest />
        <SoundBar />
        <Team img={img} />
      </div>
    </main>
  );
}

export default Home;
