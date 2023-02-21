import { Html, Head, Main, NextScript } from 'next/document';
// import { env } from 'process';

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        {/* 카카오 API 사용을 위한 SDK 스크립트 추가 */}
        <script src="https://developers.kakao.com/sdk/js/kakao.min.js" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Miniver&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Miniver&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://webfontworld.github.io/goodchoice/Jalnan.css"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
