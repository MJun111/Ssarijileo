import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import styles from '@/styles/room/ReservList.module.scss';
import { RootState } from '@/redux/store';
import { deleteReserv } from '@/redux/store/reservSlice';

interface Reserv {
  nickname: string;
  songId: number;
  isPriority: string;
  title: string;
  singer: string;
}

function ReservList() {
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
  useEffect(() => {
    setReservationList(storeReservList.reserv);
  }, [storeReservList]);
  const dispatch = useDispatch();

  //   현재 곡 제외 예약 목록만 뽑아내기
  const reserv = reservationList.slice(1);
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
                dispatch(deleteReserv(idx));
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
                {reservationList.length != 0 ? reservationList[0].title : ''}
              </span>
              -{reservationList.length != 0 ? reservationList[0].singer : ''}
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
