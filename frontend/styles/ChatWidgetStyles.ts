import styled from 'styled-components';
import { Inter } from '@next/font/google';
const inter = Inter({ subsets: ['latin'] });

export const ChatWidgetContainer = styled.div.attrs(props => ({
  ...inter.style,
}))`
  position: relative;
  .chatwidget__commentarea {
    width: 100%;
    min-height: 400px;
  }
  .chatwidget__emojiopener {
    position: absolute;
    bottom: 0;
    left: 10px;
  }
  .chatwidget__emojipicker {
    position: absolute;
    bottom: 0;
  }
  .chatwidget__input {
    border-radius: 10px;
    resize: none;
    height: 57px;
    transition: height 0.1s ease-in;
    width: 100%;
    background-color: #ecebeb;
    padding: 20px;
    padding-left: 40px;
  }
`;
