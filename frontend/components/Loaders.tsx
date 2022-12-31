import React from 'react';

export const ThreeDotLoader = () => {
  return (
    <div className="loader loading">
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export const DoNutLoader = () => <div className="loader donut"></div>;

export const DoNutMultiLoader = () => (
  <div className="loader donut multi"></div>
);

export const RippleLoader = () => <div className="loader ripple"></div>;

export const RippleMultiLoader = () => (
  <div className="loader multi-ripple">
    <div></div>
    <div></div>
  </div>
);

export const FancyLoader = () => (
  <div className="loader fancy-spinner">
    <div className="ring"></div>
    <div className="ring"></div>
    <div className="dot"></div>
  </div>
);
