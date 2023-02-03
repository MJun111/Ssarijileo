import React, { useEffect, useState } from 'react';
import NextImage from 'next/image';
import { useSelector } from 'react-redux';
import { useComponentSize } from 'react-use-size';
import { useCanvas } from '@/hooks/useCanvas';
import { useAnimation } from '@/hooks/useAnimation';

import Title from '@/components/common/Title';
import TopImg from '@/components/common/TopImg';

import styles from '@/styles/contest/ContestTop.module.scss';

function ContestTop() {
  const [themeMode, setThemeMode] = useState('light');

  const storeTheme = useSelector<any>(state => state.theme);
  useEffect(() => {
    setThemeMode(localStorage.getItem('theme') || 'light');
  }, [themeMode, storeTheme]);

  const { height, width, ref } = useComponentSize();
  const canvasWidth = width;
  const canvasHeight = height;

  const canvasRef = useCanvas(canvasWidth, canvasHeight);

  const noteImages = () => 'img/contest/contest_sparkle_image.svg';
  const noteWindow: {
    speed: {
      x: number;
      y: number;
    };
    start: {
      x: number;
      y: number;
    };
    specific: number;
    size: number;
    life: number;
  }[] = [];

  const animate = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    for (let i = 0; i < noteWindow.length; i++) {
      noteWindow[i].start.x += noteWindow[i].speed.x * 0.7;
      noteWindow[i].start.y += noteWindow[i].speed.y * 0.7;
      noteWindow[i].life -= 1;
      noteWindow[i].size += 0.1;
      if (noteWindow[i].life < 0) {
        noteWindow.splice(i, 1);
      }
    }

    for (let i = 0; i < noteWindow.length; i++) {
      const img = new Image();
      img.src = noteImages(noteWindow[i].specific);
      ctx.drawImage(
        img,
        noteWindow[i].start.x - noteWindow[i].size / 2,
        noteWindow[i].start.y - noteWindow[i].size / 2,
        noteWindow[i].size,
        noteWindow[i].size,
      );
    }
  };

  const onClickParticle = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    for (let i = 0; i < 3; i++) {
      const note = {
        speed: {
          x: Math.random() - 0.5,
          y: -1,
        },
        start: {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        },
        specific: Math.floor(Math.random() * 3) + 1,
        life: Math.random() * 50 + 50,
        size: 0,
      };
      note.size = Math.random() * 10 + 15;
      noteWindow.push(note);
    }
  };

  useAnimation(animate, 0);

  // 1등 2등 3등 정보 받기
  const best = [
    {
      id: 1,
      img: 'video/test.mp4#t=0.5',
      name: '이수민',
    },
    {
      id: 2,
      img: 'video/test.mp4#t=0.5',
      name: '김소윤',
    },
    {
      id: 3,
      img: 'video/test.mp4#t=0.5',
      name: '김명준',
    },
  ];

  const bestData = best.map(item => {
    return (
      <div className={styles.item} key={item.id}>
        <video
          src={item.img}
          className={styles.video}
          preload="metadata"
          controlsList="nodownload"
          controls
        />
        <div className={styles.name}>{item.name}</div>
      </div>
    );
  });

  const titleContent = {
    main: '싸리질러의\n노래왕은 누구 ?',
    sub: '본인의 노래부르는 모습을 노래자랑 게시판에 공유하여\n 싸리질러 노래왕에 도전해보세요 !',
  };

  return (
    <div className={styles.container} ref={ref}>
      <canvas
        className={styles.canvas}
        ref={canvasRef}
        onClick={onClickParticle}
      />
      <TopImg />
      <div className={styles.topList}>{bestData}</div>
      <NextImage
        src="img/contest/contest_sparkle_image.svg"
        width={60}
        height={60}
        alt="noteB"
        className={styles.heartB}
      />
      <NextImage
        src="img/contest/contest_sparkle_image.svg"
        width={90}
        height={90}
        alt="noteC"
        className={styles.heartC}
      />
      <NextImage
        src="img/contest/contest_sparkle_image.svg"
        width={40}
        height={40}
        alt="noteC"
        className={styles.heartD}
      />
      <NextImage
        src="img/contest/contest_crown_image.svg"
        width={120}
        height={120}
        alt="crown"
        className={styles.crown}
      />
      <Title main={titleContent.main} sub={titleContent.sub} />
    </div>
  );
}

export default ContestTop;
