import Image from 'next/image';
import { videoInfo } from '@/components/like/Video';
import styles from '@/styles/contest/ContestListItem.module.scss';

type VideoProps = {
  info: videoInfo;
};

function VideoItem({ info }: VideoProps) {
  // key 필요하면 받아놓기
  const { url, title, singer } = info;
  const urlInfo = `${url}#t=0.5`;
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <video
          className={styles.video}
          src={urlInfo}
          preload="metadata"
          controlsList="nodownload"
          controls
        >
          <track kind="captions" />{' '}
        </video>
        <div className={styles.info}>
          <div className={styles.bottom}>
            <div className={styles.song}>
              <Image
                src="img/contest/contest_headphone_image.svg"
                width={24}
                height={24}
                alt="crown"
                className={styles.songIcon}
              />
              <div>
                {title}-{singer}
              </div>
            </div>
            <button type="button" className={styles.btn}>
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoItem;
