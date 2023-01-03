import { Inter } from '@next/font/google';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import React from 'react';
import LogoutIcon from '@mui/icons-material/Logout';

const inter = Inter({ subsets: ['latin'] });
const Header = () => {
  const { data: session } = useSession();

  return (
    <div className={`header ${inter.className}`}>
      <div className="header__left">
        <span>Cha</span>
        <span>tts</span>
      </div>
      {session?.user?.image && (
        <div className="header__right">
          <div className="profile">
            <Image
              src={session.user.image}
              alt="user profile pic"
              width="35"
              height="35"
              className="profile"
            />
          </div>

          <div className="tooltip" onClick={() => signOut()}>
            <LogoutIcon className="logout" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
