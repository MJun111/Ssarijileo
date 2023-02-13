import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import styles from '@/styles/like/Music.module.scss';
import ChartListItem from '@/components/chart/ChartListItem';
import Pagination from '@/components/common/Pagination';
import { SongInfo } from '@/pages/like';

function Music(props: { likeList: SongInfo[] }) {
  const { likeList } = props;
  // 노래 배열도 상태관리 (좋아요 여부 변경 해야 함!!!)
  const [themeMode, setThemeMode] = useState('light');

  const storeTheme = useSelector<any>(state => state.theme);
  useEffect(() => {
    setThemeMode(localStorage.getItem('theme') || 'light');
  }, [themeMode, storeTheme]);

  useEffect(() => {
    likeList.map((item, idx) => (item.ranking = idx));
  });

  //  페이지
  const [page, setPage] = useState(1);
  //  노래 목록이 보일 개수
  const limit = 10;

  // 게시할 부분만 잘라서 전달
  const offset = (page - 1) * limit;

  const [musicList, setState] = useState(likeList);

  const searchFriend = (e: React.ChangeEvent<HTMLInputElement>) => {
    const eventTarget = e.target as HTMLInputElement;
    const arr: any[] = [];
    likeList.forEach((item, idx) => {
      if (
        item.title.includes(eventTarget.value) ||
        item.singer.includes(eventTarget.value)
      ) {
        arr.push(likeList[idx]);
      }
    });

    setState(arr);
  };
  const postData = musicList.slice(offset, offset + limit);

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.title}>
          찜목록
          <Image
            src="img/contest/contest_mic_image.svg"
            width={40}
            height={40}
            alt="mic"
            className={styles.icon}
          />
        </div>
        <div className={styles.search}>
          <input
            className={styles.input}
            type="text"
            placeholder="검색어를 입력하세요..."
            onChange={searchFriend}
          />
          <Image
            src="img/common/light/light_common_find_image.svg"
            width={37}
            height={37}
            alt="find"
            className={styles.find}
          />
        </div>
      </div>
      <div className={styles.chart}>
        {postData.map(item => {
          return (
            <div className={styles.item} key={item.songId}>
              <ChartListItem item={item} />
            </div>
          );
        })}
      </div>
      <div className={styles.page}>
        <Pagination
          limit={limit}
          page={page}
          totalPosts={musicList.length}
          setPage={setPage}
        />
      </div>
    </div>
  );
}

export default Music;
