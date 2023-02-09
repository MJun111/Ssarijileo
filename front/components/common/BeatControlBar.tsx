import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import styles from '@/styles/common/ControlBar.module.scss';
import { setBeat } from '@/redux/store/beatSlice';

function BeatControlBar() {
  const [beat, setState] = useState(0.5);
  const storeBeat = useSelector((state: RootState) => state.beat);
  const dispatch = useDispatch();

  useEffect(() => {
    setState(storeBeat.beat);
  }, [storeBeat]);

  const changeBeat = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(Number(e.target.value));
    dispatch(setBeat(Number(e.target.value)));
    e.target.style.background = `
      linear-gradient(to right, #FFE283 0%, #FFE283 ${Math.round(
        beat * 100,
      )}%, rgb(236, 236, 236) ${Math.round(
      beat * 100,
    )}%, rgb(236, 236, 236) 100%)
    `;
  };
  return (
    <div id="controls" className={styles.controls}>
      <input
        id="micVolume"
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={beat}
        onChange={changeBeat}
        className={styles.micBar}
      />
      <div className={styles.number}>{Math.round(beat * 100)}%</div>
    </div>
  );
}

export default BeatControlBar;
