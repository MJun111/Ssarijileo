import React, { useEffect, useState, useCallback } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { setVolume } from '@/redux/store/volumeSlice';
import { RootState } from '@/redux/store';

import styles from '@/styles/common/ControlBar.module.scss';

function MicControlBar() {
  const [volume, setState] = useState(0.5);
  const dispatch = useDispatch();
  const storeVolume = useSelector((state: RootState) => state.volume);
  useEffect(() => {
    setState(storeVolume.volume);
  }, [storeVolume]);

  const changeVolume = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setState(Number(e.target.value));
      dispatch(setVolume(Number(e.target.value)));
      e.target.style.background = `
      linear-gradient(to right, #FFE283 0%, #FFE283 ${Math.round(
        volume * 100,
      )}%, rgb(236, 236, 236) ${Math.round(
        volume * 100,
      )}%, rgb(236, 236, 236) 100%)
    `;
    },
    [volume],
  );
  return (
    <div id="controls" className={styles.controls}>
      <input
        id="micVolume"
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={changeVolume}
        className={styles.micBar}
      />
      <div className={styles.number}>{Math.round(volume * 100)}%</div>
    </div>
  );
}

export default MicControlBar;
