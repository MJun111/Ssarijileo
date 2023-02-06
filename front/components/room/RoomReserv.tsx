import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useSelector } from 'react-redux';
import styles from '@/styles/room/RoomReserv.module.scss';
import RoomReservItem from '@/components/room/RoomReservItem';
import Pagination from '@/components/common/Pagination';

interface SongData {
  songId: number;
  title: string;
  singer: string;
  album: string;
  image: string;
  // releaseDate: string;
}

function RoomReserv({ setModalOpen }: any) {
  const [themeMode, setThemeMode] = useState('light');

  const storeTheme = useSelector<any>(state => state.theme);
  useEffect(() => {
    setThemeMode(localStorage.getItem('theme') || 'light');
  }, [themeMode, storeTheme]);

  //  페이지
  const [page, setPage] = useState(1);
  //  노래 목록이 보일 개수
  const limit = 5;

  const [musicList, setState] = useState<SongData[]>([]);

  let chartList: SongData[] = [];
  useEffect(() => {
    axios.get('api/v1/song').then(res => {
      chartList = [...res.data];
      setState(chartList);
    });
  }, []);

  const offset = (page - 1) * limit;

  const searchFriend = (e: React.ChangeEvent<HTMLInputElement>) => {
    const eventTarget = e.target as HTMLInputElement;
    const arr: SongData[] = [];
    chartList.forEach((item, idx) => {
      if (
        item.title.includes(eventTarget.value) ||
        item.singer.includes(eventTarget.value)
      ) {
        arr.push(chartList[idx]);
      }
    });

    setState(arr);
  };

  const postData = musicList.slice(offset, offset + limit);

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
        <div className={styles.title}>
          <div>노래 검색</div>
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
        <div className={styles.top}>
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
        <div className={styles.chart}>
          {postData.map(item => {
            return (
              <div className={styles.item} key={item.songId}>
                <RoomReservItem item={item} />
              </div>
            );
          })}
        </div>
        <div className={styles.page}>
          <Pagination
            limit={limit}
            page={page}
            totalPosts={musicList.length}
            setPage={setPage}
          />
        </div>
      </div>
    </div>
  );
}

// export async function getStaticProps() {
//   try {
//     const response = await axios.get<SongData>('api/v1/song');
//     const data = response.data;
//     return {
//       props: {
//         songGetgata: data,
//       },
//     };
//   } catch (err) {
//     console.log(err);
//   }
// }

export default RoomReserv;
