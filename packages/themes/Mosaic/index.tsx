import type { Theme } from "../index";
import styled from "styled-components";

import BorderImage from "./images/frame-112px.png";

export const theme: Theme = {
  breakpoints: {
    mobile: "600px",
  },
  snapshot: {
    backgroundColor: "#f6f6ef",
  },
  title: {
    color: "#fff",
    backgroundColor: "#f06827",
    fontSize: "2.5rem",
    fontWeight: "500",
    fontFamily: `"IBM Plex Mono", monospace`,
    padding: "2rem 4rem",
  },
  block: {
    fontSize: "2rem",
    fontFamily: `"IBM Plex Mono", monospace`,
    backgroundColor: "transparent",
    color: "#000",
    fontWeight: "400",
    padding: "3rem",
  },
  meta: {
    fontFamily: `"IBM Plex Mono", monospace`,
    color: "#292929",
    fontSize: "1.5rem",
    fontWeight: "700",
  },
};

type Props = {
  children: React.ReactNode;
};

export const SnapshotTitleFrame = ({ children }: Props) => {
  return <>{children}</>;
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
