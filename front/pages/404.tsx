import styles from '@/styles/error/Error.module.scss';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.title}>404</div>
      <div className={styles.sub}>Oops! Look likes something going wrong</div>
      <div className={styles.context}>
        Page Cannot be found! we’ll have it figured out in no time. <br />
        Menwhile, cheek out these fresh ideas:
      </div>
      <button className={styles.homeBtn} type="button">
        Go to home
      </button>
    </div>
  );
}