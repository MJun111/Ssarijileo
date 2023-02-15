// Path: 'profile/'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getCookie } from '@/util/cookie';

import ContentForm from '@/components/profile/ContentForm';
import FriendForm from '@/components/profile/FriendForm';

import styles from '@/styles/profile/Profile.module.scss';

function MyPage() {
  const [themeMode, setThemeMode] = useState('light');
  const [type, setType] = useState('계정 관리');
  const [nicknameValue, setNicknameValue] = useState('');
  const [profile, setProfile] = useState('');

  const storeTheme: any = useSelector((state: RootState) => state.theme);
  const storeUser: any = useSelector((state: RootState) => state.user);

  useEffect(() => {
    setThemeMode(storeTheme.theme);
  }, [storeTheme]);

  useEffect(() => {
    setProfile(storeUser.img);
    setNicknameValue(storeUser.nickname);
  }, [storeUser]);

  useEffect(() => {
    const token = getCookie('Authorization');
    if (!token) {
      window.location.href = '/';
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.sidebar}>
          <div className={styles.profileImg}>
            {profile && (
              <Image
                src={profile}
                alt="profile"
                className={styles.profile}
                width={100}
                height={100}
                priority
              />
            )}
          </div>
          <div className={styles.name}>{nicknameValue}님</div>
          <button
            type="button"
            className={styles.btn}
            onClick={() => {
              setType('계정 관리');
            }}
          >
            계정 관리
          </button>
          <button
            type="button"
            className={styles.btn}
            onClick={() => {
              setType('친구 목록');
            }}
          >
            친구 목록
          </button>
        </div>

        <div className={styles.content}>
          <h1>마이페이지</h1>
          <p className={styles.contentHeader}>{type}</p>
          {type === '계정 관리' && <ContentForm theme={themeMode} />}
          {type === '친구 목록' && <FriendForm />}
        </div>
      </div>
    </div>
  );
}

export default MyPage;
