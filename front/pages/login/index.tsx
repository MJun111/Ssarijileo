import React from 'react';
import { useDispatch } from 'react-redux';
import { setLogin } from '@/redux/store/loginSlice';
import { setCookie } from '@/util/cookie';

import Spinner from '@/components/common/Spinner';

function kakao() {
  const dispatch = useDispatch();

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

  if (ACCESS_TOKEN && REFRESH_TOKEN) {
    const login = true;
    dispatch(setLogin(login));
  }

  window.location.replace('/');

  return <Spinner />;
}

export default kakao;
