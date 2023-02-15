import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import axios from 'axios';
import hangul from 'hangul-js';
import { RootState } from '@/redux/store';
import { getCookie } from '@/util/cookie';

import FriendModal from './FriendModal';
import styles from '@/styles/profile/FriendForm.module.scss';

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
  const [friendList, setFriendListList] = useState<FriendInfo[]>([]);
  const [filteredFriendList, setFilteredFriendList] = useState<FriendInfo[]>(
    [],
  );
  const [isAccept, setIsAccept] = useState(0);

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
        const friend = [...res.data];
        const w: FriendInfo[] = friend.filter(item => {
          return item.status === 'W';
        });
        const a: FriendInfo[] = friend.filter(item => {
          return item.status === 'A';
        });
        setFriendWList(w);
        setFriendAList(a);
        setFriendListList(friendList);
      });
  }, [storeUser, isAccept]);

  const searchFriend = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      setFilteredFriendList(friendList);
      return;
    }
    const userInput = hangul.disassemble(e.target.value).join('');
    const searchData = friendList.filter(item => {
      const nickname = hangul.disassemble(item.nickname, true);
      const nicknameInitial = nickname
        .map((t: string[]) => {
          return t[0];
        })
        .join('');
      return (
        hangul.search(item.nickname, userInput) !== -1 ||
        nicknameInitial.startsWith(userInput) ||
        item.nickname.toLowerCase().includes(e.target.value.toLowerCase())
      );
    });
    setFilteredFriendList(searchData);
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
        <button
          type="button"
          className={styles.okBtn}
          onClick={() => {
            axios
              .put(
                'api/v1/friend/',
                {
                  friendId: item.friendId,
                  status: 'X',
                },
                {
                  headers: {
                    Authorization: `${getCookie('Authorization')}`,
                  },
                },
              )
              .then(() => {
                const newFriend = friendA.filter(
                  friend => friend.friendId !== item.friendId,
                );
                setFriendAList(newFriend);
                const newFilterFriend = filteredFriendList.filter(
                  friend => friend.friendId !== item.friendId,
                );
                setFilteredFriendList(newFilterFriend);
              });
          }}
        >
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
            {friendW.map(item => {
              return (
                <div className={styles.item} key={item.friendId}>
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
                    <button
                      type="button"
                      className={styles.okBtn}
                      onClick={() => {
                        axios
                          .put(
                            'api/v1/friend/',
                            {
                              friendId: item.friendId,
                              status: 'A',
                            },
                            {
                              headers: {
                                Authorization: `${getCookie('Authorization')}`,
                              },
                            },
                          )
                          .then(() => {
                            const newFriend = friendW.filter(
                              friend => friend.friendId !== item.friendId,
                            );
                            setFriendWList(newFriend);
                            const newFilterFriend = filteredFriendList.filter(
                              friend => friend.friendId !== item.friendId,
                            );
                            setFilteredFriendList(newFilterFriend);
                            setIsAccept(isAccept + 1);
                          });
                      }}
                    >
                      수락
                    </button>
                    <button
                      type="button"
                      className={styles.noBtn}
                      onClick={() => {
                        axios.put(
                          'api/v1/friend/',
                          {
                            friendId: item.friendId,
                            status: 'X',
                          },
                          {
                            headers: {
                              Authorization: `${getCookie('Authorization')}`,
                            },
                          },
                        );
                        const newFriend = friendW.filter(
                          friend => friend.friendId !== item.friendId,
                        );
                        setFriendWList(newFriend);
                        const newFilterFriend = filteredFriendList.filter(
                          friend => friend.friendId !== item.friendId,
                        );
                        setFilteredFriendList(newFilterFriend);
                      }}
                    >
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
