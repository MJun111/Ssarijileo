// Path: '/'
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// import axios from 'axios';

import MainTop from '@/components/main/MainTop';
import SoundBar from '@/components/common/SoundBar';
import TodayChart from '@/components/main/TodayChart';
import TodayContest from '@/components/main/TodayContest';
import Team from '@/components/main/Team';

import styles from '@/styles/Home.module.scss';

// 데이터
export async function getServerSideProps() {
  // const chartRes = await axios.get('api/v1/chart');
  // const { chartItemA, chartItemB } = chartRes.data;
  // const rankingRes = await axios.get('api/v1/ranking');
  // const { ranking } = rankingRes.data;

  return {
    props: {
      data: {
        chartItemA: [
          {
            rank: 1,
            title: 'Ditto',
            singer: 'NewJeans',
          },
          {
            rank: 2,
            title: '사건의 지평선',
            singer: '윤하',
          },
          {
            rank: 3,
            title: 'Hype boy',
            singer: 'NewJeans',
          },
          {
            rank: 4,
            title: 'OMG',
            singer: 'NewJeans',
          },
          {
            rank: 5,
            title: 'After LIKE',
            singer: 'IVE(아이브)',
          },
        ],
        chartItemB: [
          {
            rank: 6,
            title: 'ANTIFRAGILE',
            singer: 'LE SSERAFIM (르세라핌)',
          },
          {
            rank: 7,
            title: 'Attention',
            singer: 'NewJeans',
          },
          {
            rank: 8,
            title: 'LOVE DIVE',
            singer: 'IVE(아이브)',
          },
          {
            rank: 9,
            title: 'Nxde',
            singer: '여자(아이들)',
          },
          {
            rank: 10,
            title: 'NOT SORRY (Feat. pH-1) (Prod. by Slom)',
            singer: '이영지',
          },
        ],
        ranking: [
          {
            rank: 1,
            medal: 'img/main/main_medal_gold_image.svg',
            profile: 'icon/header/light/light_profile_icon.svg',
            name: '나는이수민',
            title: 'Hype boy',
            singer: 'NewJeans',
            like: '4k',
          },
          {
            rank: 2,
            medal: 'img/main/main_medal_sliver_image.svg',
            profile: 'icon/header/light/light_profile_icon.svg',
            name: '김맹준',
            title: 'Hype boy',
            singer: 'NewJeans',
            like: '4k',
          },
          {
            rank: 3,
            medal: 'img/main/main_medal_bronze_image.svg',
            profile: 'icon/header/light/light_profile_icon.svg',
            name: 'zㅣ존예지',
            title: 'Hype boy',
            singer: 'NewJeans',
            like: '4k',
          },
        ],
      },
    },
  };
}

function Home(props: any) {
  const { chartItemA, chartItemB, ranking } = props.data;
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
        <TodayChart data={{ chartItemA, chartItemB }} />
        <SoundBar />
        <TodayContest data={{ ranking }} />
        <SoundBar />
        <Team img={img} />
      </div>
    </main>
  );
}

export default Home;
