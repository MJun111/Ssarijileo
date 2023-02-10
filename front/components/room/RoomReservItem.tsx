import Image from 'next/image';
import classNames from 'classnames';

import styles from '@/styles/room/RoomReservItem.module.scss';

function RoomReservItem(props: {
  item: {
    songId: number;
    title: string;
    singer: string;
    album: string;
    image: string;
  };
}) {
  const { item } = props;
  const titleClassName = classNames({
    [styles.title]: true,
    [styles.isLong]: item.title.length > 27,
  });
  const singerClassName = classNames({
    [styles.singer]: true,
    [styles.isLong]: item.singer.length > 15,
  });
  const albumClassName = classNames({
    [styles.album]: true,
    [styles.isLong]: item.album.length > 15,
  });
  return (
    <div className={styles.container}>
      <div className={styles.img}>
        <Image
          className={styles.albumImg}
          src={item.image}
          width={45}
          height={45}
          alt="album"
        />
      </div>
      <div className={styles.rank}>{item.songId}</div>
      <div className={styles.titleCover}>
        <div className={titleClassName}>{item.title}</div>
      </div>
      <div className={styles.singerCover}>
        <div className={singerClassName}>{item.singer}</div>
      </div>
      <div className={styles.albumCover}>
        <div className={albumClassName}>{item.album}</div>
      </div>
      <div className={styles.btnList}>
        <button type="button" className={styles.firstReserv}>
          우선예약
        </button>
        <button type="button" className={styles.nomalReserv}>
          일반예약
        </button>
      </div>
    </div>
  );
}

export default RoomReservItem;
