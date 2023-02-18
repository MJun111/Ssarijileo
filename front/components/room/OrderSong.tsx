import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { getCookie } from '@/util/cookie';
import { RootState } from '@/redux/store';
import { setSsari } from '@/redux/store/ssariSlice';

import { useCanvas } from '@/hooks/useCanvas';
import { useAnimation } from '@/hooks/useAnimation';

import styles from '@/styles/room/OrderSong.module.scss';

function OrderSong(props: {
  screenShare: (
    audioContext: AudioContext,
    mp3AudioDestination: MediaStreamAudioDestinationNode,
  ) => void;
  nextSong: any;
}) {
  const { screenShare, nextSong } = props;
  const dispatch = useDispatch();
  const musicRef = useRef<AudioBufferSourceNode>();
  const startTimeRef = useRef<number>(0);
  const [isStarted, setIsStarted] = useState(false);
  const storeSsari = useSelector((state: RootState) => state.ssari);

  const pontSize = 20;
  const maxLen = 15;
  const randomCanvas: {
    y: number;
    x: number;
  }[] = [];

  let flag = false;
  for (let y = pontSize + 30; y < 320; y += 40) {
    let x = flag ? 210 : 50;
    flag = !flag;
    for (; x + pontSize * maxLen < 930; x += pontSize * maxLen + 70) {
      randomCanvas.push({ y, x });
    }
  }
  let currentIdx = Math.min(randomCanvas.length, nextSong.lyricsList.length);
  const isUsed = Array(randomCanvas.length).fill(false);
  const dataArray: {
    lyricsId: number;
    verse: string;
    time: number;
    x: number;
    y: number;
    idx: number;
  }[] = [];

  for (let i = 0; i < currentIdx; i++) {
    const randomIdx = Math.floor(Math.random() * randomCanvas.length);
    if (isUsed[randomIdx]) {
      i -= 1;
      continue;
    }
    isUsed[randomIdx] = true;
    const data = { ...nextSong.lyricsList[i], x: 0, y: 0, idx: randomIdx };
    data.x = randomCanvas[randomIdx].x + 10 - Math.random() * 20;
    data.y = randomCanvas[randomIdx].y + 10 - Math.random() * 20;
    dataArray.push(data);
  }

  const canvasWidth = 950;
  const canvasHeight = 350;
  const canvasRef = useCanvas(canvasWidth, canvasHeight);
  const draw = () => {
    if (!isStarted) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = '#1f5c7d';
    ctx.font = '20px Jalnan';
    const currentTime = Date.now();
    const time = (currentTime - startTimeRef.current) / 1000;
    if (dataArray.length > 1) {
      if (dataArray[1].time < time) {
        if (currentIdx < nextSong.lyricsList.length) {
          const randomIdx = dataArray[0].idx;
          const data = {
            ...nextSong.lyricsList[currentIdx],
            x: 0,
            y: 0,
            idx: randomIdx,
          };
          data.x = randomCanvas[randomIdx].x + 10 - Math.random() * 20;
          data.y = randomCanvas[randomIdx].y + 10 - Math.random() * 20;
          dataArray.push(data);
        }
        dataArray.shift();
        currentIdx += 1;
      }
    } else if (dataArray[0].time < time) {
      return;
    }
    dataArray.forEach(data => {
      ctx.fillText(data.verse, data.x, data.y);
    });
  };

  useAnimation(draw, 0);

  const stopMusic = async () => {
    await axios.delete('api/v1/reservation/sing', {
      headers: {
        Authorization: getCookie('Authorization'),
        refreshToken: getCookie('refreshToken'),
      },
      data: {
        songId: nextSong.songId,
        time: Math.floor(Date.now() - startTimeRef.current / 1000),
      },
    });
    dispatch(setSsari(7));
  };

  useEffect(() => {
    const fetchMusic = async () => {
      if (storeSsari.ssari === 6) return;
      const musicAudioCtx = new AudioContext();
      const gainNode = musicAudioCtx.createGain();
      const response = await fetch(nextSong.file);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await musicAudioCtx.decodeAudioData(arrayBuffer);
      const musicSource = musicAudioCtx.createBufferSource();
      const mp3AudioDestination = musicAudioCtx.createMediaStreamDestination();
      gainNode.gain.value = 0.5;
      musicSource.connect(gainNode);
      musicSource.buffer = audioBuffer;
      musicSource.connect(musicAudioCtx.destination);
      musicSource.connect(mp3AudioDestination);
      musicRef.current = musicSource;
      musicSource.onended = () => {
        stopMusic();
      };
      musicRef.current.start();
      startTimeRef.current = Date.now();
      await axios.post(
        'api/v1/reservation/sing',
        {
          songId: nextSong.songId,
        },
        {
          headers: {
            Authorization: `${getCookie('Authorization')}`,
            refreshToken: `${getCookie('refreshToken')}`,
          },
        },
      );
      setIsStarted(true);
      screenShare(musicAudioCtx, mp3AudioDestination);
    };
    fetchMusic();
  }, []);

  return (
    <>
      <canvas
        id="screen-screen"
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        className={styles.canvas}
      />
      <button
        type="button"
        className={styles.btn}
        onClick={async () => {
          musicRef.current?.stop(0);
          await stopMusic();
        }}
      >
        다음 곡으로
      </button>
    </>
  );
}

export default OrderSong;
