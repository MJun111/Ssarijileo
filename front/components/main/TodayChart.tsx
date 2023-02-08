import Image from 'next/image';
import TodayChartItem from '@/components/main/TodayChartItem';

import styles from '@/styles/main/TodayChart.module.scss';

function TodayChart(props: {
  data: {
    chartItemA: {
      rank: number;
      title: string;
      singer: string;
    }[];
    chartItemB: {
      rank: number;
      title: string;
      singer: string;
    }[];
  };
}) {
  const { chartItemA, chartItemB } = props.data;

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
        <div className={styles.context}>실시간 TOP 100</div>
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
