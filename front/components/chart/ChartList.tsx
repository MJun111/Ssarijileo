import React, { useState } from 'react';
import styles from '@/styles/chart/ChartList.module.scss';
import ChartListItem from './ChartListItem';
import Pagination from '@/components/common/Pagination';

function ChartList() {
  //  페이지
  const [page, setPage] = useState(1);
  //  노래 목록이 보일 개수
  const limit = 5;

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
  const postData = chartList.slice(offset, offset + limit);
  return (
    <div className={styles.container}>
      <div className={styles.chart}>
        {postData.map(item => {
          return (
            <div className={styles.item} key={item.rank}>
              <ChartListItem item={item} />
            </div>
          );
        })}
      </div>
      <div className={styles.page}>
        <Pagination
          limit={limit}
          page={page}
          totalPosts={chartList.length}
          setPage={setPage}
        />
      </div>
    </div>
  );
}

export default ChartList;
