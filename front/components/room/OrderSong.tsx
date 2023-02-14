import { useEffect, useRef, useState } from 'react';

import { useCanvas } from '@/hooks/useCanvas';
import { useAnimation } from '@/hooks/useAnimation';

function OrderSong() {
  const sourceRef = useRef<AudioBufferSourceNode>();
  const timeRef = useRef<number>(0);
  const [isReady, setIsReady] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const DUMMY_DATA = [
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

  const start = () => {
    setIsStarted(true);
    sourceRef.current?.start();
    timeRef.current = Date.now();
  };
  const pontSize = 20;
  const maxLen = 15;
  const lyricLen = DUMMY_DATA.length - 1;
  const boxSize = 310 / (Math.floor(lyricLen / 3) + (lyricLen % 3 ? 1 : 0));
  const randomCanvas = [];

  let flag = false;
  for (let y = pontSize + 10; y < 350; y += boxSize) {
    let x = flag ? 210 : 10;
    flag = !flag;
    for (; x + pontSize * maxLen < 950; x += pontSize * maxLen + 15) {
      randomCanvas.push({ y, x });
    }
  }

  const trimData = DUMMY_DATA.slice(0, randomCanvas.length);
  const isUsed = Array(randomCanvas.length).fill(false);
  const dataArray: {
    lyricsId: number;
    verse: string;
    startTime: number;
    x: number;
    y: number;
  }[] = [];

  for (let i = 0; i < trimData.length; i++) {
    const randomIdx = Math.floor(Math.random() * randomCanvas.length);
    if (isUsed[randomIdx]) {
      i -= 1;
      continue;
    }
    isUsed[randomIdx] = true;
    const data = { ...trimData[i], x: 0, y: 0 };
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
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = 'white';
    ctx.font = '20px Jalnan';
    const currentTime = Date.now();
    const time = (currentTime - timeRef.current) / 1000;
    if (dataArray.length > 1) {
      if (dataArray[1].startTime < time) dataArray.shift();
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
        source.connect(audioCtx.destination);
        sourceRef.current = source;
        setIsReady(true);
      });
  }, []);

  return (
    <>
      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
      <button onClick={start} disabled={!isReady || isStarted} type="button">
        Start
      </button>
    </>
  );
}

export default OrderSong;
