// Path: '/'
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { GetServerSideProps } from 'next';

import axios from 'axios';

import { useCookie } from '@/hooks/useCookie';
import MainTop from '@/components/main/MainTop';
import SoundBar from '@/components/common/SoundBar';
import TodayChart from '@/components/main/TodayChart';
import TodayContest from '@/components/main/TodayContest';
import Team from '@/components/main/Team';

import styles from '@/styles/Home.module.scss';
import { RootState } from '@/redux/store';

export interface ChartItem {
  album: string;
  image: string;
  ranking: number;
  singer: string;
  songId: number;
  title: string;
  favoriteSong: boolean;
}

export interface RankingItem {
  singingContestId: number;
  nickname: string;
  title: string;
  singer: string;
  file: string;
  registerDate: string;
  likeCount: number;
  like: boolean;
}

export const getServerSideProps: GetServerSideProps = async context => {
  const cookieString = context.req.headers.cookie || '';
  const cookies = useCookie(cookieString);
  const token = cookies.Authorization;
  if (!token) {
    const chartRes = await axios.get(
      'http://i8b302.p.ssafy.io:8000/api/v1/ranking/daily',
    );
    const chartItemA: ChartItem[] = chartRes.data.slice(0, 5);
    const chartItemB: ChartItem[] = chartRes.data.slice(5, 10);

    return {
      props: {
        chartItemA,
        chartItemB,
        ranking: null,
      },
    };
  }
  try {
    const chartRes = await axios.get(
      'http://i8b302.p.ssafy.io:8000/api/v1/ranking/daily',
      {
        headers: {
          Authorization: token,
        },
      },
    );
    const chartItemA: ChartItem[] = chartRes.data.slice(0, 5);
    const chartItemB: ChartItem[] = chartRes.data.slice(5, 10);

    const rankingRes = await axios.get(
      'http://i8b302.p.ssafy.io:8000/api/v1/singing-contest/',
      {
        headers: {
          Authorization: token,
        },
      },
    );
    const sortedRanking = rankingRes.data.sort(
      (a: RankingItem, b: RankingItem) => {
        return b.likeCount - a.likeCount;
      },
    );
    const ranking: RankingItem[] = sortedRanking.slice(0, 3);

    return {
      props: {
        chartItemA,
        chartItemB,
        ranking,
      },
    };
  } catch (err) {
    return {
      redirect: {
        destination: '/403',
        permanent: false,
      },
    };
  }
};

function Home(props: {
  chartItemA: ChartItem[];
  chartItemB: ChartItem[];
  ranking: RankingItem[];
}) {
  const { chartItemA, chartItemB, ranking } = props;
  const [themeMode, setThemeMode] = useState('light');
  const storeTheme = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    setThemeMode(storeTheme.theme);
  }, [storeTheme]);

  const img = {
    team: `img/common/${themeMode || 'light'}/${
      themeMode || 'light'
    }_team_info_image.svg`,
  };

  const contestComponant = ranking ? (
    <TodayContest ranking={ranking} />
  ) : (
    <div className={styles.noContest}>
      <p>오늘의 공모전이 없습니다.</p>
    </div>
  );

  return (
    <main className={styles.main}>
      <MainTop />
      <div className={styles.container}>
        <SoundBar />
        <TodayChart chartItemA={chartItemA} chartItemB={chartItemB} />
        <SoundBar />
        {contestComponant}
        <SoundBar />
        <Team img={img} />
      </div>
    </main>
  );
}

export default Home;
