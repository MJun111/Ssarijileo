import React, { useState } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import { RoomInfo } from './RoomList';
import styles from '@/styles/sing/RoomListItem.module.scss';

type RoomProps = {
  info: RoomInfo;
};

function RoomListItem({ info }: RoomProps) {
  const { title, type, lock, member } = info;
  const [modalMode, setModalMode] = useState(false);
  let backClassName = classNames({
    [styles.back]: true,
    [styles.nomal]: true,
  });
  let typeClassName = classNames({
    [styles.type]: true,
    [styles.nomal]: true,
  });
  if (type === '퍼펙트스코어') {
    backClassName = classNames({
      [styles.back]: true,
      [styles.perfect]: true,
    });
    typeClassName = classNames({
      [styles.type]: true,
      [styles.perfect]: true,
    });
  } else if (type === '이어부르기') {
    backClassName = classNames({
      [styles.back]: true,
      [styles.relay]: true,
    });
    typeClassName = classNames({
      [styles.type]: true,
      [styles.relay]: true,
    });
  } else if (type === '가사 맞추기') {
    backClassName = classNames({
      [styles.back]: true,
      [styles.guess]: true,
    });
    typeClassName = classNames({
      [styles.type]: true,
      [styles.guess]: true,
    });
  }

  // 비밀번호 관리
  const [password, setPassword] = useState('');
  const changePwd = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  // 임시 비밀번호
  const pwd = '1234';
  const openWindow = () => {
    // lock일 경우 비밀번호 창 띄우기
    if (lock) {
      setModalMode(true);
    } else {
      const popupWindow = window.open('room/', 'windowName', 'resizeable');
      if (!popupWindow) return;
      popupWindow.resizeTo(1920, 1080);
      popupWindow.onresize = () => {
        popupWindow.resizeTo(1920, 1080);
      };
    }
  };

  return (
    <>
      {modalMode && (
        <div className={styles.layout}>
          <input
            type="button"
            className={styles.back}
            onClick={() => {
              setModalMode(false);
            }}
          />
          <div className={styles.modal}>
            <div className={styles.context}>
              <input
                className={styles.input}
                type="password"
                onChange={changePwd}
                placeholder="비밀번호를 입력하세요..."
              />
            </div>
            <div className={styles.btnList}>
              <button
                className={styles.okBtn}
                type="button"
                onClick={() => {
                  if (password === pwd) {
                    setModalMode(false);
                    const popupWindow = window.open(
                      'room/',
                      'windowName',
                      'resizeable',
                    );
                    if (!popupWindow) return;
                    popupWindow.resizeTo(1920, 1080);
                    popupWindow.onresize = () => {
                      popupWindow.resizeTo(1920, 1080);
                    };
                  } else {
                    setPassword('');
                    window.alert('비밀번호가 틀렸습니다. 🔒');
                  }
                }}
              >
                확인
              </button>
              <button
                className={styles.closeBtn}
                type="button"
                onClick={() => {
                  setModalMode(false);
                }}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
      <div className={styles.component}>
        <div
          role="presentation"
          className={styles.container}
          onClick={openWindow}
          onKeyDown={openWindow}
        >
          <div className={backClassName}>
            <div className={styles.top}>
              <div className={styles.title}>{title}</div>
              <div className={typeClassName}>{type}</div>
            </div>
            <Image
              src="img/common/common_play_image.svg"
              width={43}
              height={43}
              alt="play"
              className={styles.play}
            />
            <div className={styles.bottom}>
              <div className={styles.lock}>
                <div className={styles.type}>
                  {lock ? '비공개방' : '공개방'}
                </div>
                <Image
                  src="img/room/room_private_image.svg"
                  width={18}
                  height={18}
                  alt="lock"
                />
              </div>
              <div className={styles.member}>
                <Image
                  src="img/room/room_member_image.svg"
                  width={35}
                  height={36}
                  alt="member"
                />
                <div className={styles.count}>{member}/10</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RoomListItem;
