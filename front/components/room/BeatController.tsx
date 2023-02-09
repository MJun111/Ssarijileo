import BeatControlBar from '../common/BeatControlBar';

import styles from '@/styles/room/BeatController.module.scss';

function BeatController({ setBeatModal }: any) {
  return (
    <div className={styles.layout}>
      <input
        type="button"
        className={styles.back}
        onClick={() => {
          setBeatModal(false);
        }}
      />
      <div className={styles.container}>
        <div className={styles.context}>
          <div className={styles.title}>박자 조절</div>
          <div className={styles.bar}>
            <BeatControlBar />
          </div>
          <div className={styles.beat}>
            <div className={styles.text}>느리게</div>
            <div className={styles.text}>빠르게</div>
          </div>
        </div>
        <button
          className={styles.btn}
          type="button"
          onClick={() => {
            setBeatModal(false);
          }}
        >
          저장
        </button>
      </div>
    </div>
  );
}

export default BeatController;
