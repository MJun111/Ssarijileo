import Image from 'next/image';
import styles from '@/styles/room/Guess.module.scss';

function Guess(props: { session: any; nextSong: any }) {
  const { nextSong } = props;
  const lyricList = nextSong.lyricsList.map((item: any) => {
    // setInterval로 다음 가사 시간 전까지 class지정
    return (
      <div className={styles.item} key={item.lyricsId}>
        {item.verse}
      </div>
    );
  });
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.lyric}>{lyricList}</div>
        <div className={styles.btnList}>
          <Image
            className={styles.o}
            src="img/ssari/ssari_o_image.svg"
            width={50}
            height={50}
            alt="o"
          />
          <Image
            className={styles.x}
            src="img/ssari/ssari_x_image.svg"
            width={50}
            height={50}
            alt="x"
          />
        </div>
      </div>
    </div>
  );
}

export default Guess;
