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
  ];

  const start = () => {
    setIsStarted(true);
    sourceRef.current?.start();
    timeRef.current = Date.now();
  };

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
    ctx.font = '20px Arial';
    const currentTime = Date.now();
    const time = (currentTime - timeRef.current) / 1000;
    if (DUMMY_DATA[1].startTime < time) DUMMY_DATA.shift();
    DUMMY_DATA.forEach(({ verse }, idx) => {
      ctx.fillText(verse, 0, 20 + 20 * idx);
    });
  };

  useAnimation(draw, 0);

  useEffect(() => {
    const audioCtx = new AudioContext();
    fetch('sounds/mr.mp3')
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
