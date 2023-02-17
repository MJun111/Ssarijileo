import Image from 'next/image';

import styles from '@/styles/main/Team.module.scss';

function Team(props: { img: { team: string } }) {
  const { img } = props;
  return (
    <div className={styles.team}>
      <Image src={img.team} width={1300} height={800} alt="team" />
    </div>
  );
}

export default Team;
