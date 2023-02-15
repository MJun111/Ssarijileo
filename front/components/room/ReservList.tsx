import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import axios from 'axios';

import styles from '@/styles/room/ReservList.module.scss';
import { RootState } from '@/redux/store';
import { setReserv } from '@/redux/store/reservSlice';
// import { setSsari } from '@/redux/store/ssariSlice';
import { getCookie } from '@/util/cookie';

interface Reserv {
  nickname: string;
  songId: number;
  isPriority: string;
  title: string;
  singer: string;
}

function ReservList({ session }: any) {
  const [themeMode, setThemeMode] = useState('light');
  // 다크모드 관리
  const storeTheme = useSelector((state: RootState) => state.theme);
  useEffect(() => {
    setThemeMode(storeTheme.theme);
  }, [storeTheme]);

  const [modalOpen, setModalOpen] = useState(false);
  // 예약목록 모달 관리
  const showModal = () => {
    setModalOpen(!modalOpen);
  };

  const modalClass = classNames({
    [styles.modal]: true,
    [styles.modalOpen]: modalOpen,
  });

  // 다크모드에 따라 아이콘 경로 변경
  const toggleIcon = `img/ssari/${themeMode}/${themeMode}_ssari_toggle_image.svg`;

  const [reservationList, setReservationList] = useState<Reserv[]>([]);
  const storeReservList = useSelector((state: RootState) => state.reserv);
  // const storeSsari = useSelector((state: RootState) => state.ssari);
  const dispatch = useDispatch();

  useEffect(() => {
    setReservationList(storeReservList.reserv);
  }, [storeReservList]);

  // 노래 정보 수신
  session.on('signal:reservationList', (event: any) => {
    const getReserveData = JSON.parse(event.data);
    console.log('예약리스트', getReserveData);
    dispatch(setReserv(getReserveData));
    // }
  });

  //   현재 곡 제외 예약 목록만 뽑아내기
  const reserv = reservationList.length > 1 ? reservationList.slice(1) : [];

  const [sessionIdValue, setSessionId] = useState('');
  const storeSessionId = useSelector((state: RootState) => state.sessionId);

  useEffect(() => {
    setSessionId(storeSessionId.sessionId);
  }, [storeSessionId]);

  return (
    <div className={styles.container}>
      <div className={modalClass}>
        {reserv.map((item, idx) => (
          <div className={styles.modalItem} key={item.songId}>
            <div className={styles.number}>{idx + 2}</div>
            <div className={styles.title}>{item.title}</div>
            <div className={styles.singer}>{item.singer}</div>
            <div className={styles.name}>{item.nickname}</div>
            <button
              type="button"
              onClick={() => {
                axios
                  .delete('api/v1/reservation', {
                    data: {
                      songId:
                        reservationList.length !== 0
                          ? reservationList[0].songId
                          : null,
                      // 임시 세션 아이디
                      sessionId: sessionIdValue,
                    },
                    headers: {
                      Authorization: `${getCookie('Authorization')}`,
                      refreshToken: `${getCookie('refreshToken')}`,
                    },
                  })
                  .then(res => {
                    console.log(res.data);
                  });
                const newReserv = [...reservationList];
                newReserv.splice(idx, 1);
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
              }}
              className={styles.btn}
            >
              예약취소
            </button>
          </div>
        ))}
      </div>
      <button type="button" className={styles.reservList} onClick={showModal}>
        <div className={styles.list}>
          <div className={styles.nowPlay}>
            <div className={styles.out}>
              <span className={styles.title}>
                {reservationList.length !== 0 ? reservationList[0].title : ''}
              </span>
              -{reservationList.length !== 0 ? reservationList[0].singer : ''}
            </div>
          </div>
          <div className={styles.listOut}>
            <div className={styles.listItem}>
              {reserv.map(item => (
                <div className={styles.item} key={item.songId}>
                  {item.title}-{item.singer}
                </div>
              ))}
            </div>
          </div>
        </div>

        <Image
          src={toggleIcon}
          width={21}
          height={12}
          alt="toggle"
          className={styles.toggleIcon}
          priority
        />
      </button>
    </div>
  );
}

export default ReservList;
