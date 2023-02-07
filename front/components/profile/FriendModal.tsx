import React, { useState } from 'react';
import Image from 'next/image';

import styles from '@/styles/profile/FriendModal.module.scss';

type RoomProps = {
  setModalOpen: any;
  friend: any[];
};

function FriendModal({ setModalOpen, friend }: RoomProps) {
  const [friendList, setState] = useState(friend);

  const searchFriend = (e: React.ChangeEvent<HTMLInputElement>) => {
    const eventTarget = e.target as HTMLInputElement;
    const arr: any[] = [];
    friend.forEach((item, idx) => {
      if (item.name.includes(eventTarget.value)) {
        arr.push(friend[idx]);
      }
    });

    setState(arr);
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
        <Image
          src="img/profile/profile_add_friend_image.svg"
          width={20}
          height={20}
          alt="add-friend"
          className={styles.invite}
        />
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
          <div>친구 추가</div>
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

export default FriendModal;
