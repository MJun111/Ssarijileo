import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { setNickname } from '@/redux/store/userSlice';

import MicControlBar from '@/components/common/MicControlBar';
import EchoControlBar from '@/components/common/EchoControlBar';

import styles from '@/styles/profile/ContentForm.module.scss';

function ContentForm(props: { theme: string }) {
  const { theme } = props;
  const [nicknameValue, setNicknameValue] = useState('');
  const dispatch = useDispatch();

  const storeUser = useSelector((state: RootState) => state.user);

  const images = {
    name: `img/profile/${theme}/${theme}_name_image.svg`,
    nickname: `img/profile/${theme}/${theme}_nickname_image.svg`,
    email: `img/profile/${theme}/${theme}_email_image.svg`,
  };

  useEffect(() => {
    setNicknameValue(storeUser.nickname);
  }, [storeUser]);

  const saveProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(setNickname(nicknameValue));
    console.log('저장');
  };

  const nickNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNicknameValue(e.target.value);
  };

  return (
    <form onSubmit={saveProfile} className={styles.contentForm}>
      <label htmlFor="nickname">
        <p>
          <span>*</span>&nbsp;&nbsp;닉네임
        </p>
        <Image
          src={images.nickname}
          alt=""
          width={16}
          height={16}
          className={styles.img}
        />
        <input
          id="nickname"
          type="text"
          className={styles.nickname}
          value={nicknameValue}
          onChange={nickNameChange}
        />
        <button type="button" className={styles.checkBtn}>
          중복검사
        </button>
      </label>
      <div className={styles.scrollBox}>
        <label htmlFor="micVolume">
          <p>
            <span>*</span>&nbsp;&nbsp;마이크 볼륨
          </p>
          <div className={styles.ctlBox}>
            <MicControlBar />
          </div>
        </label>
        <label htmlFor="echo">
          <p>
            <span>*</span>&nbsp;&nbsp;에코
          </p>
          <div className={styles.ctlBox}>
            <EchoControlBar />
          </div>
        </label>
      </div>
      <button type="submit" className={styles.submitBtn}>
        저장
      </button>
    </form>
  );
}

export default ContentForm;
