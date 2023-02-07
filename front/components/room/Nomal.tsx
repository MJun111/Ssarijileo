// import Image from 'next/image';
import styles from '@/styles/room/Nomal.module.scss';

function Nomal() {
  //   const member = 1;
  return (
    <canvas className={styles.container}>
      <div className={styles.main}>
        {/* {참가자 없을 때 } */}
        {/* {member < 2 && <div className={styles.member}></div>} */}
        {/* { 예약목록 없을 때} */}
        {/* { 대기 상태} */}
        {/* {노래 부르는 상태} */}
      </div>
      <div className={styles.section}>
        {/* {노래 부르는 상태} */}
        {/* 대기 상태 */}
      </div>
    </canvas>
  );
}

export default Nomal;
