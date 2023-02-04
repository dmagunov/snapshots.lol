import type { Theme } from "../index";
import styled from "styled-components";

import BorderImage from "./images/frame-112px.png";

export const theme: Theme = {
  breakpoints: {
    mobile: "600px",
  },
  snapshot: {
    backgroundColor: "#FFF500",
  },
  title: {
    color: "#200C71",
    backgroundColor: "#FABE21",
    fontSize: "2.5rem",
    fontWeight: "500",
    padding: "1rem 4rem",
  },
  block: {
    fontSize: "3rem",
    backgroundColor: "transparent",
    color: "#000",
    fontFamily: `"IBM Plex Sans", sans-serif`,
  },
  meta: {
    fontFamily: `"IBM Plex Mono", monospace`,
    color: "#200C71",
    fontSize: "1.5rem",
    fontWeight: "500",
  },
};

type Props = {
  children: React.ReactNode;
};

const SnapshotTitleFrameContainer = styled.div`
  border: 5px solid #896a08;
`;

export const SnapshotTitleFrame = ({ children }: Props) => {
  return <SnapshotTitleFrameContainer>{children}</SnapshotTitleFrameContainer>;
};

const SnapshotBoardFrameContainer = styled.div`
  border: 56px solid;
  border-image: url("${BorderImage.src}") round;
  border-image-slice: 112;
  border-image-width: 56px;
`;

export const SnapshotBoardFrame = ({ children }: Props) => {
  return <SnapshotBoardFrameContainer>{children}</SnapshotBoardFrameContainer>;
};
