import React from 'react';
import { useSelector } from 'react-redux';

import styles from '@/styles/common/Title.module.scss';
import { RootState } from '@/redux/store';

function Title(props: { main: string; sub: string }) {
  const { main, sub } = props;

  const storeLogin = useSelector((state: RootState) => state.login);

  const goRoom = () => {
    if (window.location.pathname !== '/sing') {
      window.location.replace('sing/');
    } else {
      window.scrollTo({ top: 1200, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.title}>
      <div className={styles.top}>
        <div className={styles.point}>singing & enjoy </div>
        <hr className={styles.line} />
      </div>
      <div className={styles.main}>{main}</div>
      <div className={styles.sub}>{sub}</div>
      <div className={styles.btn}>
        <button
          className={styles.singBtn}
          type="button"
          onClick={() => {
            if (storeLogin.login) {
              goRoom();
            } else {
              window.confirm('로그인 후 이용하세요🎤🎵');
            }
          }}
        >
          노래 부르러 GO
        </button>
        <button
          className={styles.chartBtn}
          type="button"
          onClick={() => {
            if (storeLogin.login) {
              window.location.replace('chart/');
            } else {
              window.confirm('로그인 후 이용하세요🎤🎵');
            }
          }}
        >
          실시간 인기곡
        </button>
      </div>
    </div>
  );
}

export default Title;
