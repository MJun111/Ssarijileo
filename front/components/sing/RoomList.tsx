import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import axios from 'axios';

import RoomModal from './RoomModal';
import RoomSearch from '@/components/sing/RoomSearch';
import RoomListItem from '@/components/sing/RoomListItem';
import Pagination from '@/components/common/Pagination';
import { getCookie } from '@/util/cookie';

import styles from '@/styles/sing/RoomList.module.scss';

export interface RoomInfo {
  sessionId: string;
  title: string;
  mode: string;
  userMaxCount: number;
  userCount: number;
  isPublic: string;
  password: string;
}

export interface OptionItem {
  mode: string;
}

function RoomList() {
  // 방만들기 모달창
  const [modalOpen, setModalOpen] = useState(false);
  const showModal = () => {
    setModalOpen(true);
  };

  // 페이지
  const [page, setPage] = useState(1);
  // 방 목록이 보일 개수
  const limit = 12;

  // 방 종류
  const sortType = [
    { mode: 'Default' },
    { mode: '일반모드' },
    { mode: '퍼펙트스코어' },
    { mode: '가사맞추기' },
  ];

  const [rooms, setRooms] = useState<RoomInfo[]>([]);
  const [filteredRoom, setFilteredRoom] = useState<RoomInfo[]>([]);
  // 방 목록 api
  async function getRoomsInfo() {
    const response = await axios({
      method: 'GET',
      url: 'api/v1/room/',
      headers: {
        Authorization: `${getCookie('Authorization')}`,
        refreshToken: `${getCookie('refreshToken')}`,
      },
    });
    const roomData = response.data.filter(
      (room: RoomInfo) => room.userCount !== 0,
    );
    setRooms(roomData);
    setFilteredRoom(roomData);
  }

  useEffect(() => {
    getRoomsInfo();
  }, []);

  // 게시할 부분만 잘라서 전달
  const offset = (page - 1) * limit;
  const postData = filteredRoom.slice(offset, offset + limit);

  return (
    <div className={styles.container}>
      {modalOpen && <RoomModal setModalOpen={setModalOpen} />}
      <div className={styles.search}>
        <RoomSearch
          optionItem={sortType}
          rooms={rooms}
          setFilteredRoom={setFilteredRoom}
          setPage={setPage}
        />
      </div>
      <div className={styles.addBtn}>
        <button type="button" className={styles.btn} onClick={showModal}>
          <Image
            src="img/common/common_add_image.svg"
            width={20}
            height={26}
            alt="add"
            className={styles.img}
          />
          방만들기
        </button>
      </div>
      <div className={styles.room}>
        {postData.map(info => (
          <RoomListItem info={info} key={info.sessionId} />
        ))}
      </div>
      <Pagination
        limit={limit}
        page={page}
        totalPosts={filteredRoom.length}
        setPage={setPage}
      />
    </div>
  );
}

export default RoomList;
