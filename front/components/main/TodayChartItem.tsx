import Image from 'next/image';
import classNames from 'classnames';

import type { ChartItem } from '@/pages';

import styles from '@/styles/main/TodayChart.module.scss';

function TodayChartItem(props: {
  item: ChartItem;
}) {
  const { item } = props;
  const titleClassName = classNames({
    [styles.songTitle]: true,
    [styles.isLong]: item.title.length > 18,
  });
  return (
    <div className={styles.song}>
      <Image src={item.image} width={70} height={70} alt="cover" className={styles.img}/>
      <div className={styles.rank}>{item.ranking}</div>
      <div className={styles.songInfo}>
        <div className={titleClassName}>{item.title}</div>
        <div className={styles.singer}>{item.singer}</div>
      </div>
    </div>
  );
}

export default TodayChartItem;
