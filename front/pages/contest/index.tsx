import styles from '@/styles/contest/Contest.module.scss';
import ContestList from '@/components/contest/ContestList';

import ContestTop from '@/components/contest/ContestTop';
import SoundBar from '@/components/common/SoundBar';

function Contest() {
  return (
    <>
      <ContestTop />
      <SoundBar />
      <div className={styles.container}>
        <ContestList />
      </div>
      <SoundBar />
    </>
  );
}

export default Contest;
