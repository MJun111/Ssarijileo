import React, { useState } from 'react';

import { ChartItem } from '@/pages';
import ChartListItem from './ChartListItem';
import Pagination from '@/components/common/Pagination';

import styles from '@/styles/chart/ChartList.module.scss';

function ChartList(props: { chartList: ChartItem[] }) {
  const { chartList } = props;

  //  페이지
  const [page, setPage] = useState(1);
  //  노래 목록이 보일 개수
  const limit = 5;
  // 게시할 부분만 잘라서 전달
  const offset = (page - 1) * limit;
  const postData = chartList.slice(offset, offset + limit);
  return (
    <div className={styles.container}>
      <div className={styles.chart}>
        {postData.map(item => {
          return (
            <div className={styles.item} key={item.ranking}>
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
