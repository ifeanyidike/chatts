import '../styles/globals.css';
import '../styles/main.sass';
import '../styles/loaders.sass';
import '../styles/chatwidget.sass';
import '../styles/chatview.sass';
import '../styles/sidebar.sass';
import '../styles/chatbar.sass';
import '../styles/searchbar.sass';
import '../styles/chatlist.sass';
import '../styles/chatitem.sass';
import '../styles/messagepane.sass';
import '../styles/messagelist.sass';
import '../styles/paneheader.sass';
import '../styles/messageinput.sass';
import type { AppProps } from 'next/app';
import MainLayout from '../components/MainLayout';
import { SessionProvider } from 'next-auth/react';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </SessionProvider>
  );
}
