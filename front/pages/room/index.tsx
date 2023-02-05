// Path: '/room'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { OpenVidu } from 'openvidu-browser';

import RoomHeader from '@/components/room/RoomHeader';
import MainScreen from '@/components/room/MainScreen';
import MyScreen from '@/components/room/MyScreen';
import RoomFooter from '@/components/room/RoomFooter';
import Loading from '@/components/room/Loading';
import PerfectScore from '@/components/room/PerfectScore';
// import OtherScreen from '@/components/room/OtherScreen';
// import RoomController from '@/components/room/RoomController';

import styles from '@/styles/Room.module.scss';

const APPLICATION_SERVER_URL = 'http://localhost:5000/';

function Index() {
  // user name
  const myUserName = 'samplename';

  // session Info
  const mySessionId = '11';
  const [OV, setOV] = useState<any>(undefined);
  const [screenOV, setScreenOV] = useState<any>(undefined);
  const [session, setSession] = useState<any>(undefined);
  const [screenSession, setScreenSession] = useState<any>(undefined);

  // 화면
  const [publisher, setPublisher] = useState<any>(undefined);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [screenPublisher, setScreenPublisher] = useState<any>();
  const [screener, setScreener] = useState<any>(undefined);

  // 초기 상태값
  const [loading, setLoading] = useState(true);
  const [init, setInit] = useState(false);

  // 화면공유 상태값
  const [share, setShare] = useState(false);
  const [testOnOff, setTest] = useState(false);

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
      {},
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

  const testOn = () => {
    setTest(!testOnOff);
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
    setPublisher(undefined);
    setSubscribers([]);

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
          const subscriber = mySession.subscribe(event.stream, undefined);
          const newsubscribers = subscribers;
          newsubscribers.push(subscriber);
          setSubscribers([...newsubscribers]);

          // 화면공유
        } else if (share && event.stream.typeOfVideo === 'CUSTOM') {
          console.log('share', share);
          console.log('화면공유', event);
          const subscreen = myScreen.subscribe(event.stream, undefined);
          setScreener(subscreen);
        }
      });

      // 참가자가 떠날때
      mySession.on('streamDestroyed', (event: any) => {
        // Remove the stream from 'subscribers' array
        deleteSubscriber(event.stream.streamManager);
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

            setPublisher(newpublisher);
            setLoading(false);
            console.log('done##');
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
        myScreen
          .connect(tokenScreen, { cliendData: myUserName })
          .then(() => {
            console.log('화면공유 세션 연결됨');
          })
          .catch((error: any) => {
            console.log('화면 공유 세션 연결 실패', error.code, error.message);
          });
      });
    }
  }, [init]);

  // 화면 공유 (stream.typeOfVideo === 'CUSTOM')
  const screenShare = () => {
    if (!share) {
      console.log(share);
      setShare(!share);
      console.log(!share);
      screenOV
        .getUserMedia({
          audioSource: false,
          videoSource: undefined,
          resolution: '1280x720',
          frameRate: 10,
        })
        .then(() => {
          const canvas = document.getElementById(
            'screen-screen',
          ) as HTMLCanvasElement | null;

          const grayVideoTrack = canvas?.captureStream(10).getVideoTracks()[0];
          const newScreenPublisher = screenOV.initPublisher(undefined, {
            audioSource: false,
            videoSource: grayVideoTrack,
          });
          setScreenPublisher(newScreenPublisher);
          screenSession.publish(newScreenPublisher);
        });
    } else {
      setShare(!share);
      leaveScreen();
    }
  };

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
          <MyScreen />
          <button type="button" onClick={testOn}>
            ||
          </button>
          <div className={styles.singScreen}>
            {share ? null : <MainScreen streamManager={screener} />}
            {testOnOff ? <PerfectScore /> : null}
            노래방화면!!!
          </div>
        </div>
        <div className={styles.otherScreen}>
          <MyScreen streamManager={publisher} />
          {subscribers.map(sub => {
            return <MyScreen streamManager={sub} />;
          })}
        </div>
      </div>
      <RoomFooter session={session} />
    </div>
  );
}

export default Index;
