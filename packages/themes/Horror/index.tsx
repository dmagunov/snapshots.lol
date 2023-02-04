import type { Theme } from "../index";
import styled from "styled-components";

import BorderImage from "./images/frame-112px.png";

export const theme: Theme = {
  snapshot: {
    backgroundColor: "#fe0000",
  },
  title: {
    color: "#240000",
    backgroundColor: "#fe0000",
    fontSize: "2.5rem",
    fontWeight: "700",
    fontFamily: `"IBM Plex Mono", monospace`,
    padding: "1rem 4rem",
  },
  block: {
    fontSize: "5rem",
    backgroundColor: "transparent",
    color: "#fff500",
    fontFamily: `"IBM Plex Sans", sans-serif`,
  },
  meta: {
    fontFamily: `"IBM Plex Mono", monospace`,
    color: "#fff",
    fontSize: "1.5rem",
    fontWeight: "500",
  },
};

type Props = {
  children: React.ReactNode;
};

const SnapshotTitleFrameContainer = styled.div`
  border: 4px solid #240000;
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
