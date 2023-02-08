import Image from 'next/image';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper';
import 'swiper/swiper.min.css';

import Title from '@/components/common/Title';

import styles from '@/styles/sing/SingTop.module.scss';

function SingTop() {
  const slideContent = [
    {
      id: 1,
      main: '원하는 노래를\n정확히 불러봐요',
      sub: '정확한 음정과 박자를 맞춰 노래를 부르면\n높은 점수를 얻을 수 있습니다.',
    },
    {
      id: 2,
      main: '원하는 노래를\n이어서 불러봐요',
      sub: '친구들과 노래를 선정해서 이어불러봐요.\n힌트도 있으니 너무 걱정마세요.',
    },
    {
      id: 3,
      main: '흩어진 가사를\n맞춰보세요',
      sub: '여기저기 흩어진 가사를\n원곡에 맞게 순서대로 맞춰보세요.',
    },
  ];

  const swiperSlide = slideContent.map(slide => {
    return (
      <SwiperSlide key={slide.id} className={styles.swiperSlide}>
        <Title main={slide.main} sub={slide.sub} />
        <Image
          src="img/common/common_play_image.svg"
          width={600}
          height={358}
          alt="img"
          className={styles.topImg}
        />
      </SwiperSlide>
    );
  });

  return (
    <Swiper
      spaceBetween={50}
      slidesPerView={1}
      loop
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      modules={[Autoplay]}
      className={styles.swiper}
    >
      {swiperSlide}
    </Swiper>
  );
}

export default SingTop;
