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
  singMode: any;
  subscribers: any[];
  screenOV: any;
  screenSession: any;
}) {
  const { singMode, subscribers, screenOV, screenSession } = props;
  const [screen, setScreen] = useState<any>(undefined);

  // 노래방 상태관리

  // 공통
  // 0 : 인원이 1명일 때 (현재 인원수)
  // 1 : 예약목록이 비었을 때 (예약곡 수)
  // 2 : 대기 상태
  // 3 : 진행 상태 (mode 별로 컴포넌트 분리)

  const [state, setState] = useState(2);

  // props로 받아야 할 데이터 ---> 현재 노래부르는 사람 id, 예약 개수, 참가자 수
  const myName = 'syg9272';
  const mainName = 'syg9272';
  const reserv = [
    {
      title: '아무노래',
      singer: '지코',
      src: 'sounds/아무노래MR.mp3',
      time: 227,
      lyricsList: [
        { lyricsId: 2, verse: '왜들 그리 다운돼있어', time: 8.61 },
        { lyricsId: 2, verse: '뭐가 문제야 say something', time: 11.19 },
        { lyricsId: 2, verse: '분위기가 겁나 싸해', time: 13.28 },
        { lyricsId: 2, verse: '요새는 이런 게 유행인가', time: 15.52 },
        { lyricsId: 2, verse: '왜들 그리 재미없어', time: 18.05 },
        { lyricsId: 2, verse: '아 그건 나도 마찬가지', time: 19.96 },
        { lyricsId: 2, verse: 'Tell me what I got to do', time: 22.28 },
        { lyricsId: 2, verse: '급한 대로 블루투스 켜', time: 24.36 },
        { lyricsId: 2, verse: '아무 노래나 일단 틀어', time: 26.69 },
        { lyricsId: 2, verse: '아무거나 신나는 걸로', time: 28.68 },
        { lyricsId: 2, verse: '아무렇게나 춤춰', time: 31.14 },
        { lyricsId: 2, verse: '아무렇지 않아 보이게', time: 33.18 },
        { lyricsId: 2, verse: '아무 생각 하기 싫어', time: 35.71 },
        { lyricsId: 2, verse: '아무개로 살래 잠시', time: 37.35 },
        {
          lyricsId: 2,
          verse: 'I’m sick and tired of my everyday',
          time: 39.98,
        },
        { lyricsId: 2, verse: 'Keep it up 한 곡 더', time: 43.23 },
        { lyricsId: 2, verse: '아무 노래나 일단 틀어', time: 44.7 },
        { lyricsId: 2, verse: '아무렴 어때 It’s so boring', time: 46.99 },
        { lyricsId: 2, verse: '아무래도 refresh가 시급한 듯해', time: 49.2 },
        { lyricsId: 2, verse: '쌓여가 스트레스가', time: 51.62 },
        { lyricsId: 2, verse: '배꼽 빠질 만큼만', time: 52.99 },
        { lyricsId: 2, verse: '폭소하고 싶은 날이야', time: 55.1 },
        { lyricsId: 2, verse: 'What up my dawgs 어디야 너희', time: 57.34 },
        { lyricsId: 2, verse: '올 때 병맥주랑', time: 59.55 },
        { lyricsId: 2, verse: '까까 몇 개 사 와 huh', time: 61.19 },
        { lyricsId: 2, verse: '클럽은 구미가 잘 안 당겨', time: 62.9 },
        { lyricsId: 2, verse: '우리 집 거실로 빨랑 모여', time: 65.16 },
        { lyricsId: 2, verse: '외부인은 요령껏 차단 시켜', time: 67.34 },
        { lyricsId: 2, verse: '밤새 수다 떨 시간도 모자라', time: 69.43 },
        { lyricsId: 2, verse: '누군 힘들어 죽겠고 누군 축제', time: 71.16 },
        {
          lyricsId: 2,
          verse: '괜히 싱숭생숭 I want my youth back',
          time: 73.6,
        },
        { lyricsId: 2, verse: '좀 전까지 왁자지껄', time: 76.14 },
        { lyricsId: 2, verse: '하다 한 명 두 명씩 자릴 떠', time: 77.79 },
        { lyricsId: 2, verse: '왜들 그리 다운돼있어', time: 80.25 },
        { lyricsId: 2, verse: '뭐가 문제야 say something', time: 82.29 },
        { lyricsId: 2, verse: '분위기가 겁나 싸해', time: 84.52 },
        { lyricsId: 2, verse: '요새는 이런 게 유행인가', time: 86.76 },
        { lyricsId: 2, verse: '왜들 그리 재미없어', time: 89.07 },
        { lyricsId: 2, verse: '아 그건 나도 마찬가지', time: 91.15 },
        { lyricsId: 2, verse: 'Tell me what I got to do', time: 93.69 },
        { lyricsId: 2, verse: '급한 대로 블루투스 켜', time: 95.65 },
        { lyricsId: 2, verse: '아무 노래나 일단 틀어', time: 98.47 },
        { lyricsId: 2, verse: '아무거나 신나는 걸로', time: 100.27 },
        { lyricsId: 2, verse: '아무렇게나 춤춰', time: 102.46 },
        { lyricsId: 2, verse: '아무렇지 않아 보이게', time: 104.32 },
        { lyricsId: 2, verse: '아무 생각 하기 싫어', time: 106.94 },
        { lyricsId: 2, verse: '아무개로 살래 잠시', time: 109.3 },
        {
          lyricsId: 2,
          verse: 'I’m sick and tired of my everyday',
          time: 111.16,
        },
        { lyricsId: 2, verse: 'Keep it up 한 곡 더', time: 114.73 },
        { lyricsId: 2, verse: '떠나질 못할 바엔', time: 116.01 },
        { lyricsId: 2, verse: '창밖은 쳐다도 안 봐', time: 120.69 },
        { lyricsId: 2, verse: '회까닥해서 추태를 부려도', time: 124.74 },
        { lyricsId: 2, verse: 'No worries at all', time: 129.02 },
        { lyricsId: 2, verse: '이미지 왜 챙겨', time: 131.27 },
        { lyricsId: 2, verse: '그래 봤자 우리끼린데', time: 132.45 },
        { lyricsId: 2, verse: 'Ohh 늦기 전에 막판 스퍼트', time: 134.06 },
        { lyricsId: 2, verse: '20대가 얼마 안 남았어', time: 136.67 },
        { lyricsId: 2, verse: '편한 옷으로 갈아입어', time: 138.69 },
        { lyricsId: 2, verse: 'You look nice get’em high', time: 140.34 },
        { lyricsId: 2, verse: '얼핏 보면 그냥 코미디', time: 141.78 },
        { lyricsId: 2, verse: '이렇게 무해한 파티 처음이지', time: 143.41 },
        { lyricsId: 2, verse: '만감이 교차하는 새벽 2시경', time: 145.77 },
        { lyricsId: 2, verse: '술잔과 감정이 소용돌이쳐', time: 148.51 },
        { lyricsId: 2, verse: '왜들 그리 다운돼있어', time: 151.04 },
        { lyricsId: 2, verse: '뭐가 문제야 say something', time: 153.38 },
        { lyricsId: 2, verse: '분위기가 겁나 싸해', time: 155.59 },
        { lyricsId: 2, verse: '요새는 이런 게 유행인가', time: 157.7 },
        { lyricsId: 2, verse: '왜들 그리 재미없어', time: 160.09 },
        { lyricsId: 2, verse: '아 그건 나도 마찬가지', time: 162.02 },
        { lyricsId: 2, verse: 'Tell me what I got to do', time: 164.86 },
        { lyricsId: 2, verse: '급한 대로 블루투스 켜', time: 166.53 },
        { lyricsId: 2, verse: '아무 노래나 일단 틀어', time: 169.14 },
        { lyricsId: 2, verse: '아무거나 신나는 걸로', time: 171.37 },
        { lyricsId: 2, verse: '아무렇게나 춤춰', time: 173.6 },
        { lyricsId: 2, verse: '아무렇지 않아 보이게', time: 175.97 },
        { lyricsId: 2, verse: '아무 생각 하기 싫어', time: 177.83 },
        { lyricsId: 2, verse: '아무개로 살래 잠시', time: 180.26 },
        {
          lyricsId: 2,
          verse: 'I’m sick and tired of my everyday',
          time: 182.42,
        },
        { lyricsId: 2, verse: 'Keep it up 한 곡 더', time: 185.26 },
        { lyricsId: 2, verse: '아무 노래나 일단', time: 187.02 },
        { lyricsId: 2, verse: '아무 노래 아무 노래', time: 205.92 },
        { lyricsId: 2, verse: '아무 노래나 틀어봐', time: 209 },
        { lyricsId: 2, verse: '아무 노래 아무 노래', time: 211.31 },
        { lyricsId: 2, verse: '아무 노래나 틀어봐', time: 213.62 },
        { lyricsId: 2, verse: '아무 노래 아무 노래', time: 216.19 },
        { lyricsId: 2, verse: '아무 노래나 틀어봐', time: 218.22 },
        { lyricsId: 2, verse: '아무 노래 아무 노래', time: 220.28 },
        { lyricsId: 2, verse: '아무 노래나 KOZ', time: 222.39 },
        { lyricsId: 2, verse: '', time: 227.22 },
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

  //
  const screenShare = (audioContext: any, mp3AudioDestination: any) => {
    screenOV
      .getUserMedia({
        audioSource: undefined,
        videoSource: undefined,
        resolution: '910x174',
        frameRate: 30,
      })
      .then(async () => {
        // audioSource
        const userMicStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const userContext = audioContext.createMediaStreamSource(userMicStream);
        userContext.connect(mp3AudioDestination);
        const testAudioTrack = mp3AudioDestination.stream.getAudioTracks()[0];

        // videoSource
        const canvas = document.getElementById(
          'screen-screen',
        ) as HTMLCanvasElement | null;

        const testVideoTrack = canvas?.captureStream(30).getVideoTracks()[0];
        const newScreenPublisher = screenOV.initPublisher(undefined, {
          audioSource: testAudioTrack,
          videoSource: testVideoTrack,
        });

        screenSession.publish(newScreenPublisher);
      });
  };

  useEffect(() => {
    screenSession.on('streamCreated', (event: any) => {
      if (event.stream.typeOfVideo === 'CUSTOM') {
        setState(4);
        const subscreen = screenSession.subscribe(event.stream, undefined);
        // console.log('커스텀 이벤트', event);
        setScreen(subscreen);
      }
    });
  }, []);

  return (
    <div className={styles.modeScreen}>
      {/* 공통 */}
      {state === 0 && (
        <CommonState setState={setState} state={state} title={title[0]} />
      )}
      {state === 1 && (
        <CommonState setState={setState} state={state} title={title[1]} />
      )}
      {/* 대기 상태 */}
      {state === 2 && (
        <CommonState setState={setState} state={state} title={title[0]} />
      )}
      {/* 일반 노래방 */}
      {/* 진행 상태 */}
      {state === 3 && singMode === 'nomal' && myName === mainName && (
        <Nomal
          setState={setState}
          reserv={reserv[0]}
          screenShare={screenShare}
          state={state}
          screen={screen}
        />
      )}
      {/* {state === 3 && myName !== mainName && (
        <video className={styles.video} autoPlay ref={videoRef}>
          <track kind="captions" />
        </video>
      )} */}
      {state === 4 && (
        <Nomal
          setState={setState}
          reserv={reserv[0]}
          screenShare={screenShare}
          state={state}
          screen={screen}
        />
      )}
      {/* <video className={styles.video} autoPlay ref={videoRef}>
        <track kind="captions" />
      </video> */}
    </div>
  );
}

export default MainScreen;
