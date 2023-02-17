import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getCookie } from '@/util/cookie';
import { setSsari } from '@/redux/store/ssariSlice';
import { setReserv } from '@/redux/store/reservSlice';

import CommonState from '@/components/room/CommonState';
import Nomal from '@/components/room/Nomal';
import PerfectScore from './PerfectScore';
import OrderSong from './OrderSong';
import Guess from './Guess';

import styles from '@/styles/room/Screen.module.scss';

export interface Lyrics {
  lyricsId: number;
  verse: string;
  time: number;
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
  // publisher: any;
  session: any;
}) {
  const { singMode, screenOV, screenSession, session } = props;
  const [screen, setScreen] = useState<any>(undefined);
  const [nextSong, setNextSong] = useState<NextSong>();
  const [screenPublisher, setScreenPublisher] = useState<any>();
  const [isRecord, setIsRecord] = useState(false);
  const dispatch = useDispatch();

  // 내 닉네임 정보 받아오기 (redux)
  const storeUser = useSelector((state: RootState) => state.user);
  const myName = storeUser.nickname;

  // 노래 예약 목록 받아오기 (redux)
  const storeReserv = useSelector((state: RootState) => state.reserv);
  const reservList = storeReserv.reserv;

  // 저장되어있는 상태값 불러오기 (redux)
  const storeSsari = useSelector((state: RootState) => state.ssari);
  const nowState = storeSsari.ssari;

  // 노래 끝나고 다음 상태 사이클 진행
  useEffect(() => {
    session.on('signal:nextCycleReserv', (event: any) => {
      const getReserveData = JSON.parse(event.data);
      console.log('부른노래가 제거된 예약목록', getReserveData);
      console.log('다음 사이클 진행, 0, 메인스크린');
      dispatch(setReserv([...getReserveData]));
      dispatch(setSsari(0));
    });
  }, []);

  const nextCycle = () => {
    // console.log('현재 인원 : ', session.connections.numberOfElements);
    const nextReserList = [...reservList];
    nextReserList.shift();
    session.signal({
      data: JSON.stringify(nextReserList), // Any string (optional)
      to: [], // Array of Connection objects (optional. Broadcast to everyone if empty)
      type: 'nextCycleReserv', // The type of message (optional)
    });
    console.log('다음 사이클 진행, 0, 메인스크린');
  };

  // 노래방 상태관리
  useEffect(() => {
    console.log('현재 상태값', nowState);
    if (nowState === 0) {
      // if (subscribers.length !== 0) dispatch(setSsari(1));
      console.log('이거 터지면 버그, 1, 메인스크린');
      dispatch(setSsari(1));
    }
    if (nowState === 1) {
      if (reservList.length > 0) {
        console.log('예약목록 있음, 2, 메인스크린');
        dispatch(setSsari(2));
      }
    }
    if (nowState === 2) {
      axios({
        method: 'GET',
        url: `api/v1/song/detail/${reservList[0].songId}`,
        headers: {
          Authorization: getCookie('Authorization'),
          refreshToken: getCookie('refreshToken'),
        },
      }).then(res => {
        const response = res.data;
        const runtime = res.data.time.split(':');
        response.time = Number(runtime[1]) * 60 + Number(runtime[2]);
        setNextSong(response);
        if (reservList[0].nickname === myName) {
          console.log('내차례, 3, 메인스크린');
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
      console.log('예약목록 1개 있음, 2, 메인스크린');
      dispatch(setSsari(2));
    }
  }, [reservList]);

  // 다른 사람이 노래 부르기 시작하면 state를 6으로
  screenSession.on('streamCreated', (event: any) => {
    if (event.stream.typeOfVideo === 'CUSTOM') {
      const subScreen = screenSession.subscribe(event.stream, undefined);
      if (reservList.length) {
        if (reservList[0].nickname !== myName) {
          console.log('다른사람이 노래 부르기 시작, 6, 메인스크린');
          dispatch(setSsari(6));
        }
      }
      setScreen(subScreen);
    }
  });

  // 화면 위치 바꾸기
  const nextSinger = () => {
    session.signal({
      data: '', // Any string (optional)
      to: [], // Array of Connection objects (optional. Broadcast to everyone if empty)
      type: 'nextSinger', // The type of message (optional)
    });
  };

  const videoRecorderRef = useRef<MediaRecorder>();

  // const mergeAudioStreams = (
  //   musicStream: MediaStream,
  //   voiceStream: MediaStream,
  // ) => {
  //   // 비디오, 오디오스트림 연결
  //   const context = new AudioContext();
  //   const destination = context.createMediaStreamDestination();
  //   let hasDesktop = false;
  //   let hasVoice = false;
  //   if (musicStream && musicStream.getAudioTracks().length > 0) {
  //     const source1 = context.createMediaStreamSource(musicStream);
  //     const desktopGain = context.createGain();
  //     desktopGain.gain.value = 0.5;
  //     source1.connect(desktopGain).connect(destination);
  //     hasDesktop = true;
  //   }
  //
  //   if (voiceStream && voiceStream.getAudioTracks().length > 0) {
  //     const source2 = context.createMediaStreamSource(voiceStream);
  //     const voiceGain = context.createGain();
  //     voiceGain.gain.value = 1.0;
  //     source2.connect(voiceGain).connect(destination);
  //     hasVoice = true;
  //   }
  //
  //   return hasDesktop || hasVoice ? destination.stream.getAudioTracks() : [];
  // };

  // 화면 공유
  const screenShare = (
    audioContext: AudioContext,
    mp3AudioDestination: MediaStreamAudioDestinationNode,
  ) => {
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
          video: true,
          audio: true,
        });

        const userContext = audioContext.createMediaStreamSource(userMicStream);
        userContext.connect(mp3AudioDestination);

        const tracks = [
          ...userMicStream.getVideoTracks(),
          ...mp3AudioDestination.stream.getAudioTracks(),
        ];
        const screenStream = new MediaStream(tracks);
        const testAudioTrack = screenStream.getAudioTracks()[0];
        console.log(isRecord);
        if (isRecord) {
          const videoRecorder = new MediaRecorder(screenStream, {
            mimeType: 'video/webm',
          });
          videoRecorderRef.current = videoRecorder;
          const blobs: any = [];
          videoRecorder.ondataavailable = event => {
            blobs.push(event.data);
          };
          videoRecorder.onstop = async () => {
            const blob = new Blob(blobs, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            console.log('녹화파일', url);
            const formData = new FormData();
            const fileName = new Date().toISOString();
            const file = new File([blob], fileName, {
              type: 'video/webm',
            });
            formData.append('file', file);
            formData.append(
              'recordingDto',
              new Blob([JSON.stringify({ songId: reservList[0].songId })], {
                type: 'application/json',
              }),
            );
            const res = await axios.post('api/v1/recording', formData, {
              headers: {
                Authorization: getCookie('Authorization'),
                refreshToken: getCookie('refreshToken'),
                'Content-Type': 'multipart/form-data',
              },
            });
            console.log('녹화파일 저장', res);
          };
          videoRecorder.start();
        }

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

  const stopRecord = () => {
    videoRecorderRef.current?.stop();
    setIsRecord(false);
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
        <CommonState title={title[0]} setIsRecord={setIsRecord} />
      )}
      {nowState === 1 && (
        <CommonState title={title[1]} setIsRecord={setIsRecord} />
      )}
      {nowState === 2 && (
        <CommonState title={title[2]} setIsRecord={setIsRecord} />
      )}
      {/* 대기 상태 */}
      {nowState === 3 && (
        <CommonState title={title[0]} setIsRecord={setIsRecord} />
      )}
      {nowState === 4 && (
        <CommonState title={title[3]} setIsRecord={setIsRecord} />
      )}
      {/* 일반 노래방 */}
      {/* 진행 상태 */}
      {[5, 6].includes(nowState) && singMode === 'N' && nextSong && (
        <Nomal
          nextSong={nextSong}
          screenShare={screenShare}
          screen={screen}
          recordStop={stopRecord}
        />
      )}
      {nowState === 5 && singMode === 'P' && nextSong && (
        <PerfectScore screenShare={screenShare} nextSong={nextSong} />
      )}
      {nowState === 6 && singMode === 'P' && (
        <video className={styles.perfect} autoPlay ref={videoRef}>
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
