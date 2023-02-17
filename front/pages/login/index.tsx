import React from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setLogin } from '@/redux/store/loginSlice';
import { setCookie, getCookie } from '@/util/cookie';

import { setImg, setNickname } from '@/redux/store/userSlice';
import { setEcho } from '@/redux/store/echoSlice';
import { setVolume } from '@/redux/store/volumeSlice';

import Spinner from '@/components/common/Spinner';

function kakao() {
  const dispatch = useDispatch();

  // URL에서 토큰 값 뽑아내기
  const ACCESS_TOKEN = new URL(window.location.href).searchParams.get(
    'Authorization',
  );
  const REFRESH_TOKEN = new URL(window.location.href).searchParams.get(
    'refreshToken',
  );

  // 쿠키 util을 사용해 쿠키에 토큰 저장
  if (ACCESS_TOKEN) {
    setCookie('Authorization', ACCESS_TOKEN, {
      path: '/',
      secure: true,
      sameSite: 'none',
    });
  }
  if (REFRESH_TOKEN) {
    setCookie('refreshToken', REFRESH_TOKEN, {
      path: '/',
      secure: true,
      sameSite: 'none',
    });
  }
  // 토큰을 잘 받았을 경우
  if (ACCESS_TOKEN && REFRESH_TOKEN) {
    // 로그인 상태 변경
    const login = true;
    dispatch(setLogin(login));

    // 사용자 정보 요청
    axios({
      method: 'GET',
      url: 'api/v1/profile',
      headers: {
        Authorization: `${getCookie('Authorization')}`,
        refreshToken: `${getCookie('refreshToken')}`,
      },
    })
      .then(res => {
        // 받은 사용자 정보 저장
        dispatch(setImg(res.data.image));
        dispatch(setNickname(res.data.nickname));
        dispatch(setEcho(res.data.eco));
        dispatch(setVolume(res.data.volume));

        // 상태 저장 후 메인으로 이동
      })
      .then(() => {
        window.location.replace('/');
      });
  }

  return <Spinner />;
}

export default kakao;
