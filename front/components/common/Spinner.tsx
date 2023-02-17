import styles from '@/styles/common/Spinner.module.scss';

function Spinner() {
  return (
    <div className={styles.containner}>
      <div className={styles.line1} />
      <div className={styles.line2} />
      <div className={styles.line3} />
      {/* <div className={styles.spinner}></div> */}
      <div className={styles.context}>loading</div>
    </div>
  );
}

export default Spinner;
