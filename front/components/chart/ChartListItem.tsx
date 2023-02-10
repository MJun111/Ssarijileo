import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import classNames from 'classnames';
import styles from '@/styles/chart/ChartListItem.module.scss';
import { RootState } from '@/redux/store';

function ChartListItem(props: {
  item: { rank: number; title: string; singer: string; album: string };
}) {
  const { item } = props;

  // 다크모드 상태관리
  const [themeMode, setThemeMode] = useState('light');
  const [likeMode, setLikeMode] = useState(false);
  const [modalMode, setModalMode] = useState(false);

  const storeTheme = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    const theme = storeTheme.theme || 'light';
    setThemeMode(theme);
  }, [storeTheme]);

  const changeLike = () => {
    setModalMode(true);
  };

  const modalText = likeMode
    ? `${item.title}을(를) 찜목록에서 삭제하시겠습니까 ?`
    : `${item.title}을(를) 찜목록에 추가하시겠습니까 ?`;

  const heartIcon = likeMode
    ? `img/chart/${themeMode}/${themeMode}_like_image.svg`
    : `img/chart/${themeMode}/${themeMode}_chart_unlike_image.svg`;
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
    [styles.isLong]: item.album.length > 20,
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
        <div className={styles.img}>커버</div>
        <div className={styles.rank}>{item.rank}</div>
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
