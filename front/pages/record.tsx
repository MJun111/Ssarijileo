import { useState, useEffect, useRef, MouseEventHandler } from 'react';

function Record() {
  const startBtnRef = useRef<HTMLButtonElement>(null);
  const stopBtnRef = useRef<HTMLButtonElement>(null);
  const downloadRef = useRef<HTMLAnchorElement>(null);

  let startBtn = startBtnRef.current;
  let stopBtn = stopBtnRef.current;
  let download = downloadRef.current;

  let blobs: Blob[];
  let blob; // 데이터
  let rec: MediaRecorder; // 스트림을 기반으로 동작하는 mediarecorder 객체
  let stream; // 통합
  let voiceStream: MediaStream | null; // 오디오스트림
  let desktopStream: MediaStream | null; // 비디오스트림

  const mergeAudioStreams = (
    desktopStream: MediaStream,
    voiceStream: MediaStream,
  ) => {
    // 비디오, 오디오스트림 연결
    const context = new AudioContext();
    const destination = context.createMediaStreamDestination();
    let hasDesktop = false;
    let hasVoice = false;
    if (desktopStream && desktopStream.getAudioTracks().length > 0) {
      const source1 = context.createMediaStreamSource(desktopStream);
      const desktopGain = context.createGain();
      desktopGain.gain.value = 0.7;
      source1.connect(desktopGain).connect(destination);
      hasDesktop = true;
    }

    if (voiceStream && voiceStream.getAudioTracks().length > 0) {
      const source2 = context.createMediaStreamSource(voiceStream);
      const voiceGain = context.createGain();
      voiceGain.gain.value = 0.7;
      source2.connect(voiceGain).connect(destination);
      hasVoice = true;
    }

    return hasDesktop || hasVoice ? destination.stream.getAudioTracks() : [];
  };

  const startHandler = async () => {
    console.log('start');
    // 녹화 시작 버튼을 누른 경우
    desktopStream = await navigator.mediaDevices.getDisplayMedia({
      video: { width: 640, height: 480 },
      audio: true,
    }); // 비디오스트림 생성
    voiceStream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    }); // 오디오스트림 생성

    const tracks = [
      ...desktopStream.getVideoTracks(),
      ...mergeAudioStreams(desktopStream, voiceStream),
    ];

    stream = new MediaStream(tracks);

    blobs = [];

    rec = new MediaRecorder(stream, {
      mimeType: 'video/webm; codecs=vp9,opus',
    }); // mediaRecorder객체 생성
    rec.ondataavailable = e => blobs.push(e.data);
    rec.onstop = async () => {
      blob = new Blob(blobs, { type: 'video/webm' });
      let url = window.URL.createObjectURL(blob);
      download.href = url;
      download.download = 'test.webm';
      download.style.display = 'block';
    };
    // startBtn.disabled = true; // 시작 버튼 비활성화
    // stopBtn.disabled = false; // 종료 버튼 활성화
    rec.start(); // 녹화 시작
  };

  const stopHandler = () => {
    console.log(rec);
    if (!rec) return; // 녹화가 종료된 경우 종료
    // 종료 버튼을 누른 경우
    // 버튼 비활성화
    startBtn.disabled = true;
    stopBtn.disabled = true;
    rec.stop(); // 화면녹화 종료 및 녹화된 영상 다운로드

    desktopStream?.getTracks().forEach(s => s.stop());
    voiceStream?.getTracks().forEach(s => s.stop());
    desktopStream = null;
    voiceStream = null;

    startBtn.disabled = false; // 시작 버튼 활성화
  };

  useEffect(() => {
    startBtn = startBtnRef.current;
    stopBtn = stopBtnRef.current;
    download = downloadRef.current;
  }, [startBtnRef.current, stopBtnRef.current, downloadRef.current]);

  return (
    <>
      <button id="startBtn" ref={startBtnRef} onClick={startHandler}>
        start
      </button>
      <button id="stopBtn" ref={stopBtnRef} onClick={stopHandler}>
        stop
      </button>
      <a id="download" ref={downloadRef}>
        download
      </a>
    </>
  );
}

export default Record;
