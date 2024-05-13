import { useEffect } from 'react';

const useDisableBackground = (isRendered, stateName) => {
  useEffect(() => {
    if (isRendered) {
      document.body.classList.add('body-disabled-scroll');
      document.querySelector('.home').classList.add('home-backdrop');
      if (stateName === 'postModal') {
        document
          .querySelector('.main-page')
          .append(document.querySelector('.post-modal'));
      }
    }

    return () => {
      document.body.classList.remove('body-disabled-scroll');
      document.querySelector('.home').classList.remove('home-backdrop');
    };
  }, [isRendered]);
};

export default useDisableBackground;
