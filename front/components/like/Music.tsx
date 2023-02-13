import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import axios from 'axios';
import styles from '@/styles/like/Music.module.scss';
// import ChartListItem from '@/components/chart/ChartListItem';
import Pagination from '@/components/common/Pagination';
import { getCookie } from '@/util/cookie';

function Music() {
  // 노래 배열도 상태관리 (좋아요 여부 변경 해야 함!!!)
  const [themeMode, setThemeMode] = useState('light');

  const storeTheme = useSelector<any>(state => state.theme);
  useEffect(() => {
    setThemeMode(localStorage.getItem('theme') || 'light');
  }, [themeMode, storeTheme]);

  //  페이지
  const [page, setPage] = useState(1);
  //  노래 목록이 보일 개수
  const limit = 10;

  axios
    .get('api/v1/song/my', {
      headers: {
        Authorization: `${getCookie('Authorization')}`,
        refreshToken: `${getCookie('refreshToken')}`,
      },
    })
    .then(res => {
      console.log('애창곡 목록 요청 : ', res);
    });

  const chartList = [
    {
      rank: 1,
      title: 'Ditto',
      singer: 'NewJeans',
      album: 'NewJeans ‘OMG’',
    },
    {
      rank: 2,
      title: '사건의 지평선',
      singer: '윤하',
      album: 'NewJeans ‘OMG’',
    },
    {
      rank: 3,
      title: 'Hype boy',
      singer: 'NewJeans',
      album: 'NewJeans ‘OMG’',
    },
    {
      rank: 4,
      title: 'OMG',
      singer: 'NewJeans',
      album: 'NewJeans ‘OMG’',
    },
    {
      rank: 5,
      title: 'After LIKE',
      singer: 'IVE(아이브)',
      album: 'NewJeans ‘OMG’',
    },
    {
      rank: 6,
      title: 'ANTIFRAGILE',
      singer: 'LE SSERAFIM (르세라핌)',
      album: 'NewJeans ‘OMG’',
    },
    {
      rank: 7,
      title: 'Attention',
      singer: 'NewJeans',
      album: 'NewJeans ‘OMG’',
    },
    {
      rank: 8,
      title: 'LOVE DIVE',
      singer: 'IVE(아이브)',
      album: 'NewJeans ‘OMG’',
    },
    {
      rank: 9,
      title: 'Nxde',
      singer: '여자(아이들)',
      album: 'NewJeans ‘OMG’',
    },
    {
      rank: 10,
      title: 'NOT SORRY (Feat. pH-1) (Prod. by Slom)333333333333333',
      singer: '이영지',
      album: 'NewJeans ‘OMG’',
    },
    {
      rank: 11,
      title: 'Ditto',
      singer: 'NewJeans',
      album: 'NewJeans ‘OMG’',
    },
    {
      rank: 12,
      title: '사건의 지평선',
      singer: '윤하',
      album: 'NewJeans ‘OMG’',
    },
    {
      rank: 13,
      title: 'Hype boy',
      singer: 'NewJeans',
      album: 'NewJeans ‘OMG’',
    },
    {
      rank: 14,
      title: 'OMG',
      singer: 'NewJeans',
      album: 'NewJeans ‘OMG’',
    },
    {
      rank: 15,
      title: 'After LIKE',
      singer: 'IVE(아이브)',
      album: 'NewJeans ‘OMG’',
    },
    {
      rank: 16,
      title: 'ANTIFRAGILE',
      singer: 'LE SSERAFIM (르세라핌)',
      album: 'NewJeans ‘OMG’',
    },
    {
      rank: 17,
      title: 'Attention',
      singer: 'NewJeans',
      album: 'NewJeans ‘OMG’',
    },
    {
      rank: 18,
      title: 'LOVE DIVE',
      singer: 'IVE(아이브)',
      album: 'NewJeans ‘OMG’',
    },
    {
      rank: 19,
      title: 'Nxde',
      singer: '여자(아이들)',
      album: 'NewJeans ‘OMG’',
    },
    {
      rank: 20,
      title: 'NOT SORRY (Feat. pH-1) (Prod. by Slom)',
      singer: '이영지',
      album: 'NewJeans ‘OMG’',
    },
    {
      rank: 21,
      title: 'Ditto',
      singer: 'NewJeans',
      album: 'NewJeans ‘OMG’',
    },
    {
      rank: 22,
      title: '사건의 지평선',
      singer: '윤하',
      album: 'NewJeans ‘OMG’',
    },
    {
      rank: 23,
      title: 'Hype boy',
      singer: 'NewJeans',
      album: 'NewJeans ‘OMG’',
    },
    {
      rank: 24,
      title: 'OMG',
      singer: 'NewJeans',
      album: 'NewJeans ‘OMG’',
    },
    {
      rank: 25,
      title: 'After LIKE',
      singer: 'IVE(아이브)',
      album: 'NewJeans ‘OMG’',
    },
    {
      rank: 26,
      title: 'ANTIFRAGILE',
      singer: 'LE SSERAFIM (르세라핌)',
      album: 'NewJeans ‘OMG’',
    },
    {
      rank: 27,
      title: 'Attention',
      singer: 'NewJeans',
      album: 'NewJeans ‘OMG’',
    },
    {
      rank: 28,
      title: 'LOVE DIVE',
      singer: 'IVE(아이브)',
      album: 'NewJeans ‘OMG’',
    },
    {
      rank: 29,
      title: 'Nxde',
      singer: '여자(아이들)',
      album: 'NewJeans ‘OMG’',
    },
    {
      rank: 30,
      title: 'NOT SORRY (Feat. pH-1) (Prod. by Slom)',
      singer: '이영지',
      album: 'NewJeans ‘OMG’',
    },
  ];
  // 게시할 부분만 잘라서 전달
  const offset = (page - 1) * limit;

  const [musicList, setState] = useState(chartList);

  const searchFriend = (e: React.ChangeEvent<HTMLInputElement>) => {
    const eventTarget = e.target as HTMLInputElement;
    const arr: any[] = [];
    chartList.forEach((item, idx) => {
      if (
        item.title.includes(eventTarget.value) ||
        item.singer.includes(eventTarget.value)
      ) {
        arr.push(chartList[idx]);
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
            <div className={styles.item} key={item.rank}>
              {/* <ChartListItem item={item} /> */}
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
