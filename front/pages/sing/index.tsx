import { useEffect } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { setSessionState } from '@/redux/store/sessionStateSlice';
import { setRoomOut } from '@/redux/store/roomOutSlice';
import { getCookie } from '@/util/cookie';

import TopImg from '@/components/common/TopImg';
import SingTop from '@/components/sing/SingTop';
import RoomList from '@/components/sing/RoomList';
import SoundBar from '@/components/common/SoundBar';

import styles from '@/styles/sing/Sing.module.scss';

function Index() {
  const dispatch = useDispatch();
  const storeRoomOut = useSelector((state: RootState) => state.roomOut);

  useEffect(() => {
    dispatch(
      setSessionState({
        sessionId: '',
        sessionToken: '',
        sessionMode: '',
      }),
    );
    const token = getCookie('Authorization');
    if (!token) {
      window.location.href = '/';
    }
  }, []);

  useEffect(() => {
    if (storeRoomOut.isOut) {
      dispatch(setRoomOut(false));
      window.location.href = '/sing';
    }
  }, [storeRoomOut.isOut]);

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
