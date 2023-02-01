import Image from 'next/image';

import SwiperTop from '@/components/sing/SwiperTop';
import SoundBar from '@/components/common/SoundBar';
import RoomList from '@/components/sing/RoomList';
import TopImg from '@/components/common/TopImg';

import styles from '@/styles/sing/Sing.module.scss';

function Index() {
  return (
    <div className={styles.container}>
      <TopImg />
      <SwiperTop />
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
