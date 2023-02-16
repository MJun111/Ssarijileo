import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import axios from 'axios';
import styles from '@/styles/contest/ContestListItem.module.scss';
import { RootState } from '@/redux/store';
import { VideoInfo } from '@/pages/contest';
import { getCookie } from '@/util/cookie';

type VideoProps = {
  info: VideoInfo;
};

function ContestListItem({ info }: VideoProps) {
  const { singingContestId, file, nickname, title, singer, likeCount, like } =
    info;
  const [likeMode, setLikeMode] = useState(like);
  const [modalMode, setModalMode] = useState(false);
  const [nowLike, setNowLike] = useState(likeCount);
  const [singId] = useState(singingContestId);

  const storeTheme = useSelector((state: RootState) => state.theme);
  const { theme } = storeTheme;
  const storeUser = useSelector((state: RootState) => state.user);

  const changeLike = () => {
    setModalMode(true);
  };

  const modalText = likeMode
    ? `${info.nickname}님이 부른 ${info.title} 노래\n 좋아요를 취소하시겠습니까 ?`
    : `${info.nickname}님이 부른 ${info.title}노래\n 좋아요를 누르시겠습니까 ?`;

  const heartIcon = likeMode
    ? `img/chart/${theme}/${theme}_like_image.svg`
    : `img/chart/${theme}/${theme}_chart_unlike_image.svg`;
  // 요청 받아서

  // key 필요하면 받아놓기
  const urlInfo = `${file}#t=0.5`;
  return (
    <>
      {modalMode && (
        <div className={styles.layout}>
          <input
            type="button"
            className={styles.back}
            onClick={() => {
              setModalMode(false);
            }}
          />
          <div className={styles.modal}>
            <div className={styles.context}>{modalText}</div>
            <div className={styles.btnList}>
              <button
                className={styles.okBtn}
                type="button"
                onClick={() => {
                  axios
                    .post(
                      'api/v1/singing-contest/like',
                      {
                        singingContestId: singId,
                        isLike: likeMode ? 'N' : 'Y',
                      },
                      {
                        headers: {
                          Authorization: `${getCookie('Authorization')}`,
                          refreshToken: `${getCookie('refreshToken')}`,
                        },
                      },
                    )
                    .then(res => {
                      setNowLike(res.data);
                    });
                  setLikeMode(!likeMode);
                  setModalMode(false);
                }}
              >
                확인
              </button>
              <button
                className={styles.closeBtn}
                type="button"
                onClick={() => {
                  setModalMode(false);
                }}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
      <div className={styles.container}>
        <div className={styles.content}>
          <video
            className={styles.video}
            src={urlInfo}
            preload="metadata"
            controlsList="nodownload"
            controls
          >
            <track kind="captions" />
          </video>
          <div className={styles.info}>
            <div className={styles.top}>
              <div className={styles.name}>
                <Image
                  src="img/contest/contest_profile_image.svg"
                  width={24}
                  height={24}
                  alt="profile"
                  className={styles.profileIcon}
                />
                <div>{nickname}</div>
              </div>
              <div className={styles.like}>
                <span className={styles.count}>{nowLike}</span>
                <span>Like</span>
              </div>
            </div>
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
              {nickname !== storeUser.nickname && (
                <Image
                  src={heartIcon}
                  width={24}
                  height={24}
                  alt="like"
                  className={styles.likeIcon}
                  // 좋아요 버튼 클릭 시
                  onClick={changeLike}
                />
              )}
              {nickname === storeUser.nickname && (
                <button
                  type="button"
                  className={styles.deleteBtn}
                  onClick={() => {
                    axios
                      .put(
                        'api/v1/singing-contest',
                        {
                          singingContestId,
                          status: 'D',
                        },
                        {
                          headers: {
                            Authorization: `${getCookie('Authorization')}`,
                            refreshToken: `${getCookie('refreshToken')}`,
                          },
                        },
                      )
                      .then(res => {
                        console.log(res.data);
                      });
                  }}
                >
                  글삭제
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ContestListItem;
