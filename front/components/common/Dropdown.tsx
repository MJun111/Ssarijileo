import { useState, useEffect } from 'react';
import classNames from 'classnames';

import styles from '@/styles/common/Dropdown.module.scss';

function Dropdown(props: { children: React.ReactNode; visible: boolean }) {
  const { children, visible } = props;
  const [animation, setAnimation] = useState(false);
  const [repeat, setRepeat] = useState(0);

  useEffect(() => {
    if (visible) {
      clearTimeout(repeat);
      setRepeat(0);
      setAnimation(true);
    } else {
      const timeoutId = window.setTimeout(() => setAnimation(false), 400);
      setRepeat(timeoutId);
    }
  }, [visible]);

  return (
    <article
      className={classNames(
        visible ? styles.fadeIn : styles.fadeOut,
        styles.dropdown,
      )}
    >
      {animation && children}
    </article>
  );
}

export default Dropdown;
