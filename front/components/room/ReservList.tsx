import { useState } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import axios from 'axios';

import { RootState } from '@/redux/store';
import { setReserv } from '@/redux/store/reservSlice';
// import { setSsari } from '@/redux/store/ssariSlice';
import { getCookie } from '@/util/cookie';
import styles from '@/styles/room/ReservList.module.scss';

function ReservList({ session }: any) {
  // 다크모드 관리
  const storeTheme = useSelector((state: RootState) => state.theme);
  const { theme } = storeTheme;
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
  const toggleIcon = `img/ssari/${theme}/${theme}_ssari_toggle_image.svg`;

  const storeReserv = useSelector((state: RootState) => state.reserv);
  const dispatch = useDispatch();

  // 노래 정보 수신
  session.on('signal:reservationList', (event: any) => {
    // const fromUser = JSON.parse(event.from.data).clientData;
    // if (fromUser === myName) return;
    const getReserveData = JSON.parse(event.data);
    dispatch(setReserv(getReserveData));
  });

  //   현재 곡 제외 예약 목록만 뽑아내기
  const reserv =
    storeReserv.reserv.length > 1 ? storeReserv.reserv.slice(1) : [];

  const storeSessionState = useSelector(
    (state: RootState) => state.sessionState,
  );

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
              onClick={async () => {
                await axios.delete('api/v1/reservation', {
                  data: {
                    songId: item.songId,
                    // 임시 세션 아이디
                    sessionId: storeSessionState.sessionId,
                  },
                  headers: {
                    Authorization: `${getCookie('Authorization')}`,
                    refreshToken: `${getCookie('refreshToken')}`,
                  },
                });
                const newReserv = [...storeReserv.reserv];
                newReserv.splice(idx + 1, 1);
                session.signal({
                  data: JSON.stringify(newReserv), // Any string (optional)
                  to: [], // Array of Connection objects (optional. Broadcast to everyone if empty)
                  type: 'reservationList', // The type of message (optional)
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
                {storeReserv.reserv.length !== 0
                  ? storeReserv.reserv[0].title
                  : ''}
              </span>
              -
              {storeReserv.reserv.length !== 0
                ? storeReserv.reserv[0].singer
                : ''}
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
