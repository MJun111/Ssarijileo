import React from 'react';
import Image from 'next/image';
import axios from 'axios';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getCookie } from '@/util/cookie';

import styles from '@/styles/room/RoomReservItem.module.scss';

function RoomReservItem(props: {
  item: {
    songId: number;
    title: string;
    singer: string;
    album: string;
    image: string;
  };
  session: any;
}) {
  const { item, session } = props;
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
    [styles.isLong]: item.album.length > 8,
  });
  const storeUser = useSelector((state: RootState) => state.user);
  const storeSsari = useSelector((state: RootState) => state.ssari);
  const storeReserv = useSelector((state: RootState) => state.reserv);

  const storeSessionState = useSelector(
    (state: RootState) => state.sessionState,
  );

  // 우선예약 (예약목록 맨 앞에 추가)
  const firstReserv = () => {
    axios.post(
      'api/v1/reservation',
      {
        sessionId: storeSessionState.sessionId,
        songId: item.songId,
        isPriority: 'Y',
      },
      {
        headers: {
          Authorization: `${getCookie('Authorization')}`,
          refreshToken: `${getCookie('refreshToken')}`,
        },
      },
    );
    const newReserv = [...storeReserv.reserv];
    newReserv.unshift({
      nickname: storeUser.nickname,
      songId: item.songId,
      isPriority: 'Y',
      title: item.title,
      singer: item.singer,
    });
    session.signal({
      data: JSON.stringify(newReserv), // Any string (optional)
      to: [], // Array of Connection objects (optional. Broadcast to everyone if empty)
      type: 'reservationList', // The type of message (optional)
    });
  };
  const secondReserv = () => {
    axios.post(
      'api/v1/reservation',
      {
        sessionId: storeSessionState.sessionId,
        songId: item.songId,
        isPriority: 'Y',
      },
      {
        headers: {
          Authorization: `${getCookie('Authorization')}`,
          refreshToken: `${getCookie('refreshToken')}`,
        },
      },
    );
    const newReserv = [...storeReserv.reserv];
    newReserv.splice(1, 0, {
      nickname: storeUser.nickname,
      songId: item.songId,
      isPriority: 'Y',
      title: item.title,
      singer: item.singer,
    });
    session.signal({
      data: JSON.stringify(newReserv), // Any string (optional)
      to: [], // Array of Connection objects (optional. Broadcast to everyone if empty)
      type: 'reservationList', // The type of message (optional)
    });
  };

  // 일반예약 (예약목록 맨 뒤에 추가)
  const nomalReserv = () => {
    axios.post(
      'api/v1/reservation',
      {
        sessionId: storeSessionState.sessionId,
        songId: item.songId,
        isPriority: 'N',
      },
      {
        headers: {
          Authorization: `${getCookie('Authorization')}`,
          refreshToken: `${getCookie('refreshToken')}`,
        },
      },
    );
    const newReserv = [...storeReserv.reserv];
    newReserv.push({
      nickname: storeUser.nickname,
      songId: item.songId,
      isPriority: 'Y',
      title: item.title,
      singer: item.singer,
    });
    session.signal({
      data: JSON.stringify(newReserv), // Any string (optional)
      to: [], // Array of Connection objects (optional. Broadcast to everyone if empty)
      type: 'reservationList', // The type of message (optional)
    });
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
          onClick={storeSsari.ssari < 5 ? firstReserv : secondReserv}
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
