import Image from 'next/image';

import styles from '@/styles/main/TodayContest.module.scss';

function TodayContest(props: {
  data: {
    ranking: {
      rank: number;
      medal: string;
      profile: string;
      name: string;
      title: string;
      singer: string;
      like: string;
    }[];
  };
}) {
  const { ranking } = props.data;

  const rank = ranking.map(item => (
    <tr className={styles.item} key={item.rank}>
      <td className={styles.medal}>
        <Image
          src={item.medal}
          width={50}
          height={50}
          alt="medal"
          className={styles.medalIcon}
        />
      </td>
      <td className={styles.profile}>
        <div className={styles.content}>
          <Image src={item.profile} width={30} height={30} alt="profile" />
        </div>
      </td>
      <td className={styles.name}>{item.name}</td>
      <td className={styles.title}>{item.title}</td>
      <td className={styles.singer}>{item.singer}</td>
      <td className={styles.like}>{item.like}</td>
    </tr>
  ));
  const simpleRank = ranking.map(item => {
    return (
      <tr className={styles.simpleItem} key={item.rank}>
        <td className={styles.simpleMedal}>
          <Image
            src={item.medal}
            width={50}
            height={50}
            alt="medal"
            className={styles.simpleMedalIcon}
          />
        </td>
        <th className={styles.simpleName}>{item.name}</th>
      </tr>
    );
  });

  return (
    <div className={styles.container}>
      <div className={styles.contestTitle}>
        <Image
          src="img/main/main_crown_image.svg"
          width={63}
          height={63}
          alt="crown"
          className={styles.contestIcon}
        />
        <div className={styles.title}>오늘의 노래왕</div>
        <Image
          src="img/main/main_crown_image.svg"
          width={63}
          height={63}
          alt="crown"
          className={styles.contestIcon}
        />
      </div>
      <div className={styles.contestRank}>
        <table className={styles.rankTable}>
          <thead>
            <tr>
              <th role="row" />
              <th role="row" />
              <th>닉네임</th>
              <th>제목</th>
              <th>가수</th>
              <th>LIKE</th>
            </tr>
          </thead>
          <tbody>{rank}</tbody>
          <tbody className={styles.simpleRank}>{simpleRank}</tbody>
        </table>
      </div>
    </div>
  );
}

export default TodayContest;
