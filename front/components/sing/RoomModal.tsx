import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import classNames from 'classnames';

import styles from '@/styles/sing/RoomModal.module.scss';

function RoomModal({ setModalOpen }: any) {
  // 모달창 open 여부
  const closeModal = () => {
    setModalOpen(false);
  };

  // 방제
  const [titleWarning, setTitleWarning] = useState(false);
  const [newtitle, setTitle] = useState('방');
  const changeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 20) {
      setTitleWarning(true);
      return;
    }
    setTitleWarning(false);
    setTitle(event.target.value);
  };

  const titleClass = classNames({
    [styles.warning]: titleWarning,
    [styles.input]: true,
  });

  // 비공개방 체크값 관리
  const [unlock, setLock] = useState(true);

  const checkClass = classNames({
    [styles.pwd]: true,
    [styles.lockMode]: unlock,
  });

  // 라디오 값 관리
  const [newMode, setnewMode] = useState('N');

  const arrA = ['N', 'P', 'R', 'O'];
  const arrB = ['일반노래방', '퍼펙트싱어', '이어부르기', '가사 맞추기'];
  const Mode = arrA.map((str: string, idx) => {
    let btnClass = '';
    if (idx === 0) {
      btnClass = classNames({
        [styles.nomal]: str === 'N',
        [styles.nowNomal]: newMode === 'N',
      });
    } else if (idx === 1) {
      btnClass = classNames({
        [styles.perfect]: str === 'P',
        [styles.nowPerfect]: newMode === 'P',
      });
    } else if (idx === 2) {
      btnClass = classNames({
        [styles.relay]: str === 'R',
        [styles.nowRelay]: newMode === 'R',
      });
    } else {
      btnClass = classNames({
        [styles.guess]: str === 'O',
        [styles.nowGuess]: newMode === 'O',
      });
    }

    return (
      <button
        key={str}
        className={btnClass}
        type="button"
        onClick={() => {
          setnewMode(str);
        }}
      >
        {arrB[idx]}
      </button>
    );
  });

  // 팝업창에 정보 전달
  const createRoom = () => {
    const roomWindow = window.open('room/', 'roomWindow', 'resizeable');
    if (!roomWindow) return;
    roomWindow.resizeTo(1920, 1080);
    roomWindow.onresize = () => {
      roomWindow.resizeTo(1920, 1080);
    };
  };

  const makeRoom = (e: any) => {
    e.source.postMessage(
      {
        sessionId: undefined,
        title: newtitle,
        mode: newMode,
        userMaxCount: 6,
        isPublic: 'Y',
        password: null,
      },
      '*',
    );
    window.removeEventListener('message', makeRoom);
    closeModal();
  };

  useEffect(() => {
    window.addEventListener('message', makeRoom, true);
  }, []);

  return (
    <div className={styles.back}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div>방 만들기</div>
          <button type="button" className={styles.close} onClick={closeModal}>
            <Image
              src="img/common/common_close_image.svg"
              alt="close"
              width={25}
              height={25}
            />
          </button>
        </div>

        <div className={styles.main}>
          <input
            type="text"
            placeholder="방 제목을 입력하세요..."
            className={titleClass}
            value={newtitle}
            onChange={changeTitle}
          />
          <div className={styles.mode}>{Mode}</div>
          <div className={styles.type}>
            <div className={styles.lock}>
              <div className={styles.title}>
                <input
                  type="checkbox"
                  checked={!unlock}
                  onChange={() => {
                    setLock(false);
                  }}
                  className={styles.check}
                />
                <div className={styles.name}>비공개방</div>
                <Image
                  src="img/room/room_lock_image.svg"
                  width={16}
                  height={16}
                  alt="lock"
                />
              </div>
              <input
                type="password"
                placeholder="비밀번호"
                className={checkClass}
              />
            </div>
            <div className={styles.unlock}>
              <input
                type="checkbox"
                checked={unlock}
                onChange={() => {
                  setLock(true);
                }}
                className={styles.check}
              />
              <div className={styles.name}>공개방</div>
              <Image
                src="img/room/room_unlock_image.svg"
                width={16}
                height={16}
                alt="lock"
              />
            </div>
          </div>
          <div className={styles.member}>
            <div className={styles.context}>최대인원 설정</div>
            <select
              className={styles.select}
              defaultValue="인원수"
              name="인원수"
              id="member"
            >
              <option value="인원수">인원수</option>;
              <option value="1">1</option>;<option value="2">2</option>;
              <option value="3">3</option>;<option value="4">4</option>;
              <option value="5">5</option>;<option value="6">6</option>;
            </select>
          </div>
        </div>

        <div className={styles.bottom}>
          <button
            type="button"
            className={styles.createBtn}
            onClick={createRoom}
          >
            생성
          </button>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={closeModal}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoomModal;
