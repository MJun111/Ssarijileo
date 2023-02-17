import React from 'react';
import NextImage from 'next/image';
import { useComponentSize } from 'react-use-size';
import { useCanvas } from '@/hooks/useCanvas';
import { useAnimation } from '@/hooks/useAnimation';

import Title from '@/components/common/Title';
import TopImg from '@/components/common/TopImg';

import styles from '@/styles/main/MainTop.module.scss';

function MainTop() {
  const { height, width, ref } = useComponentSize();
  const canvasWidth = width;
  const canvasHeight = height;

  const canvasRef = useCanvas(canvasWidth, canvasHeight);

  const noteImages = (num: number) =>
    `img/common/common_music_note${num}_image.svg`;
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
      noteWindow[i].start.x += noteWindow[i].speed.x;
      noteWindow[i].start.y += noteWindow[i].speed.y;
      noteWindow[i].size -= 1;
      noteWindow[i].life -= 1;
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

  useAnimation(animate, 0);

  const onClickParticle = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    for (let i = 0; i < 3; i++) {
      const note = {
        speed: {
          x: Math.random() * 3 - 1.5,
          y: Math.random() * 3 - 1.5,
        },
        start: {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        },
        specific: Math.floor(Math.random() * 3) + 1,
        life: Math.random() * 10 + 20,
        size: 0,
      };
      note.size = note.life + 25;
      noteWindow.push(note);
    }
  };

  const titleContent = {
    main: ' 집에서 즐기는\n랜선 노래방 싸리질러',
    sub: '집에서 친구들과 화상채팅으로 노래를 부르고\n다양한 게임까지 즐길 수 있습니다.',
  };

  return (
    <div className={styles.container} ref={ref}>
      <canvas
        className={styles.canvas}
        ref={canvasRef}
        onClick={onClickParticle}
      />
      <TopImg />
      <NextImage
        src="img/common/common_microphone_image.svg"
        width={350}
        height={350}
        alt="mic"
        className={styles.mic}
      />
      <NextImage
        src="img/common/common_music_note1_image.svg"
        width={130}
        height={130}
        alt="noteA"
        className={styles.noteA}
      />
      <NextImage
        src="img/common/common_music_note2_image.svg"
        width={160}
        height={160}
        alt="noteB"
        className={styles.noteB}
      />
      <NextImage
        src="img/common/common_music_note3_image.svg"
        width={120}
        height={120}
        alt="noteC"
        className={styles.noteC}
      />
      <Title main={titleContent.main} sub={titleContent.sub} />
    </div>
  );
}

export default MainTop;
