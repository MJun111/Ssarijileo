import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { setEcho } from '@/redux/store/echoSlice';
import { RootState } from '@/redux/store';

import styles from '@/styles/common/ControlBar.module.scss';

function EchoControlBar() {
  const [echo, setState] = useState(0.5);
  const dispatch = useDispatch();
  const storeEcho = useSelector((state: RootState) => state.echo);

  useEffect(() => {
    setState(storeEcho.echo);
  }, [storeEcho]);

  const changeEcho = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(Number(e.target.value));
    dispatch(setEcho(Number(e.target.value)));
    e.target.style.background = `linear-gradient(to right, #00AADF 0%, #00AADF ${Math.round(
      echo * 100,
    )}%, rgb(236, 236, 236) ${Math.round(
      echo * 100,
    )}%, rgb(236, 236, 236) 100%)`;
  };
  return (
    <div id="controls" className={styles.controls}>
      <input
        id="echo"
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={echo}
        onChange={changeEcho}
        className={styles.echoBar}
      />
      <div className={styles.number}>{Math.round(echo * 100)}%</div>
    </div>
  );
}

export default EchoControlBar;
