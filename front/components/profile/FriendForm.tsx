import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { RootState } from '@/redux/store';

import FriendModal from './FriendModal';
import styles from '@/styles/profile/FriendForm.module.scss';
import { getCookie } from '@/util/cookie';

export interface FriendInfo {
  friendId: number;
  image: string;
  nickname: string;
  state: string;
}

function FriendForm() {
  const [modalOpen, setModalOpen] = useState(false);
  // 요청 상태
  const [friendW, setFriendWList] = useState<FriendInfo[]>([]);
  // 친구 상태
  const [friendA, setFriendAList] = useState<FriendInfo[]>([]);
  // 모든 user
  const [friend, setFriendList] = useState<FriendInfo[]>([]);
  const storeUser = useSelector((state: RootState) => state.user);

  useEffect(() => {
    axios
      .get(`api/v1/friend/my/${storeUser.nickname}`, {
        headers: {
          Authorization: `${getCookie('Authorization')}`,
          refreshToken: `${getCookie('refreshToken')}`,
        },
      })
      .then(res => {
        const friendList = [...res.data];
        const w: FriendInfo[] = friendList.filter(item => {
          return item.status === 'W';
        });
        const a: FriendInfo[] = friendList.filter(item => {
          return item.status === 'A';
        });
        setFriendWList(w);
        setFriendAList(a);
        setFriendList(friendList);
        console.log('친구목록 요청 : ', friendW);
        console.log('친구목록 요청 : ', friendA);
      });
  }, [storeUser]);

  const [friendList, setState] = useState(friend);

  const searchFriend = (e: React.ChangeEvent<HTMLInputElement>) => {
    const eventTarget = e.target as HTMLInputElement;
    const arr: any[] = [];
    friendList.forEach((item, idx) => {
      if (item.nickname.includes(eventTarget.value)) {
        arr.push(friend[idx]);
      }
    });

    setState(arr);
  };
  const listItems = friendA?.map(item => {
    return (
      <div className={styles.item} key={item.nickname}>
        <div className={styles.profile}>
          <Image
            className={styles.img}
            src={item.image}
            width={30}
            height={30}
            alt="profile"
          />
        </div>
        <div className={styles.name}>{item.nickname}</div>
        <button type="button" className={styles.okBtn}>
          친구삭제
        </button>
      </div>
    );
  });
  return (
    <div className={styles.contentForm}>
      {modalOpen && <FriendModal setModalOpen={setModalOpen} />}
      <div className={styles.top}>
        <button
          type="button"
          className={styles.addBtn}
          onClick={() => {
            setModalOpen(!modalOpen);
          }}
        >
          <Image
            src="img/common/common_add_image.svg"
            width={15}
            height={18}
            alt="add"
            className={styles.img}
          />
          친구 추가
        </button>
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
      </div>
      <div className={styles.content}>
        <div className={styles.thead}>
          <div className={styles.tr}>
            <div className={styles.profile} />
            <div className={styles.name}>닉네임</div>
            <div className={styles.play}>상태</div>
          </div>
        </div>
        <div className={styles.table}>
          <div className={styles.fix}>
            {/* 상단 고정 (친구요청) */}
            {friendW.length &&
              friendW.map(item => {
                return (
                  <div className={styles.item}>
                    <div className={styles.profile}>
                      {/* <div className={styles.content}> */}
                      <Image
                        className={styles.img}
                        src={item.image}
                        width={45}
                        height={45}
                        alt="profile"
                      />
                      {/* </div> */}
                    </div>
                    <div className={styles.name}>{item.nickname}</div>
                    <div className={styles.play}>
                      <button type="button" className={styles.okBtn}>
                        수락
                      </button>
                      <button type="button" className={styles.noBtn}>
                        거절
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
          <div className={styles.friendList}>{listItems}</div>
        </div>
      </div>
    </div>
  );
}

export default FriendForm;
