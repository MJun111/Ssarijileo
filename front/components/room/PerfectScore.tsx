import React, { useRef, useEffect, useState } from 'react';
import { PitchDetector } from 'pitchy';
import { useCanvas } from '@/hooks/useCanvas';
import { useAnimation } from '@/hooks/useAnimation';

import song from '@/fixtures/사건의_지평선.json';
import * as data from '@/constants/PerfectScoreData';
import styles from '@/styles/room/PerfectScore.module.scss';

function PerfectScore() {
  const dataArrayRef = useRef<Float32Array>(new Float32Array(data.BUFFER_SIZE));
  const pitchDetectorRef = useRef<PitchDetector<Float32Array>>(
    PitchDetector.forFloat32Array(data.BUFFER_SIZE),
  );
  const analyserRef = useRef<AnalyserNode>();
  const musicRef = useRef<AudioBufferSourceNode>();
  const startTimeRef = useRef<number>(0);
  const songNoteWindowRef = useRef<number[]>(
    new Array(data.NOTE_WINDOW_SIZE * data.DISPLAY_PERCENTAGE - 2),
  );
  const noteWindowRef = useRef<number[]>(
    new Array(data.NOTE_WINDOW_SIZE * data.DISPLAY_PERCENTAGE).fill(-1),
  );
  const particles: {
    speed: {
      x: number;
      y: number;
    };
    startX: number;
    startY: number;
    radius: number;
    color: string;
    life: number;
  }[] = [];
  const [isReady, setIsReady] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const start = () => {
    musicRef.current?.start();
    setIsStarted(true);
    startTimeRef.current = performance.now() - 2500;
    console.log(startTimeRef.current);
  };

  const stop = () => {
    musicRef.current?.stop();
    setIsStarted(false);
  };

  const isSilentBuffer = (buffer: Float32Array) => {
    let ret = 0;
    for (let i = 0; i < buffer.length; i++) {
      ret += buffer[i] * buffer[i];
    }
    return Math.sqrt(ret / buffer.length) < data.SILENCE_THRESHOLD;
  };

  // 메인 로직
  const songData: {
    time: number;
    note: number;
    cnt: number;
  }[] = [];
  for (let i = 0; i < song.length; i++) {
    if (song[i].cnt > 2) {
      songData.push(song[i]);
    }
  }
  let songIndex = 0;
  const canvasWidth = 950;
  const canvasHeight = 350;
  const canvasRef = useCanvas(canvasWidth, canvasHeight);
  const play = () => {
    if (
      !dataArrayRef.current ||
      !pitchDetectorRef.current ||
      !analyserRef.current ||
      !isStarted
    )
      return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const backgroundImage = new Image();
    backgroundImage.src = 'img/perfectscore/backgound.jpeg';
    ctx.drawImage(backgroundImage, 0, 0, canvasWidth, canvasHeight);

    // 음정 분석
    const dataArray = dataArrayRef.current;
    const pitchDetector = pitchDetectorRef.current;
    const analyser = analyserRef.current;

    analyser.getFloatTimeDomainData(dataArray);

    const [pitch] = isSilentBuffer(dataArray)
      ? [-1, -1]
      : pitchDetector.findPitch(dataArray, analyser.context.sampleRate);

    const freqToNote = (freq: number) => {
      return Math.round(12 * (Math.log(freq / 440.0) / Math.log(2))) + 69;
    };
    // 음정 분석 결과를 노트윈도우에 저장
    let note = freqToNote(pitch);
    if (note < 40 || note > 90) note = -1;
    const noteWindow = noteWindowRef.current;
    const flag = note === noteWindow[noteWindow.length - 1];
    noteWindow.push(note);
    if (noteWindow.length > data.NOTE_WINDOW_SIZE * data.DISPLAY_PERCENTAGE) {
      noteWindow.shift();
    }

    // 현재 시간에 맞는 노래 데이터 저장
    const currentTime = (performance.now() - startTimeRef.current) / 1000;
    if (currentTime > songData[songIndex].time) songIndex += 1;
    const songNoteWindow = songNoteWindowRef.current;
    songNoteWindow.push(songData[songIndex].note);
    if (
      songNoteWindow.length >
      data.NOTE_WINDOW_SIZE * data.DISPLAY_PERCENTAGE
    ) {
      songNoteWindow.shift();
    }

    // 파티클 생성
    const drawParticle = () => {
      const makeParticle = (particleNum: number) => {
        const particleY = canvasHeight - noteWindow[noteWindow.length - 1] * 3;
        for (let i = 0; i < particleNum; i++) {
          const speed = {
            x: Math.random() * 2,
            y: Math.random() * 2 - 1,
          };
          const radius = Math.random();
          const color = data.PARTICLE_COLOR;
          const startX =
            Math.random() * 2 + canvasWidth * data.DISPLAY_PERCENTAGE + 2;
          const startY = particleY + Math.random() * 10;
          const life = Math.random() * 5 + 5;
          particles.push({
            speed,
            startX,
            startY,
            radius,
            color,
            life,
          });
        }
      };

      // 파티클 유지 여부
      if (!flag) {
        particles.splice(0, particles.length);
        makeParticle(data.PARTICLE_COUNT);
      } else {
        for (let i = 0; i < particles.length; i++) {
          const particle = particles[i];
          particle.startX += particle.speed.x;
          particle.startY += particle.speed.y;
          particle.life -= 1;
          if (particle.life < 0) {
            particles.splice(i, 1);
          }
        }
        if (particles.length < data.PARTICLE_COUNT) {
          makeParticle(data.PARTICLE_COUNT - particles.length);
        }
      }

      // 파티클 그리기
      for (let i = 0; i < particles.length; i++) {
        ctx.beginPath();
        ctx.fillStyle = particles[i].color;
        ctx.arc(
          particles[i].startX,
          particles[i].startY,
          particles[i].radius,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
    };

    const barWidth = canvasWidth / data.NOTE_WINDOW_SIZE;
    const barHeight = 10;

    // 마이크 음정 출력
    const drawMicNote = () => {
      let x = 0;
      for (let i = 0; i < noteWindow.length; i++) {
        const y = canvasHeight - noteWindow[i] * 3;
        if (!Number.isNaN(y)) {
          const gradient = ctx.createLinearGradient(
            x,
            y,
            x + barWidth + 1,
            y + barHeight,
          );
          gradient.addColorStop(0, data.NOTE_COLOR.skyblue);
          gradient.addColorStop(1, '#fff5f5');
          ctx.fillStyle = gradient;
        }

        ctx.beginPath();
        if (
          i !== 0 &&
          i !== noteWindow.length - 1 &&
          noteWindow[i] !== noteWindow[i - 1] &&
          noteWindow[i] !== noteWindow[i + 1]
        ) {
          ctx.roundRect(x, y, barWidth + 1, barHeight, [5, 5, 5, 5]);
        } else if (i !== 0 && noteWindow[i] !== noteWindow[i - 1]) {
          ctx.roundRect(x, y, barWidth + 1, barHeight, [5, 0, 0, 5]);
        } else if (
          i !== noteWindow.length - 1 &&
          noteWindow[i] !== noteWindow[i + 1]
        ) {
          ctx.roundRect(x, y, barWidth + 1, barHeight, [0, 5, 5, 0]);
        } else {
          ctx.rect(x, y, barWidth + 1, barHeight);
        }
        ctx.fill();
        x += barWidth;
      }
    };

    // 노래 음정 출력
    const drawMusicNote = () => {
      let musicX = canvasWidth * data.DISPLAY_PERCENTAGE + 2;
      for (let i = 0; i < songNoteWindow.length; i++) {
        const musicY = canvasHeight - songNoteWindow[i] * 3;
        if (!Number.isNaN(musicY)) {
          const gradient = ctx.createLinearGradient(
            musicX,
            musicY,
            musicX + barWidth + 1,
            musicY + barHeight,
          );
          gradient.addColorStop(0, data.NOTE_COLOR.red);
          gradient.addColorStop(1, '#fff5f5');
          ctx.fillStyle = gradient;
        }

        ctx.beginPath();
        if (
          i !== 0 &&
          i !== songNoteWindow.length - 1 &&
          songNoteWindow[i] !== songNoteWindow[i - 1] &&
          songNoteWindow[i] !== songNoteWindow[i + 1]
        ) {
          ctx.roundRect(musicX, musicY, barWidth + 1, barHeight, [5, 5, 5, 5]);
        } else if (i !== 0 && songNoteWindow[i] !== songNoteWindow[i - 1]) {
          ctx.roundRect(musicX, musicY, barWidth + 1, barHeight, [5, 0, 0, 5]);
        } else if (
          i !== songNoteWindow.length - 1 &&
          songNoteWindow[i] !== songNoteWindow[i + 1]
        ) {
          ctx.roundRect(musicX, musicY, barWidth + 1, barHeight, [0, 5, 5, 0]);
        } else {
          ctx.rect(musicX, musicY, barWidth + 1, barHeight);
        }
        ctx.fill();
        musicX += barWidth;
      }
    };

    drawMicNote();
    drawMusicNote();
    drawParticle();
  };

  useAnimation(play, 0, [
    dataArrayRef,
    pitchDetectorRef,
    analyserRef,
    isStarted,
  ]);

  // analyser 세팅
  useEffect(() => {
    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();
    analyserRef.current = analyser;

    analyser.minDecibels = data.MIN_DB;
    analyser.smoothingTimeConstant = data.SMOOTHING_TIME_CONSTANT;
    analyser.fftSize = data.FFT_SIZE;

    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
    });

    const musicAudioCtx = new AudioContext();
    fetch('sounds/voice.mp3')
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => musicAudioCtx.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        const source = musicAudioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(musicAudioCtx.destination);
        musicRef.current = source;
        setIsReady(musicRef.current !== undefined);
      });
  }, [analyserRef, isStarted]);

  return (
    <>
      <canvas
        id="screen-screen"
        className={styles.canvas}
        width={canvasWidth}
        height={canvasHeight}
        ref={canvasRef}
      />
      <div id="controls">
        <input
          type="button"
          id="start_button"
          className={styles.button}
          value="Start"
          onClick={start}
          disabled={!isReady || isStarted}
        />
        &nbsp; &nbsp;
        <input
          type="button"
          id="stop_button"
          className={styles.button}
          value="Stop"
          onClick={stop}
          disabled={!isStarted}
        />
      </div>
    </>
  );
}

export default PerfectScore;
