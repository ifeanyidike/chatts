import { Inter } from '@next/font/google';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });
const Header = () => {
  return (
    <div className={`header ${inter.className}`}>
      <span>Cha</span>
      <span>tts</span>
    </div>
  );
};

export default Header;
