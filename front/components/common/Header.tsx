import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { NativeEventSource, EventSourcePolyfill } from 'event-source-polyfill';

import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '@/redux/store/themeSlice';
import { setLogin } from '@/redux/store/loginSlice';
import { RootState } from '@/redux/store';
import 'react-toastify/dist/ReactToastify.css';

import LoginModal from '@/components/login/LoginModal';
import Dropdown from '@/components/common/Dropdown';

import styles from '@/styles/common/Header.module.scss';

function Header() {
  if (window.location.pathname === '/room') return null;

  const [modalOpen, setModalOpen] = useState(false);
  const [themeMode, setThemeMode] = useState('light');
  const [nowLogin, setNowLogin] = useState(false);
  const [checked, setChecked] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [profile, setProfile] = useState('');
  const dispatch = useDispatch();

  const storeLogin = useSelector((state: RootState) => state.login);
  const storeTheme = useSelector((state: RootState) => state.theme);
  const storeUser = useSelector((state: RootState) => state.user);

  const changeMode = useCallback(() => {
    setChecked(!checked);
    const theme = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(theme);
    dispatch(setTheme(theme));
  }, [checked, themeMode]);

  useEffect(() => {
    document.body.dataset.theme = themeMode;
  }, [themeMode]);

  useEffect(() => {
    const theme = storeTheme.theme || 'light';
    setThemeMode(theme);
    dispatch(setTheme(theme));
    setChecked(theme === 'dark');
  }, []);

  useEffect(() => {
    setNowLogin(storeLogin.login);
  }, [storeLogin]);

  useEffect(() => {
    setProfile(storeUser.img);
  }, [storeUser]);

  const toggleDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setDropdownVisible(!dropdownVisible);
  };

  // header 에 들어갈 menu 리스트
  const headerMenu = [
    {
      name: '노래방',
      link: 'sing/',
    },
    {
      name: '인기차트',
      link: 'chart/',
    },
    {
      name: '노래자랑',
      link: 'contest/',
    },
    {
      name: '마이뮤직',
      link: 'like/',
    },
  ];

  const icons = {
    logo: `icon/header/${themeMode}/${themeMode}_logo.svg`,
    mode: `icon/header/${themeMode}/${themeMode}_mode_icon.svg`,
    alarm: `icon/header/${themeMode}/${themeMode}_alarm_icon.svg`,
    logout: `icon/header/${themeMode}/${themeMode}_logout_icon.svg`,
    profile: `icon/header/${themeMode}/${themeMode}_profile_icon.svg`,
    dropdown: `icon/header/${themeMode}/${themeMode}_dropdown_icon.svg`,
  };

  // menu 리스트 요소에 대한 태그 생성
  const headerMenus = headerMenu.map(menu => (
    <button
      type="button"
      key={menu.name}
      className={styles.pages}
      onClick={() => {
        if (storeLogin.login) {
          window.location.replace(menu.link);
        } else {
          window.confirm('로그인 후 이용하세요🎤🎵');
        }
      }}
    >
      {menu.name}
    </button>
  ));

  const dropDownMenu = headerMenu.map(menu => (
    <li key={menu.name}>
      <button
        type="button"
        key={menu.name}
        className={styles.pages}
        onClick={() => {
          if (storeLogin.login) {
            window.location.replace(menu.link);
          } else {
            window.confirm('로그인 후 이용하세요🎤🎵');
          }
        }}
      >
        {menu.name}
      </button>
    </li>
  ));

  // 로그인 버튼 클릭 시 모달창 Open
  const showModal = () => {
    setModalOpen(true);
  };

  const userNickname = storeUser.nickname;

  const EventSource = EventSourcePolyfill || NativeEventSource;

  const [sessionId, setSessionId] = useState('');
  const [isInvite, setIsInvite] = useState(false);
  const attendRoom = () => {
    if (!isInvite || !sessionId || !storeLogin.login) return;
    console.log(sessionId);
    const popupWindow = window.open('room/', 'windowName', 'resizeable');
    if (!popupWindow) return;
    popupWindow.resizeTo(1920, 1080);
    popupWindow.onresize = () => {
      popupWindow.resizeTo(1920, 1080);
    };
  };

  useEffect(() => {
    if (storeLogin.login) {
      // const token = getCookie('Authorization');
      const eventSource = new EventSource(`api/v1/sse/${userNickname}`, {
        // headers: { Authorization: token },
        heartbeatTimeout: 1000000,
      });

      eventSource.onmessage = e => {
        try {
          const msg = JSON.parse(e.data);
          if (msg.args.type === 'request') {
            const notify = () =>
              toast(`${msg.fromUserNickname}으로 부터의 친구요청`, {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                draggable: true,
              });
            notify();
            setIsInvite(false);
          } else if (msg.args.type === 'invite') {
            const notify = () =>
              toast(`${msg.fromUserNickname}으로 부터의 초대`, {
                position: 'top-right',
                autoClose: 15000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            notify();
            setSessionId(msg.sessionId);
            setIsInvite(true);
          }
        } catch (err) {
          console.log(err);
        }
      };
      eventSource.onerror = (e: any) => {
        if (!e.error?.message.includes('No activity')) {
          console.log('close');
          eventSource.close();
        }
      };
    }
  }, []);

  return (
    <header className={styles.header}>
      {modalOpen && <LoginModal setModalOpen={setModalOpen} />}
      <Link href="/">
        <Image
          src={icons.logo}
          alt="logoFail"
          width={70}
          height={70}
          priority
        />
      </Link>
      <div className={styles.menu}>{headerMenus}</div>
      <div className={styles.dropdown}>
        <button type="button" onClick={toggleDropdown}>
          메뉴
          <Image src={icons.dropdown} alt="drop" width={16} height={16} />
        </button>
        <Dropdown visible={dropdownVisible}>
          <ul className={styles.content}>{dropDownMenu}</ul>
        </Dropdown>
      </div>

      <div className={styles.icons}>
        <div className={styles.icon}>
          <label className={styles.switch} htmlFor="toggleSwitch">
            <input
              type="checkbox"
              onChange={changeMode}
              className={styles.checkbox}
              checked={checked}
              id="toggleSwitch"
            />
          </label>
          <Image src={icons.mode} alt="mode" width={20} height={20} />
        </div>
        {/* 로그아웃 상태 */}
        {!nowLogin && (
          <div className={styles.login}>
            <button
              type="button"
              className={styles.loginBtn}
              onClick={showModal}
            >
              Login
            </button>
          </div>
        )}
        {/* 로그인 상태 */}
        {nowLogin && (
          <div className={styles.icon}>
            <div onClick={attendRoom} className={styles.toastBox}>
              <ToastContainer className={styles.toast} />
            </div>
            <Image
              src={icons.logout}
              alt="logout"
              width={15}
              height={15}
              className={styles.logout}
              onClick={() => {
                setNowLogin(false);
                dispatch(setLogin(false));
                window.location.replace('/');
              }}
            />
            <Link href="profile/" key="profile">
              <Image
                src={profile}
                alt="profile"
                width={50}
                height={50}
                className={styles.profile}
              />
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
