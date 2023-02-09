import React, { useState } from 'react';
import Image from 'next/image';
import * as hangul from 'hangul-js';

import styles from '@/styles/room/RoomFriend.module.scss';

function RoomFriend({ setModalOpen }: any) {
  const friend = [
    {
      profile: 'icon/header/dark/dark_profile_icon.svg',
      name: '김태학',
    },
    {
      profile: 'icon/header/dark/dark_profile_icon.svg',
      name: '길상욱',
    },
    {
      profile: 'icon/header/dark/dark_profile_icon.svg',
      name: '김명준',
    },
    {
      profile: 'icon/header/dark/dark_profile_icon.svg',
      name: '김소윤',
    },
    {
      profile: 'icon/header/dark/dark_profile_icon.svg',
      name: '서예지',
    },
    {
      profile: 'icon/header/dark/dark_profile_icon.svg',
      name: 'syg9272',
    },
  ];
  const [allFriendList] = useState(friend);
  const [friendList, setFriendList] = useState(friend);

  const searchFriend = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      setFriendList(allFriendList);
      return;
    }
    const userInput = hangul.disassemble(e.target.value).join('');
    const searchData = allFriendList.filter(item => {
      return (
        hangul.search(item.name, userInput) !== -1 ||
        item.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
    });
    setFriendList(searchData);
  };

  const listItems = friendList.map(item => {
    return (
      <div className={styles.item}>
        <div className={styles.profile}>
          <Image
            src={item.profile}
            width={20}
            height={20}
            alt="profile"
            className={styles.profileIcon}
          />
        </div>
        <div className={styles.name}>{item.name}</div>
        <button type="button" className={styles.invite}>
          초대하기
        </button>
      </div>
    );
  });
  return (
    <div className={styles.layout}>
      <input
        type="button"
        className={styles.back}
        onClick={() => {
          setModalOpen(false);
        }}
      />
      <div className={styles.container}>
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
      </div>
    </div>
  );
}

export default RoomFriend;
