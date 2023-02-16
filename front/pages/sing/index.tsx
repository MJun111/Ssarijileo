import { useEffect } from 'react';
import Image from 'next/image';
import { useDispatch } from 'react-redux';

import TopImg from '@/components/common/TopImg';
import SingTop from '@/components/sing/SingTop';
import RoomList from '@/components/sing/RoomList';
import SoundBar from '@/components/common/SoundBar';

import { setSessionState } from '@/redux/store/sessionStateSlice';
import { getCookie } from '@/util/cookie';
import styles from '@/styles/sing/Sing.module.scss';

function Index() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setSessionState(''));
    const token = getCookie('Authorization');
    if (!token) {
      window.location.href = '/';
    }
  }, []);
  return (
    <div className={styles.container}>
      <TopImg />
      <SingTop />
      <Image
        src="img/common/common_music_note1_image.svg"
        width={130}
        height={130}
        alt="noteA"
        className={styles.noteA}
      />
      <Image
        src="img/common/common_music_note2_image.svg"
        width={160}
        height={160}
        alt="noteB"
        className={styles.noteB}
      />
      <Image
        src="img/common/common_music_note3_image.svg"
        width={120}
        height={120}
        alt="noteC"
        className={styles.noteC}
      />
      <SoundBar />
      <div className={styles.title}>노래방 입장하기</div>
      <RoomList />
      <SoundBar />
    </div>
  );
}

export default Index;
