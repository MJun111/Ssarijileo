import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import classnames from 'classnames';

import { useDispatch, useSelector } from 'react-redux';
import { setLike } from '@/redux/store/likeSlice';
import { RootState } from '@/redux/store';

import styles from '@/styles/like/Like.module.scss';
import Music from '@/components/like/Music';
import Video from '@/components/like/Video';
import SoundBar from '@/components/common/SoundBar';
import { useCookie } from '@/hooks/useCookie';
import axios from 'axios';

export interface SongInfo {
  songId: number;
  title: string;
  singer: string;
  album: string;
  image: string;
  releaseDate: string;
  ranking: number;
}

export const getServerSideProps: GetServerSideProps = async context => {
  const cookieString = context.req.headers.cookie || '';
  const cookies = useCookie(cookieString);
  const token = cookies.Authorization;
  try {
    const likeListRes = await axios.get(
      'http://i8b302.p.ssafy.io:8000/api/v1/song/my',
      {
        headers: {
          Authorization: token,
        },
      },
    );
    const likeList: SongInfo[] = likeListRes.data;

    return {
      props: {
        likeList,
        res: { status: 200 },
      },
    };
  } catch (err) {
    const res = JSON.parse(JSON.stringify(err));
    return {
      props: {
        likeList: null,
        res,
      },
    };
  }
};

function Like(props: { likeList: SongInfo[]; res: any }) {
  const { likeList, res } = props;
  console.log(likeList);
  console.log('status : ', res);
  const [type, setType] = useState('찜목록');
  const musicClass = classnames({
    [styles.music]: true,
    [styles.isSelect]: type === '찜목록',
  });
  const videoClass = classnames({
    [styles.video]: true,
    [styles.isSelect]: type === '녹화본',
  });
  const dispatch = useDispatch();
  const storeLike = useSelector((state: RootState) => state.like);
  useEffect(() => {
    setType(storeLike.like);
  });
  return (
    <>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.title}>마이뮤직</div>
          <div className={styles.menu}>
            <button
              type="button"
              onClick={() => {
                setType('찜목록');
                dispatch(setLike('찜목록'));
              }}
              className={musicClass}
            >
              찜목록
            </button>
            <button
              type="button"
              onClick={() => {
                setType('녹화본');
                dispatch(setLike('녹화본'));
              }}
              className={videoClass}
            >
              녹화본
            </button>
          </div>
        </div>
        <div className={styles.list}>
          {type === '찜목록' && <Music likeList={likeList} />}
          {type === '녹화본' && <Video />}
        </div>
      </div>
      <SoundBar />
    </>
  );
}

export default Like;
