import React, { useState, useRef, useEffect } from 'react';

import CommonState from '@/components/room/CommonState';

import styles from '@/styles/room/Screen.module.scss';

function MainScreen(props: {
  streamManager: any;
  singMode: any;
  subscribers: any[];
}) {
  const { streamManager, singMode, subscribers } = props;
  const videoRef = useRef<HTMLVideoElement>(null);
  const screen = streamManager;

  // 노래방 상태관리

  // 공통
  // 0 : 인원이 1명일 때 (현재 인원수)
  // 1 : 예약목록이 비었을 때 (예약곡 수)
  // const [reserv, setReserv] = useState(1);

  // 일반 노래방
  // 2 : 일반 노래방 대기상태
  // const [nomXalWait, setNomalWait] = useState(2);
  // 3 : 일반 노래방 진행상태
  // const [nomXalWRunning, setNomalRunning] = useState(3);

  // 퍼펙트 스코어
  // 4 : 퍼펙트 스코어 대기 상태
  // const [perfectWait, setPerfectWait] = useState(4);
  // 5 : 퍼펙트 스코어 진행 상태
  // const [perfectRunning, setPerfectRunning] = useState(5);

  // 가사 맞추기
  // 6 : 가사 맞추기 대기 상태
  // const [guessWait, setGuessWait] = useState(6);
  // 7 : 가사 맞추기 진행 상태
  // const [guessRunning, setGuessRunning] = useState(7);
  const [state, setState] = useState(0);

  // props로 받아야 할 데이터 ---> 현재 노래부르는 사람 id, 예약 개수, 참가자 수
  const myName = 'syg9272';
  const mainName = 'syg9272';
  const reserv = [];

  useEffect(() => {
    console.log(subscribers);
    if (subscribers.length !== 0 && reserv.length === 0) {
      setState(1);
    } else if (subscribers.length !== 0 && reserv.length !== 0) {
      if (singMode === 'nomal') {
        setState(2);
      } else if (singMode === 'perfect') {
        setState(4);
      } else if (singMode === 'guess') {
        setState(6);
      }
    }
  }, [subscribers]);

  const title = [
    '참가자가 없습니다\n10분 뒤 노래방이 닫힙니다.',
    '예약목록이 없습니다\n10분 뒤 노래방이 닫힙니다.',
  ];

  useEffect(() => {
    if (screen && !!videoRef) {
      screen.addVideoElement(videoRef.current);
    }
  }, [screen]);

  return (
    <div className={styles.modeScreen}>
      {/* 공통 */}
      {state === 0 && <CommonState title={title[0]} />}
      {state === 1 && <CommonState title={title[1]} />}
      {/* 일반 노래방 */}
      {myName !== mainName && (
        <video className={styles.video} autoPlay ref={videoRef}>
          <track kind="captions" />
        </video>
      )}
    </div>
  );
}

export default MainScreen;
