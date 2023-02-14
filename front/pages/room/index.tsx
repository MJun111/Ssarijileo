// Path: '/room'
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { setReserv } from '@/redux/store/reservSlice';

const APPLICATION_SERVER_URL = 'http://localhost:5000/';

// interface Reserv {
//   nickname: string;
//   songId: number;
//   isPriority: string;
//   title: string;
//   singer: string;
// }

function Index() {
  // username
  const [myUserName, setMyUserName] = useState('');
  const storeUser = useSelector((state: RootState) => state.user);
  useEffect(() => {
    setMyUserName(storeUser.nickname);
  }, [storeUser]);

  // session Info
  const mySessionId = '123451';
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

  // // 예약 리스트
  // const [reservationList, setReservationList] = useState<Reserv[]>([]);
  // const storeReservList = useSelector((state: RootState) => state.reserv);
  // useEffect(() => {
  //   setReservationList(storeReservList.reserv);
  // }, [storeReservList]);

  const nextSinger = () => {
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

  const dispatch = useDispatch();

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
    dispatch(setReserv([]));
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
        console.log('아아아아앙', event.stream);
        deleteSubscriber(event.stream.streamManager);
      });

      // 다음 singer
      mySession.on('signal:nextSinger', (event: any) => {
        changeSinger(event.from);
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

  // 임의로 mode 선언
  const mode = 'N';

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
      <RoomHeader leaveRoom={leaveSession} session={session} />
      <div className={styles.screen}>
        <div className={styles.mainScreen}>
          {singer.map(person => {
            return <MyScreen key={person.id} streamManager={person} />;
          })}
          <button type="button" onClick={nextSinger}>
            ||
          </button>
          <div className={styles.singScreen}>
            <MainScreen
              singMode={mode}
              // subscribers={subscribers}
              screenOV={screenOV}
              session={session}
              screenSession={screenSession}
              publisher={publisher}
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
            return <MyScreen streamManager={pub} key={pub.id} />;
          })}
          {subscribers.map(sub => {
            return <MyScreen streamManager={sub} key={sub.stream.streamId} />;
          })}
        </div>
      </div>
      <RoomFooter session={session} publisher={publisher} />
    </div>
  );
}

export default Index;
