import { Inter } from '@next/font/google';
import { useSession, signIn, signOut } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'] });
export default function LoginButton() {
  const { data: session } = useSession();
  if (session) {
    return (
      <div className={`auth ${inter.className}`}>
        Signed in as {session?.user?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }
  return (
    <div className={`auth ${inter.className}`}>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </div>
  );
}
