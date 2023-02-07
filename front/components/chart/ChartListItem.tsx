import classNames from 'classnames';
import styles from '@/styles/chart/ChartListItem.module.scss';

function ChartListItem(props: {
  item: { rank: number; title: string; singer: string; album: string };
}) {
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
    </div>
  );
}

export default ChartListItem;
