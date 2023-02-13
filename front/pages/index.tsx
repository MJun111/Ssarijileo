// Path: '/'
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {GetServerSideProps} from "next";

import axios from 'axios';

import {useCookie} from "@/hooks/useCookie";
import MainTop from '@/components/main/MainTop';
import SoundBar from '@/components/common/SoundBar';
import TodayChart from '@/components/main/TodayChart';
import TodayContest from '@/components/main/TodayContest';
import Team from '@/components/main/Team';

import styles from '@/styles/Home.module.scss';

export interface ChartItem {
  album: string;
  image: string;
  ranking: number;
  singer: string;
  songId: number;
  title: string;
}

export interface RankingItem {
  singingContestId: number;
  nickname: string;
  title: string;
  singer: string;
  file: string;
  registerDate: string;
  lickCount: number;
  like: boolean;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookieString = context.req.headers.cookie || '';
  const cookies = useCookie(cookieString);
  const token = cookies.Authorization;
  if (!token) {
    return {
      props: {
        chartItemA: null,
        chartItemB: null,
        ranking: null,
      }
    };
  }
  const chartRes = await axios.get(
    'http://i8b302.p.ssafy.io:8000/api/v1/ranking/daily',
    {
      headers: {
        Authorization: token,
      },
    }
  );
  if (chartRes.status !== 200) {
    return {
      props: {
        chartItemA: null,
        chartItemB: null,
        ranking: null,
      }
    };
  }
  const chartItemA: ChartItem[] = chartRes.data.slice(0, 5);
  const chartItemB: ChartItem[] = chartRes.data.slice(5, 10);
  
  const rankingRes = await axios.get(
    'http://i8b302.p.ssafy.io:8000/api/v1/singing-contest/', {
      headers: {
        Authorization: token,
      }
    });
  if (rankingRes.status !== 200) {
    return {
      props: {
        chartItemA: null,
        chartItemB: null,
        ranking: null,
      }
    };
  }
  const sortedRanking = rankingRes.data.sort((a: RankingItem, b: RankingItem) => {
    return b.lickCount - a.lickCount;
  });
  const ranking: RankingItem[] = sortedRanking.slice(0, 3);

  return {
    props: {
      chartItemA,
      chartItemB,
      ranking,
    },
  };
}

function Home(props: {
  chartItemA: ChartItem[];
  chartItemB: ChartItem[];
  ranking: RankingItem[];
  data: any;
}) {
  console.log(props.chartItemA);
  const { chartItemA, chartItemB, ranking } = props;
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
        {chartItemA && chartItemB && <TodayChart chartItemA={chartItemA} chartItemB={chartItemB}/>}
        {chartItemA && chartItemB && <SoundBar/>}
        {ranking && <TodayContest ranking={ranking}/>}
        {ranking && <SoundBar/>}
        <Team img={img} />
      </div>
    </main>
  );
}

export default Home;
