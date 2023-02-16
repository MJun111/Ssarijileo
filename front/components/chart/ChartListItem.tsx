import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import classNames from 'classnames';
import axios from 'axios';
import { RootState } from '@/redux/store';

import type { ChartItem } from '@/pages';

import styles from '@/styles/chart/ChartListItem.module.scss';
import { getCookie } from '@/util/cookie';

function ChartListItem(props: { item: ChartItem }) {
  const { item } = props;

  // 다크모드 상태관리
  const [likeMode, setLikeMode] = useState(item.favoriteSong);
  const [modalMode, setModalMode] = useState(false);

  const storeTheme = useSelector((state: RootState) => state.theme);
  const { theme } = storeTheme;

  const changeLike = () => {
    setModalMode(true);
  };

  const modalText = likeMode
    ? `${item.title}을(를) 찜목록에서 삭제하시겠습니까 ?`
    : `${item.title}을(를) 찜목록에 추가하시겠습니까 ?`;

  const heartIcon = likeMode
    ? `img/chart/${theme}/${theme}_like_image.svg`
    : `img/chart/${theme}/${theme}_chart_unlike_image.svg`;
  // 요청 받아서

  const titleClassName = classNames({
    [styles.title]: true,
    [styles.isLong]: item.title.length > 30,
  });
  const singerClassName = classNames({
    [styles.singer]: true,
    [styles.isLong]: item.singer.length > 15,
  });
  const albumClassName = classNames({
    [styles.album]: true,
    [styles.isLong]: item.album.length > 11,
  });
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
                      'api/v1/song/my',
                      {
                        songId: item.songId,
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
                      console.log(res);
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
        <Image
          src={item.image}
          width={70}
          height={70}
          alt="cover"
          className={styles.img}
        />
        <div className={styles.rank}>{item.ranking}</div>
        <div className={styles.titleCover}>
          <div className={titleClassName}>{item.title}</div>
        </div>
        <div className={styles.singerCover}>
          <div className={singerClassName}>{item.singer}</div>
        </div>
        <div className={styles.albumCover}>
          <div className={albumClassName}>{item.album}</div>
        </div>
        <Image
          src={heartIcon}
          width={20}
          height={20}
          alt="like"
          className={styles.like}
          // 좋아요 버튼 클릭 시
          onClick={changeLike}
        />
      </div>
    </>
  );
}

export default ChartListItem;
