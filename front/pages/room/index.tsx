// Path: '/room'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { OpenVidu } from 'openvidu-browser';

import RoomHeader from '@/components/room/RoomHeader';
import MainScreen from '@/components/room/MainScreen';
import MyScreen from '@/components/room/MyScreen';
import RoomFooter from '@/components/room/RoomFooter';
import Loading from '@/components/room/Loading';

// import RoomController from '@/components/room/RoomController';

import styles from '@/styles/Room.module.scss';

// back server (아마 session 서버 주소)
const APPLICATION_SERVER_URL = 'http://localhost:5000/';

function Index() {
  // user name
  const myUserName = 'samplename';

  // room info
  // const nextSong = { singdata: 'songdata', singer: 'samplename' };

  // session Info
  const mySessionId = '123';
  const [OV, setOV] = useState<any>(undefined);
  const [screenOV, setScreenOV] = useState<any>(undefined);
  const [session, setSession] = useState<any>(undefined);
  const [screenSession, setScreenSession] = useState<any>(undefined);

  // 화면
  const [publisher, setPublisher] = useState<any>(undefined);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [screenPublisher, setScreenPublisher] = useState<any>();
  const [screenSubscriber, setScreenSubscriber] = useState<any>(undefined);
  const [singer, setSinger] = useState<any>(undefined);

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

  // 오디오 스트림 filterss
  // const [delay, setDelay] = useState(50000000);
  // const [intensity, setIntensity] = useState(0.6);
  // const [feedback, setFeedback] = useState(0.4);

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

  // 카메라 위치바꾸기
  const onStage = () => {
    session
      .signal({
        data: '', // Any string (optional)
        to: [], // Array of Connection objects (optional. Broadcast to everyone if empty)
        type: 'singer', // The type of message (optional)
      })
      .then(() => {
        console.log('싱어 번경 요청 보내기 성공');
      })
      .catch((error: any) => {
        console.error('싱어 변경 요청 보내기 에러', error);
      });
  };

  const changeSinger = (from: any) => {
    // if (session.connection === from) {
    //   console.log('내가 싱어');
    // } else {
    //   const subIdx = subscribers.indexOf(from.streamManager);
    //   console.log(subIdx);
    //   console.log('다른사람이 singer');
    // }
    setSinger(from);
  };

  useEffect(() => {
    console.log('퍼블리셔 변경됨', publisher);
  }, [publisher]);

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
          console.log('카메라 이벤트', event);
          const subscriber = mySession.subscribe(event.stream, undefined);
          const newsubscribers = subscribers;
          newsubscribers.push(subscriber);
          setSubscribers([...newsubscribers]);

          // 화면공유
        } else if (event.stream.typeOfVideo === 'CUSTOM') {
          const subscreen = myScreen.subscribe(event.stream, undefined);
          console.log('커스텀 이벤트', event);
          setShare(true);
          setScreenSubscriber(subscreen);
        }
      });

      // 참가자가 떠날때 , steam
      mySession.on('streamDestroyed', (event: any) => {
        // Remove the stream from 'subscribers' array
        console.log('스트림 디스트로이드', event);
        deleteSubscriber(event.stream.streamManager);
      });

      // singer변경, event.from = connection 객체
      mySession.on('signal:singer', (event: any) => {
        console.log(event);
        changeSinger(event.from.stream.streamManager);
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
      setShare(!share);
      screenOV
        .getUserMedia({
          audioSource: undefined,
          videoSource: undefined,
          resolution: '950x350',
          frameRate: 30,
        })
        .then(async () => {
          // get audio
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

          // get video
          const canvas = document.getElementById(
            'screen-screen',
          ) as HTMLCanvasElement | null;

          const testVideoTrack = canvas?.captureStream(30).getVideoTracks()[0];

          // publish
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
          <MyScreen streamManager={singer} />
          <button type="button" onClick={testOn}>
            |PSon|
          </button>
          <button type="button" onClick={onStage}>
            sw
          </button>
          <div className={styles.singScreen}>
            {testOnOff ? null : <MainScreen streamManager={screenSubscriber} />}
            {testOnOff ? <PerfectScore /> : null}
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
