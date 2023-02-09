import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import classNames from 'classnames';
import styles from '@/styles/chart/ChartListItem.module.scss';

function ChartListItem(props: {
  item: { rank: number; title: string; singer: string; album: string };
}) {
  // 다크모드 상태관리
  const [themeMode, setThemeMode] = useState('light');

  const storeTheme = useSelector<any>(state => state.theme);
  useEffect(() => {
    setThemeMode(localStorage.getItem('theme') || 'light');
  }, [themeMode, storeTheme]);
  const [likeMode, setLikeMode] = useState(false);
  const heartIcon = likeMode
    ? `img/chart/${themeMode}/${themeMode}_like_image.svg`
    : `img/chart/${themeMode}/${themeMode}_chart_unlike_image.svg`;
  // 요청 받아서

  const { item } = props;
  const titleClassName = classNames({
    [styles.title]: true,
    [styles.isLong]: item.title.length > 30,
  });
  const singerClassName = classNames({
    [styles.singer]: true,
    [styles.isLong]: item.singer.length > 15,
  });
  const albumClassName = classNames({
    [styles.album]: true,
    [styles.isLong]: item.album.length > 20,
  });
  return (
    <div className={styles.container}>
      <div className={styles.img}>커버</div>
      <div className={styles.rank}>{item.rank}</div>
      <div className={styles.titleCover}>
        <div className={titleClassName}>{item.title}</div>
      </div>
      <div className={styles.singerCover}>
        <div className={singerClassName}>{item.singer}</div>
      </div>
      <div className={styles.albumCover}>
        <div className={albumClassName}>{item.album}</div>
      </div>
      <Image
        src={heartIcon}
        width={20}
        height={20}
        alt="like"
        className={styles.like}
        // 좋아요 버튼 클릭 시
        onClick={() => {
          setLikeMode(!likeMode);
        }}
      />
    </div>
  );
}

export default ChartListItem;
