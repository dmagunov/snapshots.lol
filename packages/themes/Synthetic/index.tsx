import type { Theme } from "../index";
import styled from "styled-components";

import BorderImage from "./images/frame-112px.png";

export const theme: Theme = {
  breakpoints: {
    mobile: "600px",
  },
  snapshot: {
    backgroundColor: "#0a2d37",
  },
  title: {
    color: "#00fff8",
    backgroundColor: "#003c3f",
    fontSize: "2.5rem",
    fontWeight: "300",
    fontFamily: `"IBM Plex Mono", monospace`,
    padding: "1rem 4rem",
  },
  block: {
    color: "#fff",
    fontSize: "2rem",
    fontFamily: `"IBM Plex Mono", monospace`,
    fontWeight: "300",
    backgroundColor: "transparent",
    padding: "3rem",
  },
  meta: {
    fontFamily: `"IBM Plex Mono", monospace`,
    color: "#00fff8",
    fontSize: "1.5rem",
    fontWeight: "300",
  },
};

type Props = {
  children: React.ReactNode;
};

const SnapshotTitleFrameContainer = styled.div`
  border: 20px solid;
  border-image: url("${BorderImage.src}") round;
  border-image-slice: 36;
  border-image-width: 20px;
  display: flex;
  align-items: stretch;
`;

export const SnapshotTitleFrame = ({ children }: Props) => {
  return <SnapshotTitleFrameContainer>{children}</SnapshotTitleFrameContainer>;
};

const SnapshotBoardFrameContainer = styled.div`
  border: 72px solid;
  border-image: url("${BorderImage.src}") round;
  border-image-slice: 36;
  border-image-width: 72px;
`;

export const SnapshotBoardFrame = ({ children }: Props) => {
  return <SnapshotBoardFrameContainer>{children}</SnapshotBoardFrameContainer>;
};
