const nextConfig = {
  images: {
    domains: [
      'i1.sndcdn.com',
      'image.genie.co.kr',
      'image.bugsm.co.kr',
      'k.kakaocdn.net',
    ],
  },
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/api/v1/sse/:path*',
        destination: 'http://i8b302.p.ssafy.io:8060/api/v1/sse/:path*',
      },
      {
        source: '/api/v1/friend/invite/:path*',
        destination:
          'http://i8b302.p.ssafy.io:8060/api/v1/friend/invite/:path*',
      },
      {
        source: '/api/v1/friend/request/:path*',
        destination:
          'http://i8b302.p.ssafy.io:8060/api/v1/friend/request/:path*',
      },
      // {
      //   source: '/song-file/:path*',
      //   destination:
      //     'https://ssafy-ssarijileo.s3.ap-northeast-2.amazonaws.com/song-file/:path*',
      // },
      // {
      //   source: '/note-file/:path*',
      //   destination:
      //     'https://ssafy-ssarijileo.s3.ap-northeast-2.amazonaws.com/note-file/:path*',
      // },
      {
        source: '/api/v1/:path*',
        destination: 'http://i8b302.p.ssafy.io:8000/api/v1/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
