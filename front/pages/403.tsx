import { useDispatch } from 'react-redux';
import { setLogin } from '@/redux/store/loginSlice';

import styles from '@/styles/error/Error.module.scss';

function Forbidden() {
  const dispatch = useDispatch();
  dispatch(setLogin(false));
  const date = new Date().toLocaleString();
  return (
    <div className={styles.container}>
      <div className={styles.title}>403 Forbidden</div>
      <div className={styles.sub}>
        You don&quot;t have permission to access / on this server.
      </div>
      <div className={styles.context}>
        Meanwhile, check out these fresh ideas:
        <br />
        Please try login again
        <br />
        <br />
        {date}
      </div>
    </div>
  );
}

export default Forbidden;
