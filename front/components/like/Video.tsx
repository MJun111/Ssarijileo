import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import hangul from 'hangul-js';
import { RecordInfo } from '@/pages/like';
import { getCookie } from '@/util/cookie';

import VideoItem from '@/components/like/VideoItem';
import Pagination from '../common/Pagination';

import styles from '@/styles/like/Video.module.scss';

function Video() {
  // const { recordList } = props;
  const [recordList, setRecordList] = useState<RecordInfo[]>([]);
  const [filteredRecordList, setFilteredRecordList] = useState<RecordInfo[]>(
    [],
  );

  useEffect(() => {
    axios
      .get('api/v1/recording/my', {
        headers: {
          Authorization: getCookie('Authorization'),
          refreshToken: getCookie('refreshToken'),
        },
      })
      .then(res => {
        setRecordList(res.data);
        setFilteredRecordList(res.data);
      });
  }, []);
  //  페이지
  const [page, setPage] = useState(1);
  //  방 목록이 보일 개수
  const limit = 9;
  // 게시할 부분만 잘라서 전달
  const offset = (page - 1) * limit;

  const searchRecord = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      setFilteredRecordList(recordList);
      return;
    }
    const userInput = hangul.disassemble(e.target.value).join('');
    const searchData = recordList.filter(item => {
      const title = hangul.disassemble(item.title, true);
      const singer = hangul.disassemble(item.singer, true);
      const titleInitial = title
        .map((t: string[]) => {
          return t[0];
        })
        .join('');
      const singerInitial = singer
        .map((t: string[]) => {
          return t[0];
        })
        .join('');
      return (
        hangul.search(item.title, userInput) !== -1 ||
        hangul.search(item.singer, userInput) !== -1 ||
        titleInitial.startsWith(userInput) ||
        singerInitial.startsWith(userInput) ||
        item.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.singer.toLowerCase().includes(e.target.value.toLowerCase())
      );
    });
    setFilteredRecordList(searchData);
  };

  const postData = filteredRecordList.slice(offset, offset + limit);

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
            onChange={searchRecord}
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
        {postData.map(info => (
          <VideoItem info={info} key={info.recordingId} />
        ))}
      </div>
      <div className={styles.page}>
        <Pagination
          limit={limit}
          page={page}
          totalPosts={filteredRecordList.length}
          setPage={setPage}
        />
      </div>
    </div>
  );
}
export default Video;
