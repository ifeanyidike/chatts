import { Inter } from '@next/font/google';
import React, { useState } from 'react';
import { RiCloseCircleFill, RiSearch2Line } from 'react-icons/ri';

const inter = Inter({ subsets: ['latin'] });
const SearchBar = () => {
  const [searchText, setSearchText] = useState<string>('');
  return (
    <div className={`searchbar ${inter.className}`}>
      <input
        type="text"
        className="searchbar__input"
        placeholder="Search message"
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
      />
      <div className="searchbar__items">
        {searchText && (
          <span className="searchbar__close" onClick={() => setSearchText('')}>
            <RiCloseCircleFill />
          </span>
        )}
        <span className="searchbar__horiz"></span>
        <span className="searchbar__search">
          <RiSearch2Line />
        </span>
      </div>
    </div>
  );
};

export default SearchBar;
