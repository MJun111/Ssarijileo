import Image from 'next/image';
import styles from '@/styles/room/RoomHeader.module.scss';
import ReservList from './ReservList';

function RoomHeader({ leaveRoom, screenShare }: any) {
  return (
    <div className={styles.container}>
      <div className={styles.reservList}>
        <Image
          src="img/ssari/ssari_reserv_image.svg"
          width={49}
          height={46}
          alt="reserv"
          className={styles.reservIcon}
          onClick={screenShare}
        />
        <ReservList />
      </div>
      <Image
        src="img/ssari/ssari_close_image.svg"
        width={41}
        height={38}
        alt="close"
        className={styles.closeIcon}
        onClick={leaveRoom}
      />
    </div>
  );
}

export default RoomHeader;
