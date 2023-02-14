import React, { useRef, useEffect, useState } from 'react';
import { PitchDetector } from 'pitchy';
import { useDispatch } from 'react-redux';
import { useCanvas } from '@/hooks/useCanvas';
import { useAnimation } from '@/hooks/useAnimation';

import song from '@/fixtures/Ditto.json';
import * as data from '@/constants/PerfectScoreData';
import styles from '@/styles/room/PerfectScore.module.scss';
import { setSsari } from '@/redux/store/ssariSlice';

function PerfectScore() {
  const dispatch = useDispatch();
  const dataArrayRef = useRef<Float32Array>(new Float32Array(data.BUFFER_SIZE));
  const pitchDetectorRef = useRef<PitchDetector<Float32Array>>(
    PitchDetector.forFloat32Array(data.BUFFER_SIZE),
  );
  const analyserRef = useRef<AnalyserNode>();
  const musicRef = useRef<AudioBufferSourceNode>();
  const startTimeRef = useRef<number>(0);
  const voiceNoteWindowRef = useRef<number[]>(new Array(data.NOTE_WINDOW_SIZE));
  const songNoteWindowRef = useRef<number[][]>(
    new Array(data.NOTE_WINDOW_SIZE).fill([0, 0]),
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
  const [isStarted, setIsStarted] = useState(false);
  const [isPossibleStop, setIsPossibleStop] = useState(false);
  const halfSize = data.NOTE_WINDOW_SIZE / 2;

  const stop = () => {
    musicRef.current?.stop(0);
    setIsStarted(false);
    dispatch(setSsari(2));
  };

  const isSilentBuffer = (buffer: Float32Array) => {
    let ret = 0;
    for (let i = 0; i < buffer.length; i++) {
      ret += buffer[i] * buffer[i];
    }
    return Math.sqrt(ret / buffer.length) < data.SILENCE_THRESHOLD;
  };

  // 파티클
  const drawParticle = (
    noteWindow: number[],
    flag: boolean,
    ctx: CanvasRenderingContext2D,
  ) => {
    const makeParticle = (particleNum: number) => {
      const particleY = canvasHeight - noteWindow[0] * 3;
      for (let i = 0; i < particleNum; i++) {
        const speed = {
          x: Math.random() * 2,
          y: Math.random() * 2 - 1,
        };
        const radius = Math.random();
        const color = data.PARTICLE_COLOR;
        const dy = Math.random() * 10;
        const startY = particleY + dy;
        const startX =
          Math.random() * (5 - Math.abs(dy - 5)) + canvasWidth * 0.5 + 2;
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
      ctx.closePath();
    }
  };

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
  let block = 0;
  const canvasWidth = 950;
  const canvasHeight = 350;
  const canvasRef = useCanvas(canvasWidth, canvasHeight);

  const voiceNoteWindow = voiceNoteWindowRef.current;
  const songNoteWindow = songNoteWindowRef.current;

  // 메인 로직
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
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

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
    // const flag = note === voiceNoteWindow[voiceNoteWindow.length - 1];
    voiceNoteWindow.push(note);
    if (voiceNoteWindow.length > data.NOTE_WINDOW_SIZE) {
      voiceNoteWindow.shift();
    }

    // 현재 시간에 맞는 노래 데이터 저장
    const currentTime = (Date.now() - startTimeRef.current) / 1000;
    if (currentTime > songData[songIndex].time) {
      songIndex += 1;
    }
    if (songNoteWindow[halfSize][0] === songNoteWindow[halfSize - 1][0]) {
      block += 1;
    } else {
      let correct = 0;
      let barColor: number;
      for (let i = 0; i < block; i++) {
        if (
          voiceNoteWindow[data.NOTE_WINDOW_SIZE - i] ===
          songData[songIndex].note
        ) {
          correct += 1;
        }
      }
      if (correct > block * 0.7) {
        barColor = 1;
      } else if (correct > block * 0.5) {
        barColor = 2;
      } else if (correct > block * 0.3) {
        barColor = 3;
      } else if (correct > block * 0.1) {
        barColor = 4;
      } else {
        barColor = 5;
      }
      for (let i = 0; i < block; i++) {
        if (songNoteWindow[halfSize - i]) {
          songNoteWindow[halfSize - i][1] = barColor;
        }
      }
      block = 0;
    }

    songNoteWindow.push([songData[songIndex].note, 0]);
    if (songNoteWindow.length > data.NOTE_WINDOW_SIZE) {
      songNoteWindow.shift();
    }

    const barWidth = canvasWidth / data.NOTE_WINDOW_SIZE;
    const barHeight = 10;

    // 마이크 음정 출력
    const drawMicNote = () => {
      let x = 0;
      for (let i = 0; i < voiceNoteWindow.length; i++) {
        const y = canvasHeight - voiceNoteWindow[i] * 3;
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
          i !== voiceNoteWindow.length - 1 &&
          voiceNoteWindow[i] !== voiceNoteWindow[i - 1] &&
          voiceNoteWindow[i] !== voiceNoteWindow[i + 1]
        ) {
          ctx.roundRect(x, y, barWidth + 1, barHeight, [5, 5, 5, 5]);
        } else if (i !== 0 && voiceNoteWindow[i] !== voiceNoteWindow[i - 1]) {
          ctx.roundRect(x, y, barWidth + 1, barHeight, [5, 0, 0, 5]);
        } else if (
          i !== voiceNoteWindow.length - 1 &&
          voiceNoteWindow[i] !== voiceNoteWindow[i + 1]
        ) {
          ctx.roundRect(x, y, barWidth + 1, barHeight, [0, 5, 5, 0]);
        } else {
          ctx.rect(x, y, barWidth + 1, barHeight);
        }
        ctx.fill();
        x += barWidth;
      }
    };

    const barColorList = [
      data.NOTE_COLOR.gray,
      data.NOTE_COLOR.skyblue,
      data.NOTE_COLOR.green,
      data.NOTE_COLOR.yellow,
      data.NOTE_COLOR.purple,
      data.NOTE_COLOR.red,
    ];
    // 노래 음정 출력
    const drawMusicNote = () => {
      let musicX = barWidth * 2;
      for (let i = 1; i < data.NOTE_WINDOW_SIZE - 2; i++) {
        const musicY = canvasHeight - songNoteWindow[i][0] * 3;
        if (!Number.isNaN(musicY)) {
          const gradient = ctx.createLinearGradient(
            musicX,
            musicY,
            musicX + barWidth + 1,
            musicY + barHeight,
          );
          gradient.addColorStop(0, barColorList[songNoteWindow[i][1]]);
          gradient.addColorStop(1, '#fff5f5');
          ctx.fillStyle = gradient;
        }

        ctx.beginPath();
        if (i !== 2 && songNoteWindow[i][0] !== songNoteWindow[i - 1][0]) {
          ctx.roundRect(musicX, musicY, barWidth + 1, barHeight, [5, 0, 0, 5]);
        } else if (
          i !== data.NOTE_WINDOW_SIZE - 3 &&
          songNoteWindow[i][0] !== songNoteWindow[i + 1][0]
        ) {
          ctx.roundRect(musicX, musicY, barWidth + 1, barHeight, [0, 5, 5, 0]);
        } else {
          ctx.rect(musicX, musicY, barWidth + 1, barHeight);
        }
        ctx.fill();
        musicX += barWidth;
      }

      ctx.beginPath();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.moveTo(canvasWidth * 0.5, 0);
      ctx.lineTo(canvasWidth * 0.5, canvasHeight);
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
    };

    // drawMicNote();
    drawMusicNote();
    // drawParticle(songNoteWindow, flag, ctx);
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
    fetch('sounds/DittoVoice.mp3')
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => musicAudioCtx.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        const source = musicAudioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(musicAudioCtx.destination);
        musicRef.current = source;
        startTimeRef.current = Date.now();
        setIsStarted(true);
        setTimeout(() => {
          musicRef.current?.start();
          setIsPossibleStop(true);
        }, 2700);
      });
  }, []);

  // useEffect(() => {
  //   if (screen !== undefined && !!videoRef) {
  //     screen.addVideoElement(videoRef.current);
  //   }
  // }, [screen]);

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
          id="stop_button"
          className={styles.button}
          value="Stop"
          onClick={stop}
          disabled={!isPossibleStop}
        />
      </div>
    </>
  );
}

export default PerfectScore;
