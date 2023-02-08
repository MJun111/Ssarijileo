import React, { useState, useRef, useEffect } from 'react';
import CommonState from '@/components/room/CommonState';

import styles from '@/styles/room/Screen.module.scss';

import Nomal from '@/components/room/Nomal';

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
  // 2 : 대기 상태
  // 3 : 진행 상태 (mode 별로 컴포넌트 분리)

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
        {
          lyricsId: 4,
          verse: '서늘한 냉기에 재채기할까 말까',
          time: 24,
        },
        {
          lyricsId: 5,
          verse: '눈 비비며 빼꼼히 창밖을 내다보니',
          time: 34,
        },
        {
          lyricsId: 6,
          verse: '삼삼오오 아이들은 재잘대며 학교 가고',
          time: 40,
        },
        {
          lyricsId: 7,
          verse: '산책 갔다 오시는 아버지의 양손에는',
          time: 46,
        },
        {
          lyricsId: 8,
          verse: '효과를 알 수 없는 약수가 하나 가득',
          time: 53,
        },
        {
          lyricsId: 9,
          verse: '딸각딸각 아침 짓는 어머니의 분주함과',
          time: 63,
        },
        {
          lyricsId: 10,
          verse: '엉금엉금 냉수 찾는 그 아들의 게으름이',
          time: 68,
        },
        {
          lyricsId: 11,
          verse: '상큼하고 깨끗한 아침의 향기와',
          time: 74,
        },
        {
          lyricsId: 12,
          verse: '구수하게 밥 뜸드는 냄새가 어우러진',
          time: 80,
        },
        {
          lyricsId: 13,
          verse: '가을 아침 내겐 정말 커다란 기쁨이야',
          time: 85,
        },
        {
          lyricsId: 14,
          verse: '가을 아침 내겐 정말 커다란 행복이야',
          time: 91,
        },
        {
          lyricsId: 15,
          verse: '응석만 부렸던 내겐',
          time: 96,
        },
        {
          lyricsId: 16,
          verse: '파란 하늘 바라보며 커다란 숨을 쉬니',
          time: 102,
        },
        {
          lyricsId: 17,
          verse: '드높은 하늘처럼 내 마음 편해지네',
          time: 108,
        },
        {
          lyricsId: 18,
          verse: '텅 빈 하늘 언제 왔나 고추잠자리 하나가',
          time: 113,
        },
        {
          lyricsId: 19,
          verse: '잠 덜 깬 듯 엉성히 돌기만 비잉비잉',
          time: 119,
        },
        {
          lyricsId: 20,
          verse: '토닥토닥 빨래하는 어머니의 분주함과',
          time: 136,
        },
        {
          lyricsId: 21,
          verse: '동기동기 기타 치는 그 아들의 한가함이',
          time: 141,
        },
        {
          lyricsId: 22,
          verse: '심심하면 쳐대는 괘종시계 종소리와',
          time: 146,
        },
        {
          lyricsId: 23,
          verse: '시끄러운 조카들의 울음소리 어우러진',
          time: 152,
        },
        {
          lyricsId: 24,
          verse: '가을 아침 내겐 정말 커다란 기쁨이야',
          time: 158,
        },
        {
          lyricsId: 25,
          verse: '가을 아침 내겐 정말 커다란 행복이야',
          time: 163,
        },
        {
          lyricsId: 26,
          verse: '응석만 부렸던 내겐',
          time: 169,
        },
        {
          lyricsId: 27,
          verse: '가을 아침 내겐 정말 커다란 기쁨이야',
          time: 175,
        },
        {
          lyricsId: 28,
          verse: '가을 아침 내겐 정말 커다란 행복이야',
          time: 180,
        },
        {
          lyricsId: 29,
          verse: '뜬구름 쫓았던 내겐',
          time: 186,
        },
        {
          lyricsId: 30,
          verse: '이른 아침 작은 새들 노랫소리 들려오면',
          time: 193,
        },
        {
          lyricsId: 31,
          verse: '언제나 그랬듯 아쉽게 잠을 깬다',
          time: 199,
        },
        {
          lyricsId: 32,
          verse: '창문 하나 햇살 가득 눈부시게 비쳐오고',
          time: 205,
        },
        {
          lyricsId: 33,
          verse: '서늘한 냉기에 재채기할까 말까',
          time: 211,
        },
      ],
    },
  ];

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
        <Nomal setState={setState} reserv={reserv[0]} />
      )}
      {state === 3 && myName !== mainName && (
        <video className={styles.video} autoPlay ref={videoRef}>
          <track kind="captions" />
        </video>
      )}
      {/* <video className={styles.video} autoPlay ref={videoRef}>
        <track kind="captions" />
      </video> */}
    </div>
  );
}

export default MainScreen;
