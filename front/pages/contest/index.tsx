// import styles from '@/styles/contest/Contest.module.scss';
import { GetServerSideProps } from 'next';
import axios from 'axios';

import ContestList from '@/components/contest/ContestList';

import ContestTop from '@/components/contest/ContestTop';
import SoundBar from '@/components/common/SoundBar';
import { useCookie } from '@/hooks/useCookie';

export interface VideoInfo {
  singingContestId: number;
  nickname: string;
  title: string;
  singer: string;
  file: string;
  likeCount: number;
  like: boolean;
  registerDate: string;
}

export const getServerSideProps: GetServerSideProps = async context => {
  const cookieString = context.req.headers.cookie || '';
  const cookies = useCookie(cookieString);
  const token = cookies.Authorization;
  if (!token) return { redirect: { destination: '/', permanent: false } };
  try {
    const videoRes = await axios.get(
      'http://i8b302.p.ssafy.io:8000/api/v1/singing-contest',
      {
        headers: {
          Authorization: token,
        },
      },
    );
    const videoList: VideoInfo[] = videoRes.data || [];

    const sortedRanking = videoList.sort((a: VideoInfo, b: VideoInfo) => {
      return b.likeCount - a.likeCount;
    });
    const ranking: VideoInfo[] = sortedRanking.slice(0, 3);
    return {
      props: {
        videoList,
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

function Contest(props: { videoList: VideoInfo[]; ranking: VideoInfo[] }) {
  const { videoList, ranking } = props;
  return (
    <>
      <ContestTop ranking={ranking} />
      <SoundBar />
      <div>
        <ContestList videoList={videoList} />
      </div>
      <SoundBar />
    </>
  );
}

export default Contest;
