import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { PitchDetector } from 'pitchy';
import { useDispatch, useSelector } from 'react-redux';
import { setSsari } from '@/redux/store/ssariSlice';
import { RootState } from '@/redux/store';

import { useCanvas } from '@/hooks/useCanvas';
import { useAnimation } from '@/hooks/useAnimation';
import { getCookie } from '@/util/cookie';

import * as data from '@/constants/PerfectScoreData';
import { NextSong } from '@/components/room/MainScreen';

import styles from '@/styles/room/PerfectScore.module.scss';

interface SongData {
  note: number;
  time: number;
  cnt: number;
}

function PerfectScore(props: {
  screenShare: (
    audioContext: AudioContext,
    mp3AudioDestination: MediaStreamAudioDestinationNode,
  ) => void;
  nextSong: NextSong;
}) {
  const { screenShare, nextSong } = props;
  const dispatch = useDispatch();
  const dataArrayRef = useRef<Float32Array>(new Float32Array(data.BUFFER_SIZE));
  const pitchDetectorRef = useRef<PitchDetector<Float32Array>>(
    PitchDetector.forFloat32Array(data.BUFFER_SIZE),
  );
  const musicRef = useRef<AudioBufferSourceNode>();
  const songDataRef = useRef<SongData[]>([]);
  const startTimeRef = useRef<number>(0);
  const halfSize = data.NOTE_WINDOW_SIZE / 2;
  const voiceNoteWindowRef = useRef<number[]>(new Array(halfSize));
  const songNoteWindowRef = useRef<number[][]>(
    new Array(data.NOTE_WINDOW_SIZE).fill([0, 0]),
  );
  const lyricFlag = useRef(true);
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
  const lyrics = nextSong.lyricsList;
  const storeSsari = useSelector((state: RootState) => state.ssari);

  // const stop = () => {
  //   musicRef.current?.stop(0);
  //   setIsStarted(false);
  //   dispatch(setSsari(2));
  // };

  const isSilentBuffer = (buffer: Float32Array) => {
    let ret = 0;
    for (let i = 0; i < buffer.length; i++) {
      ret += buffer[i] * buffer[i];
    }
    return Math.sqrt(ret / buffer.length) < data.SILENCE_THRESHOLD;
  };

  const canvasWidth = 930;
  const canvasHeight = 330;
  const canvasRef = useCanvas(canvasWidth, canvasHeight);

  // 파티클
  const drawParticle = (
    noteWindow: number[][],
    ctx: CanvasRenderingContext2D,
  ) => {
    if (noteWindow[halfSize][0] < 10) return;
    const makeParticle = (particleNum: number) => {
      const particleY = canvasHeight - noteWindow[halfSize][0] * 3;
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

  const drawlyrics = (ctx: CanvasRenderingContext2D, currTime: number) => {
    const deltaTime = currTime - 2.7;
    if (lyrics.length > 1 && lyrics[1].time < deltaTime) {
      lyrics.shift();
      lyricFlag.current = !lyricFlag.current;
    }
    let lyricA: string;
    let lyricB: string;
    if (lyrics.length > 1) {
      lyricA = lyricFlag.current ? lyrics[0].verse : lyrics[1].verse;
      lyricB = lyricFlag.current ? lyrics[1].verse : lyrics[0].verse;
    } else if (lyrics.length === 1) {
      lyricA = lyricFlag.current ? lyrics[0].verse : ' ';
      lyricB = lyricFlag.current ? ' ' : lyrics[0].verse;
    } else {
      lyricA = ' ';
      lyricB = ' ';
    }
    if (lyrics[0].verse === '') {
      lyricA = '간주중';
      lyricB = '...';
      ctx.fillStyle = '#00AADF';
      ctx.fillText(lyricA, canvasWidth / 2, canvasHeight - 50);
      ctx.fillText(lyricB, canvasWidth / 2, canvasHeight - 20);
    } else {
      ctx.textAlign = 'center';
      ctx.font = '20px Jalnan';
      if (lyricFlag.current) {
        ctx.fillStyle = '#00AADF';
        ctx.fillText(lyricA, canvasWidth * 0.45, canvasHeight - 50);
        ctx.fillStyle = '#969696';
        ctx.fillText(lyricB, canvasWidth * 0.55, canvasHeight - 20);
      } else {
        ctx.fillStyle = '#969696';
        ctx.fillText(lyricA, canvasWidth * 0.45, canvasHeight - 50);
        ctx.fillStyle = '#00AADF';
        ctx.fillText(lyricB, canvasWidth * 0.55, canvasHeight - 20);
      }
    }
  };

  const voiceNoteWindow = voiceNoteWindowRef.current;
  const songNoteWindow = songNoteWindowRef.current;
  const songData = songDataRef.current;

  const audioCtx = new AudioContext();
  const analyser = audioCtx.createAnalyser();

  analyser.minDecibels = data.MIN_DB;
  analyser.smoothingTimeConstant = data.SMOOTHING_TIME_CONSTANT;
  analyser.fftSize = data.FFT_SIZE;

  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);
  });
  let songIndex = 0;
  let block = 1;
  let scoreText = '';
  let barColor: number;
  // 메인 로직
  const play = () => {
    if (
      !dataArrayRef.current ||
      !pitchDetectorRef.current ||
      !analyser ||
      !isStarted ||
      !songData
    )
      return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // 음정 분석
    const dataArray = dataArrayRef.current;
    const pitchDetector = pitchDetectorRef.current;

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
    voiceNoteWindow.push(note);
    if (voiceNoteWindow.length > halfSize) {
      voiceNoteWindow.shift();
    }

    // 현재 시간에 맞는 노래 데이터 저장
    const currentTime = (Date.now() - startTimeRef.current) / 1000;
    if (currentTime > songData[songIndex].time) {
      songIndex += 1;
    }
    if (
      songNoteWindow[halfSize][0] !== -1 &&
      songNoteWindow[halfSize][0] === songNoteWindow[halfSize + 1][0]
    ) {
      block += 1;
    } else if (
      songNoteWindow[halfSize][0] !== -1 &&
      songNoteWindow[halfSize][0] !== songNoteWindow[halfSize + 1][0]
    ) {
      let correct = 0;
      block = Math.min(block, halfSize);
      for (let i = 0; i < block; i++) {
        if (
          Math.abs(
            voiceNoteWindow[halfSize - i] - songNoteWindow[halfSize - i][0],
          ) < 3
        ) {
          correct += 1;
        }
      }
      if (correct > block * 0.5) {
        barColor = 1;
        scoreText = 'PERFECT';
      } else if (correct > block * 0.3) {
        barColor = 2;
        scoreText = 'GREAT';
      } else if (correct > block * 0.1) {
        barColor = 3;
        scoreText = 'GOOD';
      } else if (correct > 0) {
        barColor = 4;
        scoreText = 'NORMAL';
      } else {
        barColor = 5;
        scoreText = 'BAD';
      }
      for (let i = 0; i < block; i++) {
        songNoteWindow[halfSize - i][1] = barColor;
      }
      block = 1;
    }
    if (songIndex < songData.length) {
      songNoteWindow.push([songData[songIndex].note, 0]);
    }
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
          ctx.fillStyle = `rgba(255, 255, 255, 0.5)`;
        }

        ctx.beginPath();
        if (
          i !== 0 &&
          i !== voiceNoteWindow.length - 1 &&
          voiceNoteWindow[i] !== voiceNoteWindow[i - 1] &&
          voiceNoteWindow[i] !== voiceNoteWindow[i + 1]
        ) {
          ctx.roundRect(x, y, barWidth, barHeight, [5, 5, 5, 5]);
        } else if (i !== 0 && voiceNoteWindow[i] !== voiceNoteWindow[i - 1]) {
          ctx.roundRect(x, y, barWidth, barHeight, [5, 0, 0, 5]);
        } else if (
          i !== voiceNoteWindow.length - 1 &&
          voiceNoteWindow[i] !== voiceNoteWindow[i + 1]
        ) {
          ctx.roundRect(x, y, barWidth, barHeight, [0, 5, 5, 0]);
        } else {
          ctx.rect(x, y, barWidth, barHeight);
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
    };

    drawMusicNote();
    drawMicNote();
    drawParticle(songNoteWindow, ctx);
    drawlyrics(ctx, currentTime);

    ctx.beginPath();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.moveTo(canvasWidth * 0.5, 0);
    ctx.lineTo(canvasWidth * 0.5, canvasHeight - 80);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    ctx.font = 'bold 30px Jalnan';
    ctx.fillStyle = barColorList[barColor];
    ctx.textAlign = 'center';
    ctx.fillText(scoreText, canvasWidth * 0.4, 50);
  };

  useAnimation(play, 0, [dataArrayRef, pitchDetectorRef, analyser, isStarted]);

  // 노래 재생
  useEffect(() => {
    const fetchMusic = async () => {
      if (storeSsari.ssari === 6) return;
      const musicAudioCtx = new AudioContext();
      const gainNode = musicAudioCtx.createGain();
      const noteData = await fetch(nextSong.note);
      const noteJson = await noteData.json();
      for (let i = 0; i < noteJson.length; i++) {
        if (noteJson[i].cnt > 2) {
          songData.push(noteJson[i]);
        }
      }
      const response = await fetch(nextSong.file);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await musicAudioCtx.decodeAudioData(arrayBuffer);
      const musicSource = musicAudioCtx.createBufferSource();
      const mp3AudioDestination = musicAudioCtx.createMediaStreamDestination();
      musicSource.buffer = audioBuffer;
      // musicSource.connect(musicAudioCtx.destination);
      // musicSource.connect(mp3AudioDestination);
      musicRef.current = musicSource;
      musicRef.current.onended = async () => {
        await axios.delete('api/v1/reservation/sing', {
          headers: {
            Authorization: getCookie('Authorization'),
            refreshToken: getCookie('refreshToken'),
          },
          data: {
            songId: nextSong.songId,
            time: Math.floor((Date.now() - startTimeRef.current) / 1000),
          },
        });
        dispatch(setSsari(7));
      };
      setIsStarted(true);
      musicRef.current.connect(gainNode);
      gainNode.connect(musicAudioCtx.destination);
      gainNode.gain.value = 0.3;
      gainNode.connect(mp3AudioDestination);
      startTimeRef.current = Date.now();
      setTimeout(() => {
        musicRef.current?.start();
      }, 2700);
      screenShare(musicAudioCtx, mp3AudioDestination);
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
    };
    fetchMusic();
  }, []);

  return (
    <canvas
      id="screen-screen"
      className={styles.canvas}
      width={canvasWidth}
      height={canvasHeight}
      ref={canvasRef}
    />
  );
}

export default PerfectScore;
