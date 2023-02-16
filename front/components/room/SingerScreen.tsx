import React, { useRef, useEffect } from 'react';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import styles from '@/styles/room/Screen.module.scss';
import { RootState } from '@/redux/store';
import { setBtn } from '@/redux/store/btnSlice';

function SingerScreen(props: { streamManager: any; session: any }) {
  const { streamManager, session } = props;
  const videoRef = useRef<HTMLVideoElement>(null);
  const screen = streamManager;
  const storeBtn = useSelector((state: RootState) => state.btn);
  const dispatch = useDispatch();

  let screenClass = classnames({
    [styles.singerScreen]: true,
    [styles.ok]: storeBtn.btn === 'ok',
    [styles.no]: storeBtn.btn === 'no',
  });
  useEffect(() => {
    screenClass = classnames({
      [styles.singerScreen]: true,
      [styles.ok]: storeBtn.btn === 'ok',
      [styles.no]: storeBtn.btn === 'no',
    });
  }, [storeBtn]);

  useEffect(() => {
    if (screen && !!videoRef.current) {
      screen.addVideoElement(videoRef.current);
    }
  }, [screen]);

  useEffect(() => {
    session.on('signal:btn', (event: any) => {
      const btnType = event.data;
      dispatch(setBtn(btnType));
      setTimeout(() => {
        dispatch(setBtn(''));
      }, 2000);
    });
  }, []);

  return (
    <div className={screenClass}>
      <video className={styles.video} autoPlay ref={videoRef}>
        <track kind="captions" />
      </video>
    </div>
  );
}

export default SingerScreen;
