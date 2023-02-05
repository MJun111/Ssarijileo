import React, { useState } from 'react';
import classnames from 'classnames';
import styles from '@/styles/like/Like.module.scss';

import Music from '@/components/like/Music';
import Video from '@/components/like/Video';

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
  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.title}>마이뮤직</div>
        <div className={styles.menu}>
          <button
            type="button"
            onClick={() => {
              setType('찜목록');
            }}
            className={musicClass}
          >
            찜목록
          </button>
          <button
            type="button"
            onClick={() => {
              setType('녹화본');
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
  );
}

export default Like;
