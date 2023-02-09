import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import { useDispatch } from 'react-redux';
import { setLike } from '@/redux/store/likeSlice';

import ContestListItem from './ContestListItem';
import Pagination from '../common/Pagination';

import styles from '@/styles/contest/ContestList.module.scss';
import ContestSearch from '@/components/contest/ContestSearch';

export interface VideoInfo {
  id: number;
  url: string;
  name: string;
  title: string;
  singer: string;
  like: number;
}

export interface OptionItem {
  mode: string;
}

function ContestList() {
  const nameList = [
    'zㅣ존예지',
    '이수민',
    '길상욱',
    '김태학',
    '김명준',
    '김소윤',
  ];
  const videoList: VideoInfo[] = [];
  for (let i = 0; i < 100; i++) {
    const num = Math.floor(Math.random() * 5);
    const num2 = Math.floor(Math.random() * 5000);
    const video = {
      id: i,
      url: 'video/test.mp4',
      name: nameList[num],
      title: 'OMG',
      singer: 'NewJeans',
      like: num2,
    };
    videoList.push(video);
  }
  const [video] = useState(videoList);
  const [filteredVideo, setFilteredVideo] = useState(video);

  //  페이지
  const [page, setPage] = useState(1);

  //  방 목록이 보일 개수
  const limit = 9;

  //  방 목록
  const sortType = [{ mode: 'Default' }, { mode: 'Like' }, { mode: 'Newest' }];

  // 게시할 부분만 잘라서 전달
  const offset = (page - 1) * limit;
  let postData = filteredVideo.slice(offset, offset + limit);
  useEffect(() => {
    postData = filteredVideo.slice(offset, offset + limit);
    console.log(postData);
  }, [filteredVideo]);

  const dispatch = useDispatch();
  return (
    <div className={styles.container}>
      <div className={styles.search}>
        <div className={styles.title}>
          노래자랑
          <Image
            src="img/contest/contest_mic_image.svg"
            width={35}
            height={35}
            alt="mic"
            className={styles.icon}
          />
        </div>
      </div>
      <ContestSearch
        optionItem={sortType}
        videos={video}
        setFilteredVideo={setFilteredVideo}
      />
      <div className={styles.addBtn}>
        <button
          type="button"
          className={styles.btn}
          onClick={() => {
            dispatch(setLike('녹화본'));
            window.location.replace('like/');
          }}
        >
          <Image
            src="img/common/common_write_image.svg"
            width={20}
            height={26}
            alt="add"
            className={styles.img}
          />
          글작성
        </button>
      </div>
      <div className={styles.room}>
        {postData.map(info => (
          <ContestListItem info={info} key={info.id} />
        ))}
      </div>
      <Pagination
        limit={limit}
        page={page}
        totalPosts={videoList.length}
        setPage={setPage}
      />
    </div>
  );
}
export default ContestList;
