import Image from 'next/image';
import styles from '@/styles/login/LoginModal.module.scss';

function LoginModal({ setModalOpen }: any) {
  // 모달창 open 여부
  const closeModal = () => {
    setModalOpen(false);
  };

  // 카카오 로그인 함수 .. 간편 로그인 요청
  const loginFormWithKakao = () => {
    // 현재 창에 로그인 창 띄우기 -> 인가코드 전달
    window.Kakao.Auth.authorize({
      redirectUri: process.env.NEXT_PUBLIC_KAKAO_REDIRECTURI,
    });
    // 로그인 요청 (백엔드 redirect URI로 연결)
    if (process.env.NEXT_PUBLIC_LOGIN_REDIRECTURI) {
      window.location.href = process.env.NEXT_PUBLIC_LOGIN_REDIRECTURI;
    }
  };
  return (
    <div className={styles.back}>
      <div className={styles.container}>
        <div className={styles.top}>
          <button type="button" className={styles.close} onClick={closeModal}>
            <Image
              src="img/common/common_close_image.svg"
              alt="close"
              width={25}
              height={25}
            />
          </button>
        </div>
        <div className={styles.main}>
          <div className={styles.title}>Log in</div>
          <div className={styles.icon}>
            <Image
              src="img/login/login_kakao_image.svg"
              alt="kakao"
              width={80}
              height={80}
              className={styles.kakao}
              onClick={loginFormWithKakao}
            />
            <div className={styles.iconName}>Kakako</div>
          </div>
          <div className={styles.terms}>
            회원가입 없이 소셜 계정을 통해 바로 이용 가능하며 첫 로그인시 <br />
            <b>이용약관</b>및 <b>개인정보처리방침</b> 동의로 간주됩니다.
          </div>
        </div>
        <div className={styles.bottom}>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={loginFormWithKakao}
          >
            <Image
              src="img/login/login_kakao_icon_image.svg"
              width={20}
              height={20}
              alt="kakao"
              className={styles.icon}
            />
            카카오 계정으로 로그인
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
