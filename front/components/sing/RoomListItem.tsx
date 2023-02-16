import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { setSessionState } from '@/redux/store/sessionStateSlice';
import { RoomInfo } from './RoomList';
// import axios from 'axios';
// import { getCookie } from '@/util/cookie';

import styles from '@/styles/sing/RoomListItem.module.scss';

type RoomProps = {
  info: RoomInfo;
};

function RoomListItem({ info }: RoomProps) {
  const { sessionId, title, mode, isPublic, userCount, password } = info;
  const [modalMode, setModalMode] = useState(false);
  const dispatch = useDispatch();
  let backClassName = classNames({
    [styles.back]: true,
    [styles.nomal]: true,
  });
  let typeClassName = classNames({
    [styles.type]: true,
    [styles.nomal]: true,
  });
  if (mode === 'P') {
    backClassName = classNames({
      [styles.back]: true,
      [styles.perfect]: true,
    });
    typeClassName = classNames({
      [styles.type]: true,
      [styles.perfect]: true,
    });
  } else if (mode === 'else') {
    backClassName = classNames({
      [styles.back]: true,
      [styles.relay]: true,
    });
    typeClassName = classNames({
      [styles.type]: true,
      [styles.relay]: true,
    });
  } else if (mode === 'O') {
    backClassName = classNames({
      [styles.back]: true,
      [styles.guess]: true,
    });
    typeClassName = classNames({
      [styles.type]: true,
      [styles.guess]: true,
    });
  }

  const [modeType, setModeType] = useState('');

  useEffect(() => {
    if (mode === 'N') {
      setModeType('일반모드');
    } else if (mode === 'P') {
      setModeType('퍼펙트스코어');
    } else if (mode === 'O') {
      setModeType('가사맞추기');
    }
  }, []);

  // 비밀번호 관리
  const [roomPassword, setPassword] = useState('');
  const changePwd = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  // 임시 비밀번호
  const pwd = password;
  const openWindow = async () => {
    if (userCount === 6) {
      window.alert('현재 이 방은 최대인원입니다. 다른 방을 이용해주세요.');
      return;
    }
    // console.log('클릭');
    // const response = await axios({
    //   method: 'DELETE',
    //   url: `api/v1/room/${sessionId}`,
    //   headers: {
    //     Authorization: `${getCookie('Authorization')}`,
    //     refreshToken: `${getCookie('refreshToken')}`,
    //   },
    // });
    // console.log(response);
    // dispatch(setSessionId(''));

    // lock일 경우 비밀번호 창 띄우기
    dispatch(setSessionState(sessionId));
    if (isPublic === 'N') {
      setModalMode(true);
    } else {
      const popupWindow = window.open('room/', 'windowName', 'resizeable');
      if (!popupWindow) return;
      popupWindow.resizeTo(1920, 1080);
      popupWindow.onresize = () => {
        popupWindow.resizeTo(1920, 1080);
      };
      if (popupWindow.closed) {
        console.log('closed');
      }
    }
  };

  const pwdImg =
    isPublic === 'N'
      ? 'img/room/room_private_image.svg'
      : 'img/room/room_public_image.svg';

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
                  if (roomPassword === pwd) {
                    setModalMode(false);
                    dispatch(setSessionState(sessionId));
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
              <div className={typeClassName}>{modeType}</div>
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
                  {isPublic === 'N' ? '비공개방' : '공개방'}
                </div>
                <Image src={pwdImg} width={18} height={18} alt="lock" />
              </div>
              <div className={styles.member}>
                <Image
                  src="img/room/room_member_image.svg"
                  width={35}
                  height={36}
                  alt="member"
                />
                <div className={styles.count}>{userCount}/6</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RoomListItem;
