import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getCookie } from '@/util/cookie';

import CommonState from '@/components/room/CommonState';
import Nomal from '@/components/room/Nomal';
import styles from '@/styles/room/Screen.module.scss';
import { setSsari } from '@/redux/store/ssariSlice';
import { setReserv } from '@/redux/store/reservSlice';
import PerfectScore from './PerfectScore';
import OrderSong from './OrderSong';
import Guess from './Guess';

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
  songId: number;
  title: string;
  singer: string;
  album: string;
  time: number;
  image: string;
  file: string;
  releaseDate: string;
  note: string;
  lyricsList: Lyrics[];
}

export function MainScreen(props: {
  singMode: any;
  // subscribers: any[];
  screenOV: any;
  screenSession: any;
  publisher: any;
  session: any;
}) {
  // const { singMode, subscribers, screenOV, screenSession, publisher, session } = props;
  const { singMode, screenOV, screenSession, publisher, session } = props;
  const [screen, setScreen] = useState<any>(undefined);
  const [nextSong, setNextSong] = useState<NextSong>();
  const [screenPublisher, setScreenPublisher] = useState<any>();
  const [cycle, setCycle] = useState(1);
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
    setReservList([...storeReserv.reserv]);
    if (cycle === 1) {
      setCycle(2);
      dispatch(setSsari(0));
    }
  }, [storeReserv]);

  // 저장되어있는 상태값 불러오기 (redux)
  const [nowState, setNowState] = useState(0);
  const storeSsari = useSelector((state: RootState) => state.ssari);
  useEffect(() => {
    console.log('메인스크린 에서 상태변화 감지', storeSsari.ssari);
    setNowState(storeSsari.ssari);
  }, [storeSsari]);

  // 노래 끝나고 다음 상태 사이클 진행
  useEffect(() => {
    session.on('signal:nextCycleReserv', (event: any) => {
      const getReserveData = JSON.parse(event.data);
      console.log('부른노래가 제거된 예약목록', getReserveData);
      dispatch(setReserv([...getReserveData]));
    });
  }, []);

  const nextCycle = () => {
    const nextReserList = reservList.splice(1);
    session
      .signal({
        data: JSON.stringify(nextReserList), // Any string (optional)
        to: [], // Array of Connection objects (optional. Broadcast to everyone if empty)
        type: 'nextCycleReserv', // The type of message (optional)
      })
      .then(() => {
        console.log(`다음 사이클 노래 예약 정보 송신 성공`, nextReserList);
      })
      .catch((error: any) => {
        console.error('다음 사이클 노래 예약 정보 송신 실패', error);
      });
  };

  // 노래방 상태관리
  useEffect(() => {
    if (nowState === 0) {
      // if (subscribers.length !== 0) dispatch(setSsari(1));
      dispatch(setSsari(1));
    }
    if (nowState === 1) {
      if (reservList.length > 0) dispatch(setSsari(2));
    }
    if (nowState === 2) {
      setCycle(1);
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
        if (reservList[0].nickname === myName) {
          dispatch(setSsari(3));
        } else dispatch(setSsari(4));
      });
    }
    if (nowState === 7) {
      screenSession.unpublish(screenPublisher);
      nextCycle();
    }
  }, [nowState]);

  useEffect(() => {
    if (reservList.length === 1 && nowState === 1) {
      dispatch(setSsari(2));
    }
  }, [reservList]);

  // 다른 사람이 노래 부르기 시작하면 state를 6으로
  screenSession.on('streamCreated', (event: any) => {
    if (event.stream.typeOfVideo === 'CUSTOM') {
      const subScreen = screenSession.subscribe(event.stream, undefined);
      if (reservList.length) {
        if (reservList[0].nickname !== myName) {
          dispatch(setSsari(6));
        }
      }
      setScreen(subScreen);
    }
  });

  // 화면 위치 바꾸기
  const nextSinger = () => {
    session
      .signal({
        data: '', // Any string (optional)
        to: [], // Array of Connection objects (optional. Broadcast to everyone if empty)
        type: 'nextSinger', // The type of message (optional)
      })
      .then(() => {
        console.log(`다음은 내차례`, myName);
      })
      .catch((error: any) => {
        console.error('nextSinger 에러', error);
      });
  };

  let userMicStream: MediaStream | null = null;
  // 화면 공유
  const screenShare = (
    audioContext: AudioContext,
    mp3AudioDestination: MediaStreamAudioDestinationNode,
  ) => {
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
        userMicStream = await navigator.mediaDevices.getUserMedia({
          video: true,
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
        nextSinger();
        setScreenPublisher(newScreenPublisher);
        screenSession.publish(newScreenPublisher);
      });
  };

  let videoRecorder: MediaRecorder | null = null;
  let videoBlob: Blob | null = null;

  const sendRecording = () => {
    if (!videoRecorder || !videoBlob) return;
    const formData = new FormData();
    const fileName = new Date().toISOString();
    const file = new File([videoBlob], fileName, {
      type: 'video/mp4',
    });
    console.log(file);
    formData.append('file', file);
    axios
      .post(
        'api/v1/recording',
        {
          data: {
            songId: reservList[0].songId,
            formData,
          },
        },
        {
          headers: {
            Authorization: getCookie('token'),
          },
        },
      )
      .then(res => {
        console.log(res);
      });
  };

  const recordStart = () => {
    dispatch(setSsari(5));
    if (!userMicStream) return;
    const videoData: Blob[] = [];
    videoRecorder = new MediaRecorder(userMicStream, {
      mimeType: 'video/mp4; codecs="avc1.424028, mp4a.40.2"',
    });
    videoRecorder.ondataavailable = (event: any) => {
      if (event.data.size > 0) {
        videoData.push(event.data);
      }
    };
    videoRecorder.onstop = () => {
      videoBlob = new Blob(videoData, { type: 'video/webm' });
      // 이벤트 실행 시에 서버로 파일 POST
      sendRecording();
    };
    videoRecorder.start();
  };

  const recordStop = () => {
    dispatch(setSsari(7));
    if (!videoRecorder) return;
    videoRecorder.stop();
    videoRecorder = null;
  };

  // 다른사람 노래부르는 화면 송출 끝날때
  screenSession.on('streamDestroyed', () => {
    setScreen(undefined);
  });

  const title = [
    '참가자가 없습니다\n10분 뒤 노래방이 닫힙니다.',
    '예약목록이 없습니다\n10분 뒤 노래방이 닫힙니다.',
    '노래를 불러오는 중입니다\n',
    '다른 사람이 부를 차례입니다.\n',
    '로딩중\n',
  ];

  // perfect
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (singMode === 'P' && screen !== undefined && videoRef.current) {
      screen.addVideoElement(videoRef.current);
    }
  }, [screen]);

  return (
    <div className={styles.modeScreen}>
      {/* 공통 */}
      {nowState === 0 && (
        <CommonState title={title[0]} recordStart={recordStart} />
      )}
      {nowState === 1 && (
        <CommonState title={title[1]} recordStart={recordStart} />
      )}
      {nowState === 2 && (
        <CommonState title={title[2]} recordStart={recordStart} />
      )}
      {/* 대기 상태 */}
      {nowState === 3 && (
        <CommonState title={title[0]} recordStart={recordStart} />
      )}
      {nowState === 4 && (
        <CommonState title={title[3]} recordStart={recordStart} />
      )}
      {/* 일반 노래방 */}
      {/* 진행 상태 */}
      {[5, 6].includes(nowState) && singMode === 'N' && nextSong && (
        <Nomal
          nextSong={nextSong}
          screenShare={screenShare}
          screen={screen}
          propState={nowState}
          recordStop={recordStop}
        />
      )}
      {nowState === 5 && singMode === 'P' && nextSong && (
        <PerfectScore screenShare={screenShare} nextSong={nextSong} />
      )}
      {nowState === 6 && singMode === 'P' && (
        <video className={styles.video} autoPlay ref={videoRef}>
          <track kind="captions" />
        </video>
      )}
      {nowState === 5 && singMode === 'O' && (
        <OrderSong screenShare={screenShare} nextSong={nextSong} />
      )}
      {nowState === 6 && singMode === 'O' && (
        <Guess session={session} nextSong={nextSong} />
      )}
    </div>
  );
}

export default MainScreen;
