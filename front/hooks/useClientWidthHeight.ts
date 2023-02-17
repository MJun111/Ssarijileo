import React, { useEffect, useState } from 'react';

export const useClientWidthHeight = (ref: React.RefObject<HTMLElement>) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const setWidthHeight = () => {
      if (ref.current) {
        setWidth(ref.current.clientWidth);
        setHeight(ref.current.clientHeight);
      }
    };
    setWidthHeight();

    window.addEventListener('resize', setWidthHeight);

    return () => {
      window.removeEventListener('resize', setWidthHeight);
    };
  }, []);

  return { width, height };
};
