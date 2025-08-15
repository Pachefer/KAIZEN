import {useEffect} from 'react';

export const useThemeColor = (color: string) => {
  useEffect(() => {
    let metaTag = document.querySelector('meta[name="theme-color"]');
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('name', 'theme-color');
      document.head.appendChild(metaTag);
    }
    const prevColor = metaTag.getAttribute('content');
    metaTag.setAttribute('content', color);

    return () => {
      if (prevColor) {
        metaTag!.setAttribute('content', prevColor);
      }
    };
  }, [color]);
};
