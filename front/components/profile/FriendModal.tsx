import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import styles from '@/styles/profile/FriendModal.module.scss';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getCookie } from '@/util/cookie';

type RoomProps = {
  setModalOpen: any;
};

interface friendInfo {
  nickname: string;
  image: string;
}

function FriendModal({ setModalOpen }: RoomProps) {
  const [friendList, setFriendList] = useState<friendInfo[]>([]);
  const storeUser = useSelector((state: RootState) => state.user);
  let friend = [] as friendInfo[];
  useEffect(() => {
    axios
      .get(`api/v1/friend/${storeUser.nickname}`, {
        headers: {
          Authorization: `${getCookie('Authorization')}`,
          refreshToken: `${getCookie('refreshToken')}`,
        },
      })
      .then(res => {
        friend = [...res.data];
        setFriendList(friend);
      });
  }, []);

  const searchFriend = (e: React.ChangeEvent<HTMLInputElement>) => {
    const eventTarget = e.target as HTMLInputElement;
    const arr: friendInfo[] = [];
    friend.forEach((item, idx) => {
      if (item.nickname.includes(eventTarget.value)) {
        arr.push(friend[idx]);
      }
    });
    setFriendList(arr);
  };

  const listItems = friendList.map((item, idx) => {
    return (
      <div className={styles.item} key={idx}>
        <Image
          src={item.image}
          width={40}
          height={40}
          alt="profile"
          className={styles.profileIcon}
        />
        <div className={styles.name}>{item.nickname}</div>
        <Image
          src="img/profile/profile_add_friend_image.svg"
          width={20}
          height={20}
          alt="add-friend"
          className={styles.invite}
          onClick={() => {
            axios
              .post(
                'api/v1/friend',
                {
                  fromUserNickname: storeUser.nickname,
                  toUserNickname: item.nickname,
                },
                {
                  headers: {
                    Authorization: `${getCookie('Authorization')}`,
                    refreshToken: `${getCookie('refreshToken')}`,
                  },
                },
              )
              .then(res => {
                console.log(res.data);
              });
          }}
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
