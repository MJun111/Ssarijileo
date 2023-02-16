// Path: '/'
import { useSelector } from 'react-redux';
import { GetServerSideProps } from 'next';

import axios from 'axios';
import { RootState } from '@/redux/store';

import { useCookie } from '@/hooks/useCookie';
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
  image: string;
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
  const storeTheme = useSelector((state: RootState) => state.theme);
  const { theme } = storeTheme;

  const img = {
    team: `img/common/${theme || 'light'}/${
      theme || 'light'
    }_team_info_image.svg`,
  };

  const contestComponant = ranking ? (
    <TodayContest ranking={ranking} />
  ) : (
    <div className={styles.noContest}>
      <img
        src="img/main/light_main_contest_image.svg"
        width={500}
        height={500}
        alt="contestImg"
        className={styles.imgA}
      />
      <img
        src="img/main/dark_main_contest_image.svg"
        width={350}
        height={350}
        alt="contestImg"
        className={styles.imgB}
      />
      <div className={styles.context}>
        <b>
          {' '}
          싸리질러의 <br />
          노래왕은 누구 ?😎
          <br />{' '}
        </b>
        노래부르는 모습을 녹화해 <br />
        노래자랑 게시판에 공유해보세요 ! 🎵
      </div>
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
