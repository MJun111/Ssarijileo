import React from 'react';
import NextImage from 'next/image';
import { useComponentSize } from 'react-use-size';
import { useCanvas } from '@/hooks/useCanvas';
import { useAnimation } from '@/hooks/useAnimation';
import { VideoInfo } from '@/pages/contest';
import Title from '@/components/common/Title';
import TopImg from '@/components/common/TopImg';

import styles from '@/styles/contest/ContestTop.module.scss';

function ContestTop(props: { ranking: VideoInfo[] }) {
  const { ranking } = props;
  const { height, width, ref } = useComponentSize();
  const canvasWidth = width;
  const canvasHeight = height;

  const canvasRef = useCanvas(canvasWidth, canvasHeight);

  const noteImages = () => 'img/contest/contest_sparkle_image.svg';
  const noteWindow: {
    start: {
      x: number;
      y: number;
    };
    size: number;
    life: number;
    delta: number;
  }[] = [];

  // const dy = [2, 1.5, 0, -1.5, -2, -1.5, 0, 1.5, 2];
  // const dx = [0, -1.5, -2, -1.5, 0, 1.5, 2, 1.5, 0];
  const dy = [
    2.5, 1.7, 1, 0, -1, -1.7, -1.7, -1, -1.7, -1.7, -1, 0, 1, 1.7, 2.5,
  ];
  const dx = [
    0, -1, -1.7, -2.5, -2, -1.2, -0.5, 0, 0.5, 1.2, 2, 2.5, 1.7, 1, 0,
  ];

  const animate = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    for (let i = 0; i < noteWindow.length; i++) {
      noteWindow[i].life -= 1;
      noteWindow[i].size += noteWindow[i].delta;
      if (noteWindow[i].life < 0) {
        noteWindow.splice(i, 1);
      }
    }

    for (let i = 0; i < noteWindow.length; i++) {
      const img = new Image();
      img.src = noteImages();
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
    // if (noteWindow.length > 100) return;
    let dir = 0;
    const particle = setInterval(() => {
      const note = {
        start: {
          // x: e.clientX - rect.left + dx[dir] * (20 + Math.random() * 30),
          // y: e.clientY - rect.top + dy[dir] * (20 + Math.random() * 30),
          x: e.clientX - rect.left + dx[dir] * 15,
          y: e.clientY - rect.top + dy[dir] * 15,
        },
        life: 30,
        size: 10,
        delta: 0.3,
      };
      noteWindow.push(note);
      dir += 1;
    }, 30);

    setTimeout(() => {
      clearInterval(particle);
    }, 300 * dy.length);
  };

  useAnimation(animate, 0);

  // 1등 2등 3등 정보 받기
  // const best = [
  //   {
  //     id: 1,
  //     img: 'video/test.mp4#t=0.5',
  //     name: '이수민',
  //   },
  //   {
  //     id: 2,
  //     img: 'video/test.mp4#t=0.5',
  //     name: '김소윤',
  //   },
  //   {
  //     id: 3,
  //     img: 'video/test.mp4#t=0.5',
  //     name: '김명준',
  //   },
  // ];

  const bestData = ranking.map(item => {
    return (
      <div className={styles.item} key={item.singingContestId}>
        <video
          src={item.file}
          className={styles.video}
          preload="metadata"
          controlsList="noDownload"
          controls
        >
          <track kind="captions" />
        </video>
        <div className={styles.name}>{item.nickname}</div>
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
