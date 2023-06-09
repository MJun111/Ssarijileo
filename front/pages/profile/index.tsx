// Path: 'profile/'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getCookie } from '@/util/cookie';

import ContentForm from '@/components/profile/ContentForm';
import FriendForm from '@/components/profile/FriendForm';

import styles from '@/styles/profile/Profile.module.scss';
import { setProfile } from '@/redux/store/profileSlice';

function MyPage() {
  const [type, setType] = useState('계정 관리');

  const storeTheme = useSelector((state: RootState) => state.theme);
  const storeUser = useSelector((state: RootState) => state.user);
  const storeProfile = useSelector((state: RootState) => state.profile);
  const { theme } = storeTheme;
  const profileImg = storeUser.img;
  const nicknameValue = storeUser.nickname;
  const dispatch = useDispatch();

  useEffect(() => {
    const token = getCookie('Authorization');
    if (!token) {
      window.location.href = '/';
    }
  }, []);

  useEffect(() => {
    setType(storeProfile.profile);
  }, [storeProfile]);

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.sidebar}>
          <div className={styles.profileImg}>
            {profileImg && (
              <Image
                src={profileImg}
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
              dispatch(setProfile('계정 관리'));
              setType('계정 관리');
            }}
          >
            계정 관리
          </button>
          <button
            type="button"
            className={styles.btn}
            onClick={() => {
              dispatch(setProfile('친구 목록'));
              setType('친구 목록');
            }}
          >
            친구 목록
          </button>
        </div>

        <div className={styles.content}>
          <h1>마이페이지</h1>
          <p className={styles.contentHeader}>{type}</p>
          {storeProfile.profile === '계정 관리' && (
            <ContentForm theme={theme} />
          )}
          {storeProfile.profile === '친구 목록' && <FriendForm />}
        </div>
      </div>
    </div>
  );
}

export default MyPage;
