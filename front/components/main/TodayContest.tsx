import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import axios from 'axios';

import type { RankingItem } from '@/pages';

import styles from '@/styles/main/TodayContest.module.scss';
import { getCookie } from '@/util/cookie';

function TodayContest(props: { ranking: RankingItem[] }) {
  const { ranking } = props;
  const storeLogin = useSelector((state: RootState) => state.login);
  const storeUser = useSelector((state: RootState) => state.user);
  const [rank, setRank] = useState<JSX.Element[]>([]);
  const medal = [
    'img/main/main_medal_gold_image.svg',
    'img/main/main_medal_silver_image.svg',
    'img/main/main_medal_bronze_image.svg',
  ];

  const profiles: {
    nickname: string;
    image: string;
  }[] = [];

  const findProfile = (nickname: string) => {
    const profile = profiles.find(item => item.nickname === nickname);
    return profile ? profile.image : 'img/main/main_profile_image.svg';
  };

  useEffect(() => {
    axios
      .get('api/v1/friend/' + storeUser.nickname, {
        headers: {
          Authorization: getCookie('Authorization'),
        },
      })
      .then(res => {
        profiles.push(...res.data);
      })
      .then(() => {
        const rank = ranking.map((item, idx) => (
          <tr
            className={styles.item}
            key={item.singingContestId}
            onClick={() => {
              if (storeLogin.login) {
                window.location.replace('contest/');
              } else {
                window.confirm('로그인 후 이용하세요🎤🎵');
              }
            }}
          >
            <td className={styles.medal}>
              <Image
                src={medal[idx]}
                width={50}
                height={50}
                alt="medal"
                className={styles.medalIcon}
              />
            </td>
            <td className={styles.profile}>
              <div className={styles.content}>
                <Image
                  src={findProfile(item.nickname)}
                  width={30}
                  height={30}
                  alt="profile"
                />
              </div>
            </td>
            <td className={styles.name}>{item.nickname}</td>
            <td className={styles.title}>{item.title}</td>
            <td className={styles.singer}>{item.singer}</td>
            <td className={styles.like}>{item.likeCount}</td>
          </tr>
        ));
        setRank(rank);
      });
  }, [ranking]);

  const simpleRank = ranking.map((item, idx) => {
    return (
      <tr
        className={styles.simpleItem}
        key={item.singingContestId}
        onClick={() => {
          if (storeLogin.login) {
            window.location.replace('contest/');
          } else {
            window.confirm('로그인 후 이용하세요🎤🎵');
          }
        }}
      >
        <td className={styles.simpleMedal}>
          <Image
            src={medal[idx]}
            width={50}
            height={50}
            alt="medal"
            className={styles.simpleMedalIcon}
          />
        </td>
        <th className={styles.simpleName}>{item.nickname}</th>
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
