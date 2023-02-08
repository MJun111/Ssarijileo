/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['i1.sndcdn.com', 'image.genie.co.kr', 'image.bugsm.co.kr'],
  },
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: 'http://i8b302.p.ssafy.io:8080/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
