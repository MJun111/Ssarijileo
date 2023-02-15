import Image from 'next/image';
import styles from '@/styles/room/Guess.module.scss';

function Guess(props: { session: any; nextSong: any }) {
  const { session, nextSong } = props;
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
            onClick={() => {
              session
                .signal({
                  data: 'ok', // Any string (optional)
                  to: [], // Array of Connection objects (optional. Broadcast to everyone if empty)
                  type: 'ok', // The type of message (optional)
                })
                .then(() => {
                  console.log(`ok button 정보 송신 성공`);
                })
                .catch((error: any) => {
                  console.error('ok button 정보 송신 실패', error);
                });
            }}
          />
          <Image
            className={styles.x}
            src="img/ssari/ssari_x_image.svg"
            width={50}
            height={50}
            alt="x"
            onClick={() => {
              session
                .signal({
                  data: 'no', // Any string (optional)
                  to: [], // Array of Connection objects (optional. Broadcast to everyone if empty)
                  type: 'no', // The type of message (optional)
                })
                .then(() => {
                  console.log(`no button 정보 송신 성공`);
                })
                .catch((error: any) => {
                  console.error('no button 정보 송신 실패', error);
                });
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Guess;
