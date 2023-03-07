import type { SnapshotBlockTextStyles } from "types";

import styled, { keyframes } from "styled-components";

import { getStyle } from "lib/snapshot";

type SnapshotBoardBlockTextStyledProps = {
  styles?: SnapshotBlockTextStyles;
};

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

export const SnapshotBoardBlock = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  overflow: hidden;
`;

export const SnapshotBoardBlockVideo = styled.div`
  width: 100%;
  position: relative;
  z-index: 1;
  iframe {
    max-width: 100%;
  }
`;

export const SnapshotBoardBlockTweet = styled.div`
  position: relative;
  z-index: 1;
  min-width: 30rem;
`;

export const SnapshotBoardBlockText = styled(
  "div"
)<SnapshotBoardBlockTextStyledProps>`
  position: absolute;
  z-index: 3;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: ${(props) => props.styles?.align ?? "center"};
  padding: ${(props) => props.theme.block?.padding ?? "1rem"};
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-weight: ${(props) =>
    props.styles?.fontWeight ?? props.theme.block?.fontWeight ?? "500"};
  background-color: ${(props) =>
    props.styles?.backgroundColor ?? props.theme.block?.backgroundColor};
  color: ${(props) => props.styles?.color ?? props.theme.block?.color};
  font-family: ${(props) => props.theme.block?.fontFamily};
  text-shadow: ${(props) =>
    props.styles?.textShadow ?? props.theme.block?.textShadow ?? "none"};
  font-size: ${(props) =>
    props.styles?.fontSize ?? props.theme.block?.fontSize};
  pointer-events: none;
`;

export const SnapshotBoardBlockTextContent = styled(
  "div"
)<SnapshotBoardBlockTextStyledProps>`
  flex-grow: 1;
  justify-content: center;
  display: flex;
  align-items: ${(props) =>
    getStyle("valign", props.styles?.valign) ?? "center"};
`;
