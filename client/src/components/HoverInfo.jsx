import React from 'react';

const HoverInfo = ({
  isMounted,
  setRenderHoverWindow,
  className,
  children,
  setIsMounted,
}) => {
  const mountedStyle = { animation: 'inAnimation 250ms ease-in' };
  const unmountedStyle = {
    animation: 'outAnimation 270ms ease-out',
    animationFillMode: 'forwards',
  };

  return (
    <div
      className={className}
      style={isMounted ? mountedStyle : unmountedStyle}
      onAnimationEnd={() => {
        if (!isMounted) setRenderHoverWindow(false);
      }}
    >
      {children}
    </div>
  );
};

export default HoverInfo;
