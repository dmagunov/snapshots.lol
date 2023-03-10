import { createGlobalStyle } from "styled-components";
import { normalize } from "styled-normalize";

const editorPeersSelectionColors = [
  "#ffedd5",
  "#dcfce7",
  "#e0f2fe",
  "#ede9fe",
  "#ffe4e6",
  "#fef3c7",
  "#ecfccb",
  "#fae8ff",
];

const editorPeersBackgroundColors = [
  "#fb923c",
  "#4ade80",
  "#38bdf8",
  "#a78bfa",
  "#fb7185",
  "#fbbf24",
  "#a3e635",
  "#e879f9",
];

const editorPeerStyles = editorPeersSelectionColors.map((color, index) => {
  return `
    .ySelection-${index} {
      background-color: ${color};
    }
    .yBackground-${index} {
      background-color: ${editorPeersBackgroundColors[index]};
    }
    .yBorder-${index} {
      border-color: ${editorPeersBackgroundColors[index]};
    }
  `;
});

export default createGlobalStyle`
  ${normalize}
  
  html, body, #__next {
      height: 100%;
      width: 100%;
  }
  html {
    font-size: 62.5%;
    scroll-behavior: smooth;
  }
  body {
      margin: 0;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      min-height: 100svh;
      overflow-y: overlay;
      overscroll-behavior-y: none;
      background-color: #490043;
      font-family: "IBM Plex Sans", sans-serif;
  }
  a, img {
      user-select: none; 
      user-drag: none;
  }

  ${editorPeerStyles.join("")}

  .ySelectionHead {
    border-style: solid;
    position: absolute;
    box-sizing: border-box;
    height: 100%;
    border-left-width: 1px;
    border-top-width: 1px;
    border-bottom-width: 1px;
  }
`;
