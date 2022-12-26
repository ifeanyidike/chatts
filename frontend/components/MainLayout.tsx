import { NextComponentType, NextPageContext } from 'next';
import SocketProvider from './SocketProvider';

const MainLayout: NextComponentType<NextPageContext, any, any> = (
  props: any
) => {
  return <SocketProvider>{props.children}</SocketProvider>;
};

export default MainLayout;
