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
}) {
  const { screenShare } = props;
  const dispatch = useDispatch();
  const sourceRef = useRef<AudioBufferSourceNode>();
  const timeRef = useRef<number>(0);
  const [isStarted, setIsStarted] = useState(false);

  const lyrics = [
    {
      lyricsId: 20,
      verse: '생각이 많은 건 말이야',
      startTime: 24,
    },
    {
      lyricsId: 21,
      verse: '당연히 해야 할 일이야',
      startTime: 27,
    },
    {
      lyricsId: 22,
      verse: '나에겐 우리가 지금 일순위야',
      startTime: 29,
    },
    {
      lyricsId: 23,
      verse: '안전한 유리병을 핑계로',
      startTime: 33,
    },
    {
      lyricsId: 24,
      verse: '바람을 가둬 둔 것 같지만',
      startTime: 39,
    },
    {
      lyricsId: 25,
      verse: '기억나? 그날의 우리가',
      startTime: 44,
    },
    {
      lyricsId: 26,
      verse: '잡았던 그 손엔 말이야',
      startTime: 46,
    },
    {
      lyricsId: 27,
      verse: '설레임보다 커다란 믿음이 담겨서',
      startTime: 49,
    },
    {
      lyricsId: 28,
      verse: '난 함박웃음을 지었지만',
      startTime: 53,
    },
    {
      lyricsId: 29,
      verse: '울음이 날 것도 같았어',
      startTime: 56,
    },
    {
      lyricsId: 30,
      verse: '소중한 건 언제나 두려움이니까',
      startTime: 58,
    },
    {
      lyricsId: 31,
      verse: '',
      startTime: 62,
    },
  ];

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
  const currentIdx = Math.min(randomCanvas.length, lyrics.length);
  const isUsed = Array(randomCanvas.length).fill(false);
  const dataArray: {
    lyricsId: number;
    verse: string;
    startTime: number;
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
    const data = { ...lyrics[i], x: 0, y: 0, idx: randomIdx };
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
      if (dataArray[1].startTime < time) {
        if (currentIdx < lyrics.length) {
          const randomIdx = dataArray[0].idx;
          const data = { ...lyrics[currentIdx], x: 0, y: 0, idx: randomIdx };
          data.x = randomCanvas[randomIdx].x + 10 - Math.random() * 20;
          data.y = randomCanvas[randomIdx].y + 10 - Math.random() * 20;
          dataArray.push(data);
        }
        dataArray.shift();
      }
    } else if (dataArray[0].startTime < time) {
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
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      className={styles.canvas}
    />
  );
}

export default OrderSong;
