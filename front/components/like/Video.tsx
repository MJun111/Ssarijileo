import React, { useState } from 'react';
import Image from 'next/image';
import styles from '@/styles/like/Video.module.scss';
import VideoItem from '@/components/like/VideoItem';
import Pagination from '../common/Pagination';
import { RecordInfo } from '@/pages/like';

function Video(props: { recordList: RecordInfo[] }) {
  const { recordList } = props;
  //  페이지
  const [page, setPage] = useState(1);
  //  방 목록이 보일 개수
  const limit = 9;
  // 게시할 부분만 잘라서 전달
  const offset = (page - 1) * limit;

  const [musicList, setState] = useState<RecordInfo[]>(recordList);

  const searchFriend = (e: React.ChangeEvent<HTMLInputElement>) => {
    const eventTarget = e.target as HTMLInputElement;
    const arr: RecordInfo[] = [];
    recordList.forEach((item, idx) => {
      if (
        item.title.includes(eventTarget.value) ||
        item.singer.includes(eventTarget.value)
      ) {
        arr.push(recordList[idx]);
      }
    });

    setState(arr);
  };
  const postData = musicList?.slice(offset, offset + limit);

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.title}>
          녹화본
          <Image
            src="img/main/main_headphone_image.svg"
            width={40}
            height={40}
            alt="mic"
            className={styles.icon}
          />
        </div>
        <div className={styles.search}>
          <input
            className={styles.input}
            type="text"
            placeholder="검색어를 입력하세요..."
            onChange={searchFriend}
          />
          <Image
            src="img/common/light/light_common_find_image.svg"
            width={37}
            height={37}
            alt="find"
            className={styles.find}
          />
        </div>
      </div>
      <div className={styles.room}>
        {postData?.map(info => (
          <VideoItem info={info} key={info.recordingId} />
        ))}
      </div>
      <div className={styles.page}>
        <Pagination
          limit={limit}
          page={page}
          totalPosts={recordList ? recordList.length : 0}
          setPage={setPage}
        />
      </div>
    </div>
  );
}
export default Video;
