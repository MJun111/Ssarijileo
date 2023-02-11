// Path: '/room'
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { OpenVidu } from 'openvidu-browser';
import { RootState } from '@/redux/store';

import RoomHeader from '@/components/room/RoomHeader';
import MainScreen from '@/components/room/MainScreen';
import MyScreen from '@/components/room/MyScreen';
import RoomFooter from '@/components/room/RoomFooter';

// import PerfectScore from '@/components/room/PerfectScore';
import Loading from '@/components/room/Loading';
// import RoomController from '@/components/room/RoomController';

import styles from '@/styles/Room.module.scss';

const APPLICATION_SERVER_URL = 'http://localhost:5000/';

interface Reserv {
  nickname: string;
  songId: number;
  isPriority: string;
  title: string;
  singer: string;
}

function Index() {
  // username
  const [myUserName, setMyUserName] = useState('');
  const storeUser = useSelector((state: RootState) => state.user);
  useEffect(() => {
    setMyUserName(storeUser.nickname);
  }, [storeUser]);

  // session Info
  const mySessionId = '123';
  const [OV, setOV] = useState<any>(undefined);
  const [screenOV, setScreenOV] = useState<any>(undefined);
  const [session, setSession] = useState<any>(undefined);
  const [screenSession, setScreenSession] = useState<any>(undefined);

  // 화면
  const [publisher, setPublisher] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [screenPublisher, setScreenPublisher] = useState<any>();
  const [singer, setSinger] = useState<any[]>([]);

  // 초기 상태값
  const [loading, setLoading] = useState(true);
  const [init, setInit] = useState(false);

  // 화면공유 상태값
  const [share, setShare] = useState(false);
  // const [testOnOff, setTest] = useState(false);

  // 테마모드
  const storeTheme = useSelector((state: RootState) => state.theme);
  useEffect(() => {
    document.body.dataset.theme = storeTheme.theme || 'light';
  }, [storeTheme]);

  // api
  async function createSession(sessionId: string | string[] | undefined) {
    const response = await axios.post(
      `${APPLICATION_SERVER_URL}api/sessions`,
      { customSessionId: sessionId },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    return response.data; // The sessionId
  }

  async function createToken(sessionId: string) {
    const response = await axios.post(
      `${APPLICATION_SERVER_URL}api/sessions/${sessionId}/connections`,
      {
        kurentoOptions: {
          allowedFilters: ['GStreamerFilter'],
        },
      },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    return response.data; // The token
  }

  async function getToken() {
    const sessionId = await createSession(mySessionId);
    const token = await createToken(sessionId);
    return token;
  }

  // OV, session 생성
  const joinsession = () => {
    const newOV = new OpenVidu();
    setOV(newOV);
    setSession(newOV.initSession());

    const newScreenOV = new OpenVidu();
    setScreenOV(newScreenOV);
    setScreenSession(newScreenOV.initSession());

    setInit(true);
  };

  // const testOn = () => {
  //   setTest(!testOnOff);
  // };

  // 오디오 스트림 filterss
  // const [delay, setDelay] = useState(50000000);
  // const [intensity, setIntensity] = useState(0.6);
  // const [feedback, setFeedback] = useState(0.4);
  // const [amplify, setAmplify] = useState(1.5);
  // `audioamplify amplification=${amplify} clipping-method=wrap-positive`

  // const delay = 50000000;
  // const intensity = 0.6;
  // const feedback = 0.4;

  // const audioFilter = () => [
  //   publisher.stream
  //     .applyFilter('GStreamerFilter', {
  //       command: `audioecho delay=${delay} intensity=${intensity} feedback=${feedback}`,
  //     })
  //     .then(() => {
  //       console.log('Filter activate');
  //     })
  //     .catch((error: any) => {
  //       console.error(error);
  //     }),
  // ];

  // const audioFilterOff = () => {
  //   publisher.stream
  //     .removeFilter()
  //     .then(() => {
  //       console.log('Filter removed');
  //     })
  //     .catch((error: any) => {
  //       console.error(error);
  //     });
  // };

  // 다음 singer로 화면 전환
  // 임시 예약 리스트
  const [reservationList, setReservationList] = useState<Reserv[]>([]);
  const storeReservList = useSelector((state: RootState) => state.reserv);
  useEffect(() => {
    setReservationList(storeReservList.reserv);
  }, [storeReservList]);
  // const reservationList = [
  //   {
  //     user: 'samplename',
  //     title: '가을 아침',
  //     singer: '아이유',
  //     src: 'sounds/가을아침MR.mp3',
  //     time: 226,
  //     lyricsList: [],
  //   },
  // ];

  const nextSinger = () => {
    if (reservationList[0].nickname === myUserName) {
      session
        .signal({
          data: '', // Any string (optional)
          to: [], // Array of Connection objects (optional. Broadcast to everyone if empty)
          type: 'nextSinger', // The type of message (optional)
        })
        .then(() => {
          console.log(`"${myUserName}"가 싱어, 시그널 성공`);
        })
        .catch((error: any) => {
          console.error('다음 싱어 시그널 에러', error);
        });
    }
  };

  // 예약정보 공유 JSON.stringify(reservationList)
  const shareReservationList = () => {
    session
      .signal({
        data: JSON.stringify(reservationList), // Any string (optional)
        to: [], // Array of Connection objects (optional. Broadcast to everyone if empty)
        type: 'reservationList', // The type of message (optional)
      })
      .then(() => {
        console.log(`노래 예약 정보 송신 성공`);
      })
      .catch((error: any) => {
        console.error('노래 예약 정보 송신 실패', error);
      });
  };

  // singer 화면 위치 바꾸기
  const changeSinger = (from: any) => {
    const nextsinger = from.stream.streamManager;
    if (singer[0] === nextsinger) {
      console.log('똑같은 사람이 부름');
    } else if (nextsinger === publisher[0]) {
      if (singer[0] !== undefined) {
        subscribers.push(singer.pop());
        setSubscribers([...subscribers]);
      }
      singer.push(nextsinger);
      publisher.pop();
      setSinger([...singer]);
      setPublisher([...publisher]);
    } else if (publisher[0] === undefined) {
      publisher.push(singer.pop());
      setPublisher([...publisher]);
      const singerIdx = subscribers.indexOf(nextsinger, 0);
      if (singerIdx > -1) {
        singer.push(subscribers.splice(singerIdx, 1)[0]);
        setSinger([...singer]);
        setSubscribers([...subscribers]);
      }
    } else {
      const singerIdx = subscribers.indexOf(nextsinger, 0);
      singer.push(subscribers.splice(singerIdx, 1)[0]);
      if (singer.length > 1) {
        subscribers.push(singer.shift());
      }
      setSinger([...singer]);
      setSubscribers([...subscribers]);
    }
  };

  // 화면 공유 끄기
  const leaveScreen = () => {
    screenSession.unpublish(screenPublisher);
  };

  // 다른 참가자가 떠날때
  const deleteSubscriber = (streamManager: any) => {
    const newsubscribers = subscribers;
    const index = subscribers.indexOf(streamManager, 0);
    if (index > -1) {
      newsubscribers.splice(index, 1);
      setSubscribers(newsubscribers);
    }
  };

  // 사용자가 떠날때
  const leaveSession = () => {
    const mySession = session;
    if (mySession) mySession.disconnect();

    leaveScreen();
    setOV(null);
    setScreenOV(null);
    setSession(undefined);
    setScreenSession(undefined);
    setScreenPublisher(undefined);
    setPublisher([]);
    setSubscribers([]);
    setSinger([]);

    window.close();
  };

  // 페이지 입장 후 로딩시작, joinsession
  useEffect(() => {
    setLoading(true);
    joinsession();
  }, []);

  // joinsession 이후 초기 세팅 진행
  useEffect(() => {
    if (init) {
      const mySession = session;
      const myScreen = screenSession;

      mySession.on('streamCreated', (event: any) => {
        // 카메라 추가
        if (event.stream.typeOfVideo === 'CAMERA') {
          // console.log('카메라 이벤트', event);
          const subscriber = mySession.subscribe(event.stream, undefined);
          const newsubscribers = subscribers;
          newsubscribers.push(subscriber);
          setSubscribers([...newsubscribers]);

          // 화면공유
          // } else if (event.stream.typeOfVideo === 'CUSTOM') {
          //   const subscreen = myScreen.subscribe(event.stream, undefined);
          //   // console.log('커스텀 이벤트', event);
          //   setShare(true);
        }
      });

      // 참가자가 떠날때
      mySession.on('streamDestroyed', (event: any) => {
        // Remove the stream from 'subscribers' array
        deleteSubscriber(event.stream.streamManager);
      });

      // 다음 singer
      mySession.on('signal:nextSinger', (event: any) => {
        changeSinger(event.from);
      });

      // 노래 정보 수신
      // const dispatch = useDispatch();
      mySession.on('signal:reservationList', (event: any) => {
        const getReserveData = JSON.parse(event.data);
        // dispatch(setReservationList(getReserveData));
        console.log('예약리스트', getReserveData);
      });

      // 내 캠 connect
      getToken().then(token => {
        mySession
          .connect(token, { clientdata: myUserName })
          .then(async () => {
            const newpublisher = await OV.initPublisherAsync(undefined, {
              audioSource: undefined, // The source of audio. If undefined default microphone
              videoSource: undefined, // The source of video. If undefined default webcam
              publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
              publishVideo: true, // Whether you want to start publishing with your video enabled or not
              resolution: '480x480', // The resolution of your video
              frameRate: 30, // The frame rate of your video
              insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
              mirror: false, // Whether to mirror your local video or not
            });

            // --- Publish your stream ---
            mySession.publish(newpublisher);

            publisher.push(newpublisher);
            setPublisher([...publisher]);
            setLoading(false);
            // console.log('done##');
          })
          .catch((error: any) => {
            console.log(
              'There was an error connecting to the session:',
              error.code,
              error.message,
              error,
            );
          });
      });

      // 화면 공유 connect
      getToken().then(tokenScreen => {
        myScreen.connect(tokenScreen, { cliendData: myUserName });
        // .then(() => {
        //   console.log('화면공유 세션 연결됨');
        // })
        // .catch((error: any) => {
        //   console.log('화면 공유 세션 연결 실패', error.code, error.message);
        // });
      });
    }
  }, [init]);

  // 화면 공유 (stream.typeOfVideo === 'CUSTOM')
  const screenShare = () => {
    if (!share) {
      setShare(!share);
      screenOV
        .getUserMedia({
          audioSource: undefined,
          videoSource: undefined,
          resolution: '950x350',
          frameRate: 30,
        })
        .then(async () => {
          // audioSource
          const testAudio = new Audio('/sounds/mr.mp3');
          const audioContext = new AudioContext();
          const mp3AudioSource =
            audioContext.createMediaElementSource(testAudio);
          const mp3AudioDestination =
            audioContext.createMediaStreamDestination();
          mp3AudioSource.connect(mp3AudioDestination);
          mp3AudioSource.connect(audioContext.destination);
          await testAudio.play();
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

          setScreenPublisher(newScreenPublisher);
          screenSession.publish(newScreenPublisher);
        });
    } else {
      setShare(!share);
      leaveScreen();
    }
  };

  // 임의로 mode 선언
  const mode = 'nomal';

  // 로딩중 return
  if (loading)
    return (
      <div className={styles.container}>
        <Loading />
      </div>
    );

  // 로딩끝 return
  return (
    <div className={styles.container}>
      {/* <RoomController /> */}
      <RoomHeader leaveRoom={leaveSession} screenShare={screenShare} />
      <div className={styles.screen}>
        <div className={styles.mainScreen}>
          {singer.map(person => {
            return <MyScreen streamManager={person} />;
          })}
          <button type="button" onClick={nextSinger}>
            ||
          </button>
          <button type="button" onClick={shareReservationList}>
            list
          </button>
          <div className={styles.singScreen}>
            <MainScreen
              singMode={mode}
              subscribers={subscribers}
              screenOV={screenOV}
              screenSession={screenSession}
            />
            {/* {testOnOff ? null : (
              <MainScreen
                streamManager={screener}
                singMode={mode}
                subscribers={subscribers}
              />
            )}
            {testOnOff ? <PerfectScore /> : null} */}
          </div>
        </div>
        <div className={styles.otherScreen}>
          {publisher.map(pub => {
            return <MyScreen streamManager={pub} />;
          })}
          {subscribers.map(sub => {
            return <MyScreen streamManager={sub} key={sub.stream.streamId} />;
          })}
        </div>
      </div>
      <RoomFooter session={session} />
    </div>
  );
}

export default Index;
