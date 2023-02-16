import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import styles from '@/styles/common/Footer.module.scss';

function Footer() {
  const [themeMode, setThemeMode] = useState('light');
  const storeTheme = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    setThemeMode(storeTheme.theme);
  }, [storeTheme]);

  const socials = [
    {
      name: 'Facebook',
      icon: `icon/footer/${themeMode}/${themeMode}_facebook_icon.svg`,
    },
    {
      name: 'YouTube',
      icon: `icon/footer/${themeMode}/${themeMode}_youtube_icon.svg`,
    },
    {
      name: 'Instagram',
      icon: `icon/footer/${themeMode}/${themeMode}_instagram_icon.svg`,
    },
    {
      name: 'Google',
      icon: `icon/footer/${themeMode}/${themeMode}_google_icon.svg`,
    },
  ];

  const icons = {
    logo: `icon/header/${themeMode}/${themeMode}_logo.svg`,
    phone: `icon/footer/${themeMode}/${themeMode}_phone_icon.svg`,
    place: `icon/footer/${themeMode}/${themeMode}_place_icon.svg`,
  };

  const socialsIcons = socials.map(social => (
    <Image
      key={social.name}
      src={social.icon}
      alt={social.name}
      width={24}
      height={24}
    />
  ));

  if (window.location.pathname === '/room') return null;
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Image
            src={icons.logo}
            alt="home"
            width={300}
            height={200}
            priority
          />
        </div>
        <div className={styles.item}>
          <div className={styles.upper}>
            <Image src={icons.place} alt="phone" width={24} height={24} />
            <span>대전광역시 유성구 덕명동 124</span>
          </div>
          <div className={styles.upper}>
            <Image src={icons.phone} alt="place" width={24} height={24} />
            <span>042-123-4567</span>
          </div>
          <div className={styles.lower}>
            <span>Social Media</span>
            {socialsIcons}
          </div>
        </div>
      </div>
      <div className={styles.about}>
        <div className={styles.left}>
          <span>ABOUT US</span>
          <span>CONTACT US</span>
          <span>HELP</span>
          <span>PRIVACY POLICY</span>
          <span>DISCLAIMER</span>
        </div>
        <div className={styles.right}>
          <span>Copyright© 2023. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
