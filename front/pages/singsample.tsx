import OrderSong from '@/components/room/OrderSong';

function SingSample() {
  const screenShare = () => {
    console.log(1);
  };
  return <OrderSong screenShare={screenShare} nextSong={undefined} />;
}

export default SingSample;
