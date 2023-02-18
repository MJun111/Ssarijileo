import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import classNames from 'classnames';

import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { RootState } from '@/redux/store';
import { setNickname } from '@/redux/store/userSlice';

import MicControlBar from '@/components/common/MicControlBar';
import EchoControlBar from '@/components/common/EchoControlBar';

import { getCookie } from '@/util/cookie';
import styles from '@/styles/profile/ContentForm.module.scss';

function ContentForm(props: { theme: string }) {
  const { theme } = props;
  const [nicknameValue, setNicknameValue] = useState('');
  const [nicknameWarning, setNicknameWarning] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [echoInfo, setEchoInfo] = useState(0.5);
  const [volumeInfo, setVolumeInfo] = useState(0.5);
  const dispatch = useDispatch();

  const storeUser = useSelector((state: RootState) => state.user);
  const storeEcho = useSelector((state: RootState) => state.echo);
  const storeVolume = useSelector((state: RootState) => state.volume);

  const images = {
    name: `img/profile/${theme}/${theme}_name_image.svg`,
    nickname: `img/profile/${theme}/${theme}_nickname_image.svg`,
    email: `img/profile/${theme}/${theme}_email_image.svg`,
  };

  useEffect(() => {
    setNicknameValue(storeUser.nickname);
  }, [storeUser]);

  useEffect(() => {
    setEchoInfo(storeEcho.echo);
  }, [storeEcho]);

  useEffect(() => {
    setVolumeInfo(storeVolume.volume);
  }, [storeVolume]);

  const saveProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(setNickname(nicknameValue));
  };

  const nicknameClass = classNames({
    [styles.warning]: nicknameWarning,
    [styles.nickname]: true,
  });

  const nickNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 10) {
      setNicknameWarning(true);
      return;
    }
    setNicknameWarning(false);
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
          className={nicknameClass}
          value={nicknameValue}
          onChange={nickNameChange}
        />
        <button
          type="button"
          className={styles.checkBtn}
          onClick={() => {
            axios
              .get(`api/v1/profile/check/${nicknameValue}`, {
                headers: {
                  Authorization: `${getCookie('Authorization')}`,
                  refreshToken: `${getCookie('refreshToken')}`,
                },
              })
              .then(res => {
                if (!res.data) {
                  window.confirm('이미 존재하는 닉네임입니다. 🥲');
                } else {
                  window.confirm('사용할 수 있는 닉네임입니다. 😎');
                }
                setIsChecked(res.data);
              });
          }}
        >
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
      <button
        type="submit"
        className={styles.submitBtn}
        onClick={() => {
          if (isChecked) {
            axios
              .put(
                'api/v1/profile',
                {
                  nickname: nicknameValue,
                  eco: echoInfo,
                  volume: volumeInfo,
                },
                {
                  headers: {
                    Authorization: `${getCookie('Authorization')}`,
                    refreshToken: `${getCookie('refreshToken')}`,
                  },
                },
              )
              .then(() => {
                window.confirm('변경된 내용으로 저장되었습니다 🆕');
              });
          } else {
            window.confirm('중복검사는 필수입니다 ⛔');
          }
        }}
      >
        저장
      </button>
    </form>
  );
}

export default ContentForm;
