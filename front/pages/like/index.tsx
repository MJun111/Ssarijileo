import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { setLike } from '@/redux/store/likeSlice';
import { RootState } from '@/redux/store';

import classnames from 'classnames';
import styles from '@/styles/like/Like.module.scss';
import Music from '@/components/like/Music';
import Video from '@/components/like/Video';
import SoundBar from '@/components/common/SoundBar';

function Like() {
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
          {type === '찜목록' && <Music />}
          {type === '녹화본' && <Video />}
        </div>
      </div>
      <SoundBar />
    </>
  );
}

export default Like;
