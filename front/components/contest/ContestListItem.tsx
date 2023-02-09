import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import { videoInfo } from './ContestList';
import styles from '@/styles/contest/ContestListItem.module.scss';
import { RootState } from '@/redux/store';

type VideoProps = {
  info: videoInfo;
};

function ContestListItem({ info }: VideoProps) {
  const [themeMode, setThemeMode] = useState('light');
  const [likeMode, setLikeMode] = useState(false);

  const storeTheme = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    const theme = storeTheme.theme || 'light';
    setThemeMode(theme);
  }, [storeTheme]);

  const heartIcon = likeMode
    ? `img/chart/${themeMode}/${themeMode}_like_image.svg`
    : `img/chart/${themeMode}/${themeMode}_chart_unlike_image.svg`;
  // 요청 받아서

  // key 필요하면 받아놓기
  const { url, name, title, singer, like } = info;
  const myName = 'zㅣ존예지';
  const urlInfo = `${url}#t=0.5`;
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <video
          className={styles.video}
          src={urlInfo}
          preload="metadata"
          controlsList="nodownload"
          controls
        >
          <track kind="captions" />{' '}
        </video>
        <div className={styles.info}>
          <div className={styles.top}>
            <div className={styles.name}>
              <Image
                src="img/contest/contest_profile_image.svg"
                width={24}
                height={24}
                alt="profile"
                className={styles.profileIcon}
              />
              <div>{name}</div>
            </div>
            <div className={styles.like}>
              <span className={styles.count}>{like}</span>
              <span>Like</span>
            </div>
          </div>
          <div className={styles.bottom}>
            <div className={styles.song}>
              <Image
                src="img/contest/contest_headphone_image.svg"
                width={24}
                height={24}
                alt="crown"
                className={styles.songIcon}
              />
              <div>
                {title}-{singer}
              </div>
            </div>
            {name !== myName && (
              <Image
                src={heartIcon}
                width={24}
                height={24}
                alt="like"
                className={styles.likeIcon}
                // 좋아요 버튼 클릭 시
                onClick={() => {
                  setLikeMode(!likeMode);
                }}
              />
            )}
            {name === myName && (
              <button type="button" className={styles.deleteBtn}>
                글삭제
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContestListItem;
