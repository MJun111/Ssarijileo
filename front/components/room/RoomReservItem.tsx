import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import {
  addFirstReserv,
  addNomalReserv,
  addSecondReserv,
} from '@/redux/store/reservSlice';

import styles from '@/styles/room/RoomReservItem.module.scss';
import { RootState } from '@/redux/store';

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

  const [userNickname, setUserNickname] = useState('');
  const [ssariState, setSsariState] = useState(0);
  const storeUser = useSelector((state: RootState) => state.user);
  const storeSsari = useSelector((state: RootState) => state.ssari);

  useEffect(() => {
    setUserNickname(storeUser.nickname);
  }, [storeUser]);

  useEffect(() => {
    setSsariState(storeSsari.ssari);
  }, [storeSsari]);

  // 우선예약 (예약목록 맨 앞에 추가)
  const dispatch = useDispatch();
  const firstReserv = () => {
    dispatch(
      addFirstReserv({
        nickname: userNickname,
        songId: item.songId,
        isPriority: 'N',
        title: item.title,
        singer: item.singer,
      }),
    );
  };
  const secondReserv = () => {
    dispatch(
      addSecondReserv({
        nickname: userNickname,
        songId: item.songId,
        isPriority: 'N',
        title: item.title,
        singer: item.singer,
      }),
    );
  };
  // 일반예약 (예약목록 맨 뒤에 추가)
  const nomalReserv = () => {
    dispatch(
      addNomalReserv({
        nickname: userNickname,
        songId: item.songId,
        isPriority: 'Y',
        title: item.title,
        singer: item.singer,
      }),
    );
  };
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
        <button
          type="button"
          className={styles.firstReserv}
          onClick={ssariState < 3 ? firstReserv : secondReserv}
        >
          우선예약
        </button>
        <button
          type="button"
          className={styles.nomalReserv}
          onClick={nomalReserv}
        >
          일반예약
        </button>
      </div>
    </div>
  );
}

export default RoomReservItem;
