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
  try {
    const videoRes = await axios.get(
      'http://i8b302.p.ssafy.io:8000/api/v1/singing-contest',
      {
        headers: {
          Authorization: token,
        },
      },
    );

    const videoList: VideoInfo[] = videoRes.data;

    return {
      props: {
        videoList,
        res: { status: 200 },
      },
    };
  } catch (err) {
    const res = JSON.parse(JSON.stringify(err));
    return {
      props: {
        videoList: null,
        res,
      },
    };
  }
};

function Contest(props: { videoList: VideoInfo[]; res: any }) {
  const { videoList, res } = props;
  console.log(videoList);
  console.log('status : ', res);
  return (
    <>
      <ContestTop />
      <SoundBar />
      <div>
        <ContestList videoList={videoList} />
      </div>
      <SoundBar />
    </>
  );
}

export default Contest;
