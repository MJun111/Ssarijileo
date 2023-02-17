import styles from '@/styles/room/PitchController.module.scss';

function PitchController({ setPitchModal }: any) {
  return (
    <div className={styles.layout}>
      <input
        type="button"
        className={styles.back}
        onClick={() => {
          setPitchModal(false);
        }}
      />
      <div className={styles.container}>
        <div className={styles.context}>
          💖🎵🎤 다음 업데이트에서 사용해 주세요 🎤🎵💖
        </div>
        <button
          className={styles.btn}
          type="button"
          onClick={() => {
            setPitchModal(false);
          }}
        >
          닫기
        </button>
      </div>
    </div>
  );
}

export default PitchController;
