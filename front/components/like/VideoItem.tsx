import Image from 'next/image';
import axios from 'axios';
import styles from '@/styles/contest/ContestListItem.module.scss';
import { RecordInfo } from '@/pages/like';
import { getCookie } from '@/util/cookie';

function VideoItem(props: { info: RecordInfo }) {
  // key 필요하면 받아놓기
  const { info } = props;
  const { recordingId, file, title, singer } = info;
  const urlInfo = `${file}#t=0.5`;
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
            <button
              type="button"
              className={styles.addBtn}
              onClick={() => {
                axios
                  .post(`api/v1/singing-contest/${recordingId}`, null, {
                    headers: {
                      Authorization: `${getCookie('Authorization')}`,
                      refreshToken: `${getCookie('refreshToken')}`,
                    },
                  })
                  .then(res => {
                    console.log(res.data);
                  });
              }}
            >
              글작성
            </button>
            <button
              type="button"
              className={styles.deleteBtn}
              onClick={() => {
                axios
                  .delete(`api/v1/recording/${recordingId}`, {
                    headers: {
                      Authorization: `${getCookie('Authorization')}`,
                      refreshToken: `${getCookie('refreshToken')}`,
                    },
                  })
                  .then(res => {
                    console.log(res.data);
                  });
              }}
            >
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoItem;
