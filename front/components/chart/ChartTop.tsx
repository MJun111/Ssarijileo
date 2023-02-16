import React, { useEffect, useState } from 'react';
import NextImage from 'next/image';
import { useSelector } from 'react-redux';
import { useComponentSize } from 'react-use-size';
import { useCanvas } from '@/hooks/useCanvas';
import { useAnimation } from '@/hooks/useAnimation';
import { RootState } from '@/redux/store';

import Title from '@/components/common/Title';
import TopImg from '@/components/common/TopImg';

import styles from '@/styles/chart/ChartTop.module.scss';
import { ChartItem } from '@/pages';

function ChartTop(props: {
  day: ChartItem[];
  week: ChartItem[];
  month: ChartItem[];
}) {
  const { day, week, month } = props;
  const storeTheme = useSelector((state: RootState) => state.theme);
  const { theme } = storeTheme;

  const { height, width, ref } = useComponentSize();
  const canvasWidth = width;
  const canvasHeight = height;

  const canvasRef = useCanvas(canvasWidth, canvasHeight);

  const noteImages = (num: number) =>
    `img/chart/${theme}/${theme}_chart_heart${num}_image.svg`;
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

  const heartA = `img/chart/${theme}/${theme}_chart_heart1_image.svg`;
  const heartB = `img/chart/${theme}/${theme}_chart_heart2_image.svg`;
  const heartC = `img/chart/${theme}/${theme}_chart_heart3_image.svg`;
  const heartD = `img/chart/${theme}/${theme}_chart_heart4_image.svg`;

  useAnimation(animate, 0);

  const best = [month[0], week[0], day[0]];
  const category = ['월간', '주간', '일간'];
  const bestData = best.map((item, idx) => {
    if (!item)
      return (
        <div className={styles.item} key={`${category[idx]}-987654321`}>
          <NextImage
            src="img/common/common_headphone_image.svg"
            width={180}
            height={180}
            alt="album"
            className={styles.albumCover}
            onClick={() => {
              window.scrollTo({ top: 1220 + idx * 815, behavior: 'smooth' });
            }}
          />
        </div>
      );
    return (
      <div className={styles.item} key={`${category[idx]}-${item.songId}`}>
        <NextImage
          src={item.image}
          width={180}
          height={180}
          alt="album"
          className={styles.albumCover}
          onClick={() => {
            window.scrollTo({ top: 1220 + idx * 815, behavior: 'smooth' });
          }}
        />
        <div>
          {item.title}-{item.singer}
        </div>
      </div>
    );
  });

  const titleContent = {
    main: '현재 가장 인기 있는\n곡들이에요',
    sub: '싸리질러 사용자들의 노래 재생 시간, 조회수, 사용 정보 등을\n이용해 자체적으로 매긴 순위입니다.',
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
        src={heartA}
        width={50}
        height={50}
        alt="noteA"
        className={styles.heartA}
      />
      <NextImage
        src={heartB}
        width={85}
        height={85}
        alt="noteB"
        className={styles.heartB}
      />
      <NextImage
        src={heartC}
        width={70}
        height={70}
        alt="noteC"
        className={styles.heartC}
      />
      <NextImage
        src={heartD}
        width={60}
        height={60}
        alt="noteC"
        className={styles.heartD}
      />
      <Title main={titleContent.main} sub={titleContent.sub} />
    </div>
  );
}

export default ChartTop;
