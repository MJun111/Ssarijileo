import * as data from '@/constants/SoundBarData';
import { useCanvas } from '@/hooks/useCanvas';
import { useAnimation } from '@/hooks/useAnimation';

import styles from '@/styles/common/SoundBar.module.scss';

function SoundBar() {
  const noteTable = new Array(data.BAR_NUM);
  for (let i = 0; i < data.BAR_NUM; i++) {
    noteTable[i] = Math.ceil(Math.random() * data.NOTE_HEIGHT);
    if (i !== 0 && noteTable[i] === noteTable[i - 1]) {
      noteTable[i] = (noteTable[i] + data.NOTE_HEIGHT / 2) % data.NOTE_HEIGHT;
    }
  }
  const DOWN_FLAG = new Array(data.BAR_NUM).fill(false);
  const canvasWidth = data.WIDTH;
  const canvasHeight = data.HEIGHT;
  const canvasRef = useCanvas(-1, -1);

  const draw = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    const barWidth = canvasWidth / data.BAR_NUM;
    const barHeight = canvasHeight / data.NOTE_HEIGHT;
    let x = 5;
    let y = canvasHeight;

    for (let i = 0; i < data.BAR_NUM; i++) {
      for (let j = 0; j <= noteTable[i] + 1; j++) {
        const gradient = ctx.createLinearGradient(
          x,
          y,
          x + barWidth - 10,
          y + barHeight / 2,
        );
        const startColor = data.COLOR.map(
          (color, index) => color + data.PLUS[index] * j,
        );
        gradient.addColorStop(
          0,
          `rgba(${startColor[0]}, ${startColor[1]}, ${startColor[2]})`,
        );
        const endColor = data.COLOR.map(
          (color, index) => color + data.PLUS[index] * (j + 1),
        );
        gradient.addColorStop(
          1,
          `rgba(${endColor[0]}, ${endColor[1]}, ${endColor[2]})`,
        );
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth - 10, barHeight / 2, [5, 5, 5, 5]);
        ctx.fill();
        y -= barHeight;
      }
      x += barWidth;
      y = canvasHeight;
      noteTable[i] = DOWN_FLAG[i]
        ? noteTable[i] + ((i % 3) + 1)
        : noteTable[i] - ((i % 3) + 1);
      if (noteTable[i] < 0) {
        noteTable[i] = 1;
        DOWN_FLAG[i] = true;
      } else if (noteTable[i] > data.NOTE_HEIGHT) {
        noteTable[i] = data.NOTE_HEIGHT - 1;
        DOWN_FLAG[i] = false;
      }
    }
  };
  useAnimation(draw, 50);

  return (
    <canvas
      width={data.WIDTH}
      height={data.HEIGHT}
      ref={canvasRef}
      className={styles.canvas}
    />
  );
}

export default SoundBar;
