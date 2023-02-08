import React from 'react';
import { useDispatch } from 'react-redux';
import { setLogin } from '@/redux/store/loginSlice';
import Spinner from '@/components/common/Spinner';
import { setCookie } from '@/util/cookie';

function kakao() {
  // const [nowLogin, setNowLogin] = useState(false);
  const dispatch = useDispatch();

  console.log('@!!!!!!');
  const ACCESS_TOKEN = new URL(window.location.href).searchParams.get(
    'Authorization',
  );
  const REFRESH_TOKEN = new URL(window.location.href).searchParams.get(
    'refreshToken',
  );

  console.log(ACCESS_TOKEN);
  console.log(REFRESH_TOKEN);

  // 쿠키 util을 사용해 쿠키에 토큰 저장

  if (ACCESS_TOKEN) {
    setCookie('Authorization', ACCESS_TOKEN, {
      path: '/',
      secure: true,
      sameSite: 'none',
    });
    localStorage.setItem('accessToken', ACCESS_TOKEN);
  }
  if (REFRESH_TOKEN) {
    setCookie('refreshToken', REFRESH_TOKEN, {
      path: '/',
      secure: true,
      sameSite: 'none',
    });
    localStorage.setItem('refreshToken', REFRESH_TOKEN);
  }

  if (ACCESS_TOKEN && REFRESH_TOKEN) {
    const login = true;
    dispatch(setLogin(login));
    // localStorage.setItem('login', login);
  }

  // history.replace('/');
  window.location.replace('/');

  return <Spinner />;
}

export default kakao;
