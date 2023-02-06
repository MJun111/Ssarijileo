import React from 'react';
import Spinner from '@/components/common/Spinner';
import { setCookie } from '@/util/cookie';

function kakao() {
  const ACCESS_TOKEN = new URL(window.location.href).searchParams.get(
    'Authorization',
  );
  const REFRESH_TOKEN = new URL(window.location.href).searchParams.get(
    'refreshToken',
  );

  // console.log(ACCESS_TOKEN);
  // console.log(REFRESH_TOKEN);

  // 쿠키 util을 사용해 쿠키에 토큰 저장

  if (ACCESS_TOKEN) {
    setCookie('Authorization', ACCESS_TOKEN, {
      path: '/',
      secure: true,
      sameSite: 'none',
    });
    // localStorage.setItem('accessToken', ACCESS_TOKEN);
  }
  if (REFRESH_TOKEN) {
    setCookie('refreshToken', REFRESH_TOKEN, {
      path: '/',
      secure: true,
      sameSite: 'none',
    });
    // localStorage.setItem('refreshToken', REFRESH_TOKEN);
  }

  return <Spinner />;
}

export default kakao;
