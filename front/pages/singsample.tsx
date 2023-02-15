import OrderSong from '@/components/room/OrderSong';
import PerfectScore from '@/components/room/PerfectScore';

function SingSample() {
  const screenShare = () => {
    console.log(1);
  };
  return (
    <>
      <PerfectScore />
      <OrderSong screenShare={screenShare} />
    </>
  );
}

export default SingSample;
