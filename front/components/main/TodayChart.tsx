import Image from 'next/image';
import { useSelector } from 'react-redux';

import type { ChartItem } from '@/pages';
import TodayChartItem from '@/components/main/TodayChartItem';

import styles from '@/styles/main/TodayChart.module.scss';

function TodayChart(props: {
  chartItemA: ChartItem[];
  chartItemB: ChartItem[];
}) {
  const { chartItemA, chartItemB } = props;
  const storeLogin: any = useSelector<any>(state => state.login);

  const chartListA = chartItemA.map(item => {
    return <TodayChartItem key={item.rank} item={item} />;
  });
  const chartListB = chartItemB.map(item => {
    return <TodayChartItem key={item.rank} item={item} />;
  });

  return (
    <div className={styles.chart}>
      <div className={styles.chartTitle}>
        <Image
          src="img/main/main_headphone_image.svg"
          width={40}
          height={40}
          alt="chart"
          className={styles.chartIcon}
        />
        <div className={styles.title}>싸리질러 인기차트</div>
        <Image
          src="img/main/main_headphone_image.svg"
          width={40}
          height={40}
          alt="chart"
          className={styles.chartIcon}
        />
      </div>
      <div className={styles.moreView}>
        <button
          type="button"
          className={styles.context}
          onClick={() => {
            if (storeLogin.login) {
              window.location.replace('chart/');
            } else {
              window.confirm('로그인 후 이용하세요🎤🎵');
            }
          }}
        >
          실시간 TOP 100
        </button>
        <Image
          src="img/common/common_more_view_image.svg"
          width={30}
          height={30}
          alt="moreView"
        />
      </div>
      <div className={styles.chartList}>
        <div className={styles.list}>{chartListA}</div>
        <div className={styles.list}>{chartListB}</div>
      </div>
    </div>
  );
}

export default TodayChart;
