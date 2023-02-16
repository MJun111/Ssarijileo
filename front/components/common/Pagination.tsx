import { useState } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import styles from '@/styles/common/Pagination.module.scss';

type PaginationProps = {
  totalPosts: number;
  limit: number;
  page: number;
  setPage: any;
};

function Pagination({ totalPosts, limit, page, setPage }: PaginationProps) {
  const [currPage, setCurrPage] = useState(page);

  const storeTheme = useSelector((state: RootState) => state.theme);
  const { theme } = storeTheme;

  const firstIcon = `img/common/${theme}/${theme}_first_image.svg`;
  const prevIcon = `img/common/${theme}/${theme}_prev_image.svg`;
  const nextIcon = `img/common/${theme}/${theme}_next_image.svg`;
  const lastIcon = `img/common/${theme}/${theme}_last_image.svg`;

  // 한 페이지에 보여줄 아이템 개수, 아이템 list 전달받기
  const firstNum = currPage - (currPage % 5) + 1;

  // 전체 페이지 수
  const numPages = Math.ceil(totalPosts / limit);

  // 생성할 태그 번호 배열에 담기
  let num = 5;
  if (numPages < firstNum + 4) {
    num = numPages % 5;
  }

  const arr: number[] = [];

  // 배열 돌면서 태그 생성
  for (let i = firstNum; i < firstNum + num; i++) {
    arr.push(i);
  }

  const pageBtn = arr.map(i => {
    const btnClass = classNames({
      [styles.btn]: true,
      [styles.nowPage]: i === page,
    });
    return (
      <button
        key={i}
        type="button"
        className={btnClass}
        onClick={() => {
          setPage(i);
        }}
      >
        {i}
      </button>
    );
  });

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.btn}
        onClick={() => {
          setPage(1);
          setCurrPage(1);
        }}
        disabled={page === 1}
      >
        <Image src={firstIcon} width={14} height={14} alt="first" />
      </button>
      <button
        type="button"
        className={styles.btn}
        onClick={() => {
          setPage(page - 1);
          setCurrPage(page - 2);
        }}
        disabled={page === 1}
      >
        <Image src={prevIcon} width={14} height={14} alt="prev" />
      </button>
      {pageBtn}

      <button
        type="button"
        className={styles.btn}
        onClick={() => {
          setPage(page + 1);
          setCurrPage(page);
        }}
        disabled={page === numPages}
      >
        <Image src={nextIcon} width={14} height={14} alt="next" />
      </button>
      <button
        type="button"
        className={styles.btn}
        onClick={() => {
          setPage(numPages);
          setCurrPage(numPages);
        }}
        disabled={page === numPages}
      >
        <Image src={lastIcon} width={14} height={14} alt="last" />
      </button>
    </div>
  );
}

export default Pagination;
