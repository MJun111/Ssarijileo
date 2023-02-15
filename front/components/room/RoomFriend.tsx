import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useSelector } from 'react-redux';
import * as hangul from 'hangul-js';

import { useSpring, animated } from 'react-spring';
import { useDrag } from '@use-gesture/react';
import { RootState } from '@/redux/store';

import styles from '@/styles/room/RoomFriend.module.scss';
import { friendInfo } from '../profile/FriendModal';
import { getCookie } from '@/util/cookie';

function RoomFriend({ setModalOpen }: any) {
  const [allFriendList, setAllFriendList] = useState<friendInfo[]>([]);
  const [friendList, setFriendList] = useState<friendInfo[]>([]);
  useEffect(() => {
    axios
      .get(`api/v1/friend/${storeUser.nickname}`, {
        headers: {
          Authorization: `${getCookie('Authorization')}`,
          refreshToken: `${getCookie('refreshToken')}`,
        },
      })
      .then(res => {
        setAllFriendList(res.data);
        setFriendList(res.data);
      });
  }, []);

  const storeUser = useSelector((state: RootState) => state.user);
  const storeSessionId = useSelector((state: RootState) => state.sessionId);

  const searchFriend = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      setFriendList(allFriendList);
      return;
    }
    const userInput = hangul.disassemble(e.target.value).join('');
    const searchData = allFriendList.filter(item => {
      return (
        hangul.search(item.nickname, userInput) !== -1 ||
        item.nickname.toLowerCase().includes(e.target.value.toLowerCase())
      );
    });
    setFriendList(searchData);
  };

  const listItems = friendList.map(item => {
    return (
      <div className={styles.item}>
        <Image
          src={item.image}
          width={40}
          height={40}
          alt="profile"
          className={styles.profileIcon}
        />
        <div className={styles.name}>{item.nickname}</div>
        <button
          type="button"
          className={styles.invite}
          onClick={() => {
            axios.post('api/v1/friend/invite', {
              fromUserNickname: storeUser.nickname,
              toUserNickname: item.nickname,
              sessionId: storeSessionId.sessionId,
            });
          }}
        >
          초대하기
        </button>
      </div>
    );
  });

  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));

  const bind = useDrag(
    ({ down, offset: [ox, oy] }) =>
      api.start({ x: ox, y: oy, immediate: down }),
    { bounds: { bottom: 0, top: -180, right: 1063, left: -22 } },
  );

  return (
    <div className={styles.layout}>
      <input
        type="button"
        className={styles.back}
        onClick={() => {
          setModalOpen(false);
        }}
      />
      <animated.div
        {...bind()}
        style={{
          x,
          y,
        }}
        className={styles.container}
      >
        <div className={styles.top}>
          <div>친구 목록</div>
          <Image
            src="img/common/common_close_image.svg"
            width={25}
            height={25}
            alt="close"
            onClick={() => {
              setModalOpen(false);
            }}
            className={styles.close}
          />
        </div>
        <div className={styles.main}>
          <div className={styles.search}>
            <input
              className={styles.input}
              type="text"
              placeholder="닉네임을 입력하세요..."
              onChange={searchFriend}
            />
            <Image
              src="img/common/light/light_common_find_image.svg"
              width={27}
              height={27}
              alt="find"
              className={styles.find}
            />
          </div>
          <div className={styles.friendList}>{listItems}</div>
        </div>
      </animated.div>
    </div>
  );
}

export default RoomFriend;
