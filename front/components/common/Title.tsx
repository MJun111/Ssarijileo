import React from 'react';
import { useSelector } from 'react-redux';

import styles from '@/styles/common/Title.module.scss';

function Title(props: { main: string; sub: string }) {
  const { main, sub } = props;

  const storeLogin: any = useSelector<any>(state => state.login);

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
              window.location.replace('sing/');
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
