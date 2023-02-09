import React, { useState, useRef, useEffect } from 'react';

import CommonState from '@/components/room/CommonState';
import Nomal from '@/components/room/Nomal';

import styles from '@/styles/room/Screen.module.scss';

export interface Lyrics {
  lyricsId: number;
  verse: string;
  time: number;
}

export interface NormalSong {
  title: string;
  singer: string;
  src: string;
  time: number;
  lyricsList: Lyrics[];
}

export function MainScreen(props: {
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

  // 일반 노래방
  // 2 : 일반 노래방 대기상태
  // 3 : 일반 노래방 진행상태

  // 퍼펙트 스코어
  // 4 : 퍼펙트 스코어 대기 상태
  // 5 : 퍼펙트 스코어 진행 상태

  // 가사 맞추기
  // 6 : 가사 맞추기 대기 상태
  // 7 : 가사 맞추기 진행 상태
  const [state, setState] = useState(2);

  // props로 받아야 할 데이터 ---> 현재 노래부르는 사람 id, 예약 개수, 참가자 수
  const myName = 'syg9272';
  const mainName = 'syg9272';
  const reserv = [
    {
      title: '가을 아침',
      singer: '아이유',
      src: 'sounds/가을아침MR.mp3',
      time: 226,
      lyricsList: [
        {
          lyricsId: 1,
          verse: '이른 아침 작은 새들 노랫소리 들려오면',
          time: 6,
        },
        {
          lyricsId: 2,
          verse: '언제나 그랬듯 아쉽게 잠을 깬다',
          time: 12,
        },
        {
          lyricsId: 3,
          verse: '창문 하나 햇살 가득 눈부시게 비쳐오고',
          time: 18,
        },
      ],
    },
  ];

  useEffect(() => {
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
      {state === 0 && (
        <CommonState setState={setState} state={state} title={title[0]} />
      )}
      {state === 1 && (
        <CommonState setState={setState} state={state} title={title[1]} />
      )}
      {/* 일반 노래방 */}
      {/* 대기 상태 */}
      {state === 2 && (
        <CommonState setState={setState} state={state} title={title[0]} />
      )}
      {/* 진행 상태 */}
      {state === 3 && singMode === 'nomal' && myName === mainName && (
        <Nomal setState={setState} reserv={reserv[0]} />
      )}
      {state === 3 && myName !== mainName && (
        <video className={styles.video} autoPlay ref={videoRef}>
          <track kind="captions" />
        </video>
      )}
    </div>
  );
}

export default MainScreen;
