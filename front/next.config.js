/** @type {import('next').NextConfig} */
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
        source: '/:path*',
        // destination: 'http://i8b302.p.ssafy.io:8080/:path*',
        destination: 'http://192.168.31.64:8000/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
