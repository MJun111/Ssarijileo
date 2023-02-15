import { useEffect, useRef, useState } from 'react';

import { useDispatch } from 'react-redux';
import { useCanvas } from '@/hooks/useCanvas';
import { useAnimation } from '@/hooks/useAnimation';
import { setSsari } from '@/redux/store/ssariSlice';

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
  const sourceRef = useRef<AudioBufferSourceNode>();
  const timeRef = useRef<number>(0);
  const [isStarted, setIsStarted] = useState(false);

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
  console.log(nextSong);
  const currentIdx = Math.min(randomCanvas.length, nextSong.lyricsList.length);
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
    const time = (currentTime - timeRef.current) / 1000;
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
      }
    } else if (dataArray[0].time < time) {
      return;
    }
    dataArray.forEach(data => {
      ctx.fillText(data.verse, data.x, data.y);
    });
  };

  useAnimation(draw, 0);

  useEffect(() => {
    const audioCtx = new AudioContext();
    fetch('sounds/사건의지평선_mr.mp3')
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;
        const mp3AudioDestination = audioCtx.createMediaStreamDestination();
        source.connect(mp3AudioDestination);
        source.connect(audioCtx.destination);
        timeRef.current = Date.now();
        sourceRef.current = source;
        sourceRef.current.start();
        setIsStarted(true);
        screenShare(audioCtx, mp3AudioDestination);
        source.onended = () => {
          dispatch(setSsari(7));
        };
      });
  }, []);

  return (
    <canvas
      id="screen-screen"
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      className={styles.canvas}
    />
  );
}

export default OrderSong;
