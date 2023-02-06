// Path: 'chart/'
import Image from 'next/image';

import ChartTop from '@/components/chart/ChartTop';
import SoundBar from '@/components/common/SoundBar';
import ChartList from '@/components/chart/ChartList';

import styles from '@/styles/chart/Chart.module.scss';

function Chart() {
  // 이번 달, 주차, 날짜 구하기
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const week = Math.ceil((day + firstDay) / 7);

  return (
    <>
      <ChartTop />
      <SoundBar />
      <div className={styles.container}>
        <div className={styles.list}>
          <div className={styles.title}>
            <span className={styles.context}>{month}월 TOP 100</span>
            <Image
              src="img/chart/chart_rank_image.svg"
              width={50}
              height={50}
              alt="rank"
            />
          </div>
          <ChartList />
        </div>
        <hr className={styles.line} />
        <div className={styles.list}>
          <div className={styles.title}>
            <span className={styles.context}>
              {month}월 {week}째주 TOP 100
            </span>
            <Image
              src="img/chart/chart_rank_image.svg"
              width={50}
              height={50}
              alt="rank"
            />
          </div>
          <ChartList />
        </div>
        <hr className={styles.line} />
        <div className={styles.list}>
          <div className={styles.title}>
            <span className={styles.context}>
              {month}월 {day}일 TOP 100
            </span>
            <Image
              src="img/chart/chart_rank_image.svg"
              width={50}
              height={50}
              alt="rank"
            />
          </div>
          <ChartList />
        </div>
      </div>
      <SoundBar />
    </>
  );
}

export default Chart;
