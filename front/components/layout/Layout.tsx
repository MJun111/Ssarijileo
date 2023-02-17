import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

import styles from '@/styles/Layout.module.scss';

function Layout(props: any) {
  const { children } = props;
  return (
    <div className={styles.main}>
      <Header />
      {children}
      <Footer />
    </div>
  );
}

export default Layout;
