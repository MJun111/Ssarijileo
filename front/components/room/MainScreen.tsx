import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getCookie } from '@/util/cookie';

import CommonState from '@/components/room/CommonState';
import Nomal from '@/components/room/Nomal';
import styles from '@/styles/room/Screen.module.scss';
import { setSsari } from '@/redux/store/ssariSlice';

interface Reserv {
  nickname: string;
  songId: number;
  isPriority: string;
  title: string;
  singer: string;
}

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

export interface NextSong {
  sondId: number;
  title: string;
  singer: string;
  album: string;
  time: number;
  image: string;
  file: string;
  releaseDate: string;
  note: null;
  lyricsList: Lyrics[];
}

export function MainScreen(props: {
  singMode: any;
  subscribers: any[];
  screenOV: any;
  screenSession: any;
  publisher: any;
}) {
  const { singMode, subscribers, screenOV, screenSession, publisher } = props;
  const [screen, setScreen] = useState<any>(undefined);
  const [nextSong, setNextSong] = useState<NextSong>();
  const dispatch = useDispatch();

  // 내 닉네임 정보 받아오기 (redux)
  const [myName, setMyname] = useState('');
  const storeUser = useSelector((state: RootState) => state.user);
  useEffect(() => {
    setMyname(storeUser.nickname);
  }, [storeUser]);

  // 노래 예약 목록 받아오기 (redux)
  const [reservList, setReservList] = useState<Reserv[]>([]);
  const storeReserv = useSelector((state: RootState) => state.reserv);
  useEffect(() => {
    console.log('메인스크린에서 예약 변경 수신', storeReserv);
    setReservList([...storeReserv.reserv]);
  }, [storeReserv]);

  // 저장되어있는 상태값 불러오기 (redux)
  const [nowState, setNowState] = useState(0);
  const storeSsari = useSelector((state: RootState) => state.ssari);
  useEffect(() => {
    setNowState(storeSsari.ssari);
  }, [storeSsari]);

  // 노래방 상태관리

  // 공통
  // 0 : 인원이 1명일 때 (현재 인원수)
  // 1 : 예약목록이 비었을 때 (예약곡 수)
  // 2 : 대기 상태
  // 3 : 진행 상태 (mode 별로 컴포넌트 분리)

  // props로 받아야 할 데이터 ---> 참가자 수
  // 상태변경 (참가자 수에 따라)
  useEffect(() => {
    if (subscribers.length !== 0 && reservList.length === 0) {
      dispatch(setSsari(1));
    } else if (subscribers.length !== 0 && reservList.length !== 0) {
      dispatch(setSsari(2));
    } else if (subscribers.length === 0) {
      dispatch(setSsari(0));
    }
  }, [subscribers]);

  // 상태변경 (노래 예약 목록에 따라)
  useEffect(() => {
    if (nowState === 0 && reservList.length > 0) {
      dispatch(setSsari(2));
    } else if (nowState === 1 && reservList.length > 0) {
      dispatch(setSsari(2));
    }
  }, [reservList]);

  // 상태변경에 따른 행동 ()
  useEffect(() => {
    if (nowState === 1) {
      if (reservList.length > 0) {
        dispatch(setSsari(2));
      }
    } else if (nowState === 2) {
      if (reservList[0].nickname === myName) {
        axios({
          method: 'GET',
          url: `api/v1/song/detail/${reservList[0].songId}`,
          headers: {
            Authorization: `${getCookie('Authorization')}`,
            refreshToken: `${getCookie('refreshToken')}`,
          },
        }).then(res => {
          const response = res.data;
          const runtime = res.data.time.split(':');
          response.time = Number(runtime[1]) * 60 + Number(runtime[2]);
          setNextSong(response);
          console.log(response);
        });
      }
    }
  }, [nowState]);

  // 화면 공유
  const screenShare = (audioContext: any, mp3AudioDestination: any) => {
    publisher[0].publishAudio(false);
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
    // 다른 사람이 노래 부르기 시작하면 state를 4로
    screenSession.on('streamCreated', (event: any) => {
      if (event.stream.typeOfVideo === 'CUSTOM') {
        dispatch(setSsari(4));
        const subscreen = screenSession.subscribe(event.stream, undefined);
        // console.log('커스텀 이벤트', event);
        setScreen(subscreen);
      }
    });
  }, []);

  const title = [
    '참가자가 없습니다\n10분 뒤 노래방이 닫힙니다.',
    '예약목록이 없습니다\n10분 뒤 노래방이 닫힙니다.',
  ];

  return (
    <div className={styles.modeScreen}>
      {/* 공통 */}
      {nowState === 0 && <CommonState title={title[0]} />}
      {nowState === 1 && <CommonState title={title[1]} />}
      {/* 대기 상태 */}
      {nowState === 2 && <CommonState title={title[0]} />}
      {/* 일반 노래방 */}
      {/* 진행 상태 */}
      {nowState === 3 && singMode === 'nomal' && nextSong && (
        <Nomal nextSong={nextSong} screenShare={screenShare} screen={screen} />
      )}
      {nowState === 4 && nextSong && (
        <Nomal nextSong={nextSong} screenShare={screenShare} screen={screen} />
      )}
      {/* <video className={styles.video} autoPlay ref={videoRef}>
        <track kind="captions" />
      </video> */}
    </div>
  );
}

export default MainScreen;
