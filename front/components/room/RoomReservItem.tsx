import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import styles from '@/styles/room/RoomReservItem.module.scss';
import { RootState } from '@/redux/store';
import axios from 'axios';
import { getCookie } from '@/util/cookie';

interface Reserv {
  nickname: string;
  songId: number;
  isPriority: string;
  title: string;
  singer: string;
}

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

  const [userNickname, setUserNickname] = useState('');
  const [ssariState, setSsariState] = useState(0);
  const [reservationList, setReservationList] = useState<Reserv[]>([]);
  const storeUser = useSelector((state: RootState) => state.user);
  const storeSsari = useSelector((state: RootState) => state.ssari);
  const storeReserv = useSelector((state: RootState) => state.reserv);

  useEffect(() => {
    setUserNickname(storeUser.nickname);
  }, [storeUser]);

  useEffect(() => {
    setSsariState(storeSsari.ssari);
  }, [storeSsari]);

  useEffect(() => {
    setReservationList(storeReserv.reserv);
  }, [storeReserv]);

  // 우선예약 (예약목록 맨 앞에 추가)
  const firstReserv = () => {
    // axios
    //   .post(
    //     'api/v1/reservation',
    //     {
    //       sessionId: '12345',
    //       songId: item.songId,
    //       isPriority: 'Y',
    //     },
    //     {
    //       headers: {
    //         Authorization: `${getCookie('Authorization')}`,
    //         refreshToken: `${getCookie('refreshToken')}`,
    //       },
    //     },
    //   )
    //   .then(res => {
    //     console.log(res);
    //   });
    const newReserv = [...reservationList];
    newReserv.unshift({
      nickname: userNickname,
      songId: item.songId,
      isPriority: 'Y',
      title: item.title,
      singer: item.singer,
    });
    session
      .signal({
        data: JSON.stringify(newReserv), // Any string (optional)
        to: [], // Array of Connection objects (optional. Broadcast to everyone if empty)
        type: 'reservationList', // The type of message (optional)
      })
      .then(() => {
        console.log(`노래 예약 정보 송신 성공`, newReserv);
      })
      .catch((error: any) => {
        console.error('노래 예약 정보 송신 실패', error);
      });
  };
  const secondReserv = () => {
    // axios
    //   .post(
    //     'api/v1/reservation',
    //     {
    //       sessionId: '12345',
    //       songId: item.songId,
    //       isPriority: 'Y',
    //     },
    //     {
    //       headers: {
    //         Authorization: `${getCookie('Authorization')}`,
    //         refreshToken: `${getCookie('refreshToken')}`,
    //       },
    //     },
    //   )
    //   .then(res => {
    //     console.log(res);
    //   });
    const newReserv = [...reservationList];
    newReserv.splice(1, 0, {
      nickname: userNickname,
      songId: item.songId,
      isPriority: 'Y',
      title: item.title,
      singer: item.singer,
    });
    session
      .signal({
        data: JSON.stringify(newReserv), // Any string (optional)
        to: [], // Array of Connection objects (optional. Broadcast to everyone if empty)
        type: 'reservationList', // The type of message (optional)
      })
      .then(() => {
        console.log(`노래 예약 정보 송신 성공`, newReserv);
      })
      .catch((error: any) => {
        console.error('노래 예약 정보 송신 실패', error);
      });
  };

  // 일반예약 (예약목록 맨 뒤에 추가)
  const nomalReserv = () => {
    // axios
    //   .post(
    //     'api/v1/reservation',
    //     {
    //       sessionId: '12345',
    //       songId: item.songId,
    //       isPriority: 'N',
    //     },
    //     {
    //       headers: {
    //         Authorization: `${getCookie('Authorization')}`,
    //         refreshToken: `${getCookie('refreshToken')}`,
    //       },
    //     },
    //   )
    //   .then(res => {
    //     console.log(res);
    //   });
    const newReserv = [...reservationList];
    newReserv.push({
      nickname: userNickname,
      songId: item.songId,
      isPriority: 'Y',
      title: item.title,
      singer: item.singer,
    });
    session
      .signal({
        data: JSON.stringify(newReserv), // Any string (optional)
        to: [], // Array of Connection objects (optional. Broadcast to everyone if empty)
        type: 'reservationList', // The type of message (optional)
      })
      .then(() => {
        console.log(`노래 예약 정보 송신 성공`, newReserv);
      })
      .catch((error: any) => {
        console.error('노래 예약 정보 송신 실패', error);
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
