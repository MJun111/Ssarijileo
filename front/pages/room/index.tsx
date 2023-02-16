// Path: '/room'
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { OpenVidu } from 'openvidu-browser';
import { RootState } from '@/redux/store';
import { setReserv } from '@/redux/store/reservSlice';
import { setSessionState } from '@/redux/store/sessionStateSlice';
import { setSsari } from '@/redux/store/ssariSlice';

import { getCookie } from '@/util/cookie';
import RoomHeader from '@/components/room/RoomHeader';
import MainScreen from '@/components/room/MainScreen';
import MyScreen from '@/components/room/MyScreen';
import RoomFooter from '@/components/room/RoomFooter';
import SingerScreen from '@/components/room/SingerScreen';
import Loading from '@/components/room/Loading';

import styles from '@/styles/Room.module.scss';

export interface RoomDetail {
  isPublic: string;
  mode: string;
  password: string | null;
  sessionId: string;
  title: string;
  userId: string;
  userList: string[];
  userMaxCount: number;
}

function Index() {
  const dispatch = useDispatch();
  // username
  const storeUser = useSelector((state: RootState) => state.user);

  const [roomInfo, setRoomInfo] = useState<RoomDetail>({} as RoomDetail);

  const storeSessionState = useSelector(
    (state: RootState) => state.sessionState,
  );

  // OV
  const [screenOV, setScreenOV] = useState<any>(undefined);
  const [session, setSession] = useState<any>(undefined);
  const [screenSession, setScreenSession] = useState<any>(undefined);

  // 화면
  const [publisher, setPublisher] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [singer, setSinger] = useState<any[]>([]);

  // 초기 상태값
  const [loading, setLoading] = useState(true);
  const [userCount, setUserCount] = useState(0);

  // 테마모드
  const storeTheme = useSelector((state: RootState) => state.theme);
  useEffect(() => {
    document.body.dataset.theme = storeTheme.theme || 'light';
  }, [storeTheme]);

  const getRoomDetail = async () => {
    console.log(storeSessionState.sessionId);
    const roomDetail = await axios({
      method: 'GET',
      url: `api/v1/room/${storeSessionState.sessionId}`,
      headers: {
        Authorization: `${getCookie('Authorization')}`,
        refreshToken: `${getCookie('refreshToken')}`,
      },
    });
    setRoomInfo(roomDetail.data);
    setUserCount(roomDetail.data.userList.length);
    console.log('방 정보', roomDetail.data);
  };

  // api screen
  const getToken = async () => {
    const response = await axios.post(
      `https://i8b302.p.ssafy.io/openvidu/api/sessions/${storeSessionState.sessionId}/connection`,
      {},
      {
        headers: { Authorization: 'Basic T1BFTlZJRFVBUFA6c3NhZnk=' },
      },
    );
    return response.data.token;
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
      nextsinger.publishAudio(false);
      singer.push(nextsinger);
      publisher.pop();
      setSinger([...singer]);
      setPublisher([...publisher]);
    } else if (publisher[0] === undefined) {
      publisher.push(singer.pop());
      publisher[0].publishAudio(true);
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

  // 다른 참가자가 떠날때
  const deleteSubscriber = (streamManager: any) => {
    const newsubscribers = subscribers;
    const index = subscribers.indexOf(streamManager, 0);
    if (index > -1) {
      newsubscribers.splice(index, 1);
      setSubscribers(newsubscribers);
    }
  };

  // api delete session
  const deleteSession = async () => {
    dispatch(setReserv([]));
    dispatch(
      setSessionState({ sessionId: '', sessionToken: '', isHost: false }),
    );
    try {
      await axios({
        method: 'DELETE',
        url: `api/v1/room/${storeSessionState.sessionId}`,
        headers: {
          Authorization: `${getCookie('Authorization')}`,
          refreshToken: `${getCookie('refreshToken')}`,
        },
      });
    } catch (error) {
      // pass
    }
    if (userCount <= 1 && session) {
      try {
        await axios.delete(
          `https://i8b302.p.ssafy.io/openvidu/api/sessions/${storeSessionState.sessionId}`,
          {
            headers: { Authorization: 'Basic T1BFTlZJRFVBUFA6c3NhZnk=' },
          },
        );
      } catch (error) {
        // pass
      }
    }
  };

  // 사용자가 떠날때
  const leaveSession = async () => {
    const mySession = session;
    if (mySession) {
      mySession.disconnect();
    }
    dispatch(setSsari(1));

    try {
      await axios.put(`api/v1/room/out/${storeSessionState.sessionId}`, null, {
        headers: {
          Authorization: `${getCookie('Authorization')}`,
        },
      });
    } catch (error) {
      // pass
    }
    setUserCount(userCount - 1);

    if (storeSessionState.isHost) {
      await deleteSession();
    } else {
      dispatch(setReserv([]));
      dispatch(
        setSessionState({ sessionId: '', sessionToken: '', isHost: false }),
      );
      if (userCount <= 1 && mySession) {
        await axios.delete(
          `https://i8b302.p.ssafy.io/openvidu/api/sessions/${storeSessionState.sessionId}`,
          {
            headers: { Authorization: 'Basic T1BFTlZJRFVBUFA6c3NhZnk=' },
          },
        );
      }
    }
    window.close();
  };

  document.onkeydown = (e: any) => {
    if (
      (e.ctrlKey && (e.keyCode === 78 || e.keyCode === 82)) ||
      e.keyCode === 116
    ) {
      e.preventDefault();
      alert('새로고침을 할 수 없습니다.');
    }
  };

  const bodyElt = document.querySelector('body');
  bodyElt?.setAttribute('oncontextmenu', 'return false;');

  window.addEventListener('beforeunload', () => {
    leaveSession();
  });

  // connect 진행!!!!
  const joinSession = () => {
    const newOV = new OpenVidu();
    const mySession = newOV.initSession();
    setSession(mySession);

    const newScreenOV = new OpenVidu();
    const myScreen = newScreenOV.initSession();
    setScreenOV(newScreenOV);
    setScreenSession(myScreen);

    console.log('mySession', mySession);
    console.log('myScreen', myScreen);

    // 다른사람 캠 추가
    mySession.on('streamCreated', (event: any) => {
      if (event.stream.typeOfVideo === 'CAMERA') {
        const subscriber = mySession.subscribe(event.stream, undefined);
        const newsubscribers = subscribers;
        newsubscribers.push(subscriber);
        setSubscribers([...newsubscribers]);
      }
    });

    // 참가자가 떠날때
    mySession.on('streamDestroyed', (event: any) => {
      deleteSubscriber(event.stream.streamManager);
    });

    // 세션이 없어졌을 때
    mySession.on('sessionDisconnected', () => {
      leaveSession();
    });

    // 다음 singer
    mySession.on('signal:nextSinger', (event: any) => {
      changeSinger(event.from);
    });

    // 내 캠 connect
    console.log('1. 내캠 커넥트');
    mySession
      .connect(storeSessionState.sessionToken, {
        clientData: storeUser.nickname,
      })
      .then(async () => {
        const newpublisher = await newOV.initPublisherAsync(undefined, {
          audioSource: undefined,
          videoSource: undefined,
          publishAudio: true,
          publishVideo: true,
          resolution: '480x480',
          frameRate: 30,
          insertMode: 'APPEND',
          mirror: false,
        });

        mySession.publish(newpublisher);
        publisher.push(newpublisher);
        setPublisher([...publisher]);
      });

    // 화면 공유 connect
    console.log('2. 화면 공유 커넥트');
    getToken().then((tokenScreen: any) => {
      myScreen.connect(tokenScreen, {
        clientData: storeSessionState.sessionId,
      });
      setLoading(false);
    });
  };

  // 세션 아이디 얻으면 연결 시작
  useEffect(() => {
    const connectSession = async () => {
      await getRoomDetail();
      await joinSession();
    };
    connectSession();
  }, []);

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
          {/* {singer.map(person => {
            return <MyScreen key={person.id} streamManager={person} />;
          })} */}
          <SingerScreen
            streamManager={singer.length ? singer[0] : undefined}
            session={session}
          />
          <div className={styles.singScreen}>
            <MainScreen
              singMode={roomInfo.mode}
              screenOV={screenOV}
              session={session}
              screenSession={screenSession}
              publisher={publisher}
            />
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
