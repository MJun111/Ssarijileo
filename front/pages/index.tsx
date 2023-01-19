import Head from 'next/head';
import { Inter } from '@next/font/google';
import styles from '@/styles/Home.module.scss';
import Header from '@/components/common/Header';

// import Loading from '@/components/Loading';
import Title from '@/components/common/Title';

import Footer from '@/components/common/Footer';

const inter = Inter({ subsets: ['latin'] });

function Home() {
  return (
    <>
      <Head>
        <title>My App</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Miniver&display=swap"
          rel="stylesheet"
        />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <Header />
        {/* <Loading /> */}
        {/* <Title /> */}
        <Footer />
      </main>
    </>
  );
}

export default Home;
