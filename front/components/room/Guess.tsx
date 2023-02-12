import Image from 'next/image';
import styles from '@/styles/room/Guess.module.scss';

function Guess() {
  const DUMMY_DATA = [
    {
      lyricsId: 20,
      verse: '생각이 많은 건 말이야',
      startTime: 24,
    },
    {
      lyricsId: 21,
      verse: '당연히 해야 할 일이야',
      startTime: 27,
    },
    {
      lyricsId: 22,
      verse: '나에겐 우리가 지금 일순위야',
      startTime: 29,
    },
    {
      lyricsId: 23,
      verse: '안전한 유리병을 핑계로',
      startTime: 33,
    },
    {
      lyricsId: 24,
      verse: '바람을 가둬 둔 것 같지만',
      startTime: 39,
    },
    {
      lyricsId: 25,
      verse: '기억나? 그날의 우리가',
      startTime: 44,
    },
    {
      lyricsId: 26,
      verse: '잡았던 그 손엔 말이야',
      startTime: 46,
    },
    {
      lyricsId: 27,
      verse: '설레임보다 커다란 믿음이 담겨서',
      startTime: 49,
    },
    {
      lyricsId: 28,
      verse: '난 함박웃음을 지었지만',
      startTime: 53,
    },
    {
      lyricsId: 29,
      verse: '울음이 날 것도 같았어',
      startTime: 56,
    },
    {
      lyricsId: 30,
      verse: '소중한 건 언제나 두려움이니까',
      startTime: 58,
    },
  ];
  const lyricList = DUMMY_DATA.map(item => {
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
