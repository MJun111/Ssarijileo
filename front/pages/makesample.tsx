import React, { useRef, useEffect, useState } from 'react';

import { PitchDetector } from 'pitchy';
import { useCanvas } from '@/hooks/useCanvas';
import { useAnimation } from '@/hooks/useAnimation';
import * as data from '@/constants/PerfectScoreData';
import noteData from '@/fixtures/사건의_지평선.json';

import styles from '@/styles/MakeSample.module.scss';

function MakeSample() {
  const [volume, setVolume] = useState(0.5);
  const [tempo, setTempo] = useState(1);
  const dataArrayRef = useRef<Float32Array>(new Float32Array(data.BUFFER_SIZE));
  const pitchDetectorRef = useRef<PitchDetector<Float32Array>>(
    PitchDetector.forFloat32Array(data.BUFFER_SIZE),
  );
  const analyserRef = useRef<AnalyserNode>();
  const gainRef = useRef<GainNode>();
  const sourceRef = useRef<AudioBufferSourceNode>();
  const startRef = useRef<number>(0);
  const noteWindowRef = useRef<number[]>([]);
  const drawRef = useRef<number[]>([]);
  const dbRef = useRef<
    {
      note: number;
      time: number;
      cnt: number;
    }[]
  >([]);
  const [isReady, setIsReady] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const save = () => {
    const jsonData = JSON.stringify(dbRef.current);
    console.log(jsonData);
  };

  const start = () => {
    setIsStarted(true);
    sourceRef.current?.start();
    startRef.current = performance.now();
  };

  const stop = () => {
    sourceRef.current?.stop();
    setIsStarted(false);
    save();
  };

  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
    gainRef.current?.gain.setValueAtTime(Number(e.target.value), 0);
  };

  const changeTempo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempo(Number(e.target.value));
    sourceRef.current?.playbackRate.setValueAtTime(Number(e.target.value), 0);
  };

  const isSilentBuffer = (buffer: Float32Array) => {
    let ret = 0;
    for (let i = 0; i < buffer.length; i++) {
      ret += buffer[i] * buffer[i];
    }
    return Math.sqrt(ret / buffer.length) < data.SILENCE_THRESHOLD;
  };

  // 테스트
  const ifTest = true;
  let i = 0;
  const newNoteData = useRef<
    {
      note: number;
      time: number;
      cnt: number;
    }[]
  >([]);
  for (const note of noteData) {
    if (note.cnt > 3) {
      newNoteData.current.push(note);
    }
  }
  const test = () => {
    if (
      !dataArrayRef.current ||
      !pitchDetectorRef.current ||
      !analyserRef.current ||
      !isStarted
    )
      return;
    // console.log(((performance.now() - startRef.current) / 1000).toFixed(2));
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const noteWindow = noteWindowRef.current;

    const noteTime = newNoteData.current[i].time;
    const currentTime = (performance.now() - startRef.current) / 1000;
    if (currentTime > noteTime) i += 1;
    const noteData = newNoteData.current[i];
    noteWindow.push(noteData.note);

    let x = 0;
    const barWidth = 0.5;
    for (let i = 0; i < noteWindow.length; i++) {
      const barHeight = 10;
      const y = canvasHeight - noteWindow[i] * 5;
      if (!Number.isNaN(y)) {
        const gradient = ctx.createLinearGradient(
          x,
          y,
          x + barWidth,
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

  // 메인 로직
  const canvasWidth = 10000;
  const canvasHeight = data.CANVAS_HEIGHT;
  const canvasRef = useCanvas(canvasWidth, canvasHeight);
  const play = () => {
    if (
      !dataArrayRef.current ||
      !pitchDetectorRef.current ||
      !analyserRef.current ||
      !isStarted
    )
      return;
    // console.log(((performance.now() - startRef.current) / 1000).toFixed(2));
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

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
    const drawWindow = drawRef.current;
    if (note == undefined || Number.isNaN(note)) note = -1;
    if (note !== noteWindow[noteWindow.length - 1]) {
      const deltaTime = parseFloat(
        ((performance.now() - startRef.current) / 1000).toFixed(2),
      );
      const data = {
        note: noteWindow[noteWindow.length - 1] || -1,
        time: deltaTime,
        cnt: noteWindow.length,
      };
      console.log(data);
      dbRef.current.push(data);
      noteWindow.splice(0, noteWindow.length);
    }
    noteWindow.push(note);
    drawWindow.push(note);

    // 음정 출력
    let x = 0;
    const barWidth = 0.5;
    for (let i = 0; i < drawWindow.length; i++) {
      const barHeight = 10;
      const y = canvasHeight - drawWindow[i] * 5;
      if (!Number.isNaN(y)) {
        const gradient = ctx.createLinearGradient(
          x,
          y,
          x + barWidth,
          y + barHeight,
        );
        gradient.addColorStop(0, data.NOTE_COLOR.skyblue);
        gradient.addColorStop(1, '#fff5f5');
        ctx.fillStyle = gradient;
      }

      ctx.beginPath();
      if (
        i !== 0 &&
        i !== drawWindow.length - 1 &&
        drawWindow[i] !== drawWindow[i - 1] &&
        drawWindow[i] !== drawWindow[i + 1]
      ) {
        ctx.roundRect(x, y, barWidth + 1, barHeight, [5, 5, 5, 5]);
      } else if (i !== 0 && drawWindow[i] !== drawWindow[i - 1]) {
        ctx.roundRect(x, y, barWidth + 1, barHeight, [5, 0, 0, 5]);
      } else if (
        i !== drawWindow.length - 1 &&
        drawWindow[i] !== drawWindow[i + 1]
      ) {
        ctx.roundRect(x, y, barWidth + 1, barHeight, [0, 5, 5, 0]);
      } else {
        ctx.rect(x, y, barWidth + 1, barHeight);
      }
      ctx.fill();
      x += barWidth;
    }
  };

  useAnimation(ifTest ? test : play, 0, [
    dataArrayRef,
    pitchDetectorRef,
    analyserRef,
    isStarted,
  ]);

  // analyser 세팅
  useEffect(() => {
    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();
    const gainNode = audioCtx.createGain();
    analyserRef.current = analyser;
    gainRef.current = gainNode;

    analyser.minDecibels = data.MIN_DB;
    analyser.smoothingTimeConstant = data.SMOOTHING_TIME_CONSTANT;
    analyser.fftSize = 8192;

    fetch('sounds/voice.mp3')
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(analyser);
        source.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        sourceRef.current = source;
        source.onended = () => {
          save();
        };
        setIsReady(sourceRef.current !== undefined);
      });
  }, []);

  return (
    <>
      <canvas
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
          disabled={isStarted || !isReady}
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
        <input
          type="range"
          min={0}
          max={1}
          color="gray"
          step={0.01}
          value={volume}
          onChange={changeVolume}
        />
        <input
          className="playback-rate-control"
          type="range"
          min="0.25"
          max="3"
          step="0.05"
          value={tempo}
          onChange={changeTempo}
        />
      </div>
    </>
  );
}

export default MakeSample;
