import type { Theme } from "../index";

import { DEFAULT_SIZE, DEFAULT_ICON_POSITION } from "./config";

import CinematicFrame from "./CinematicFrame/CinematicFrame";

import LeftCenterIcon from "./images/left-center.svg";
import RightCenterIcon from "./images/right-center.svg";

export const theme: Theme = {
  breakpoints: {
    mobile: "600px",
  },
  snapshot: {
    backgroundColor: "#3fcc66",
  },
  title: {
    color: "#fff",
    backgroundColor: "inherit",
    fontSize: "2.5rem",
    padding: "1rem 4rem",
    fontWeight: "normal",
  },
  block: {
    fontSize: "3rem",
    backgroundColor: "transparent",
    color: "#000",
    fontFamily: `"IBM Plex Sans", sans-serif`,
  },
  meta: {
    fontFamily: `"IBM Plex Mono", monospace`,
    color: "#fff",
    fontSize: "1.5rem",
    fontWeight: "700",
  },
};

type Props = {
  children: React.ReactNode;
};

export const SnapshotTitleFrame = ({ children }: Props) => {
  return <CinematicFrame size={18}>{children}</CinematicFrame>;
};

export const SnapshotBoardFrame = ({ children }: Props) => {
  const size = 60;

  const koef = size / DEFAULT_SIZE;

  const iconHeight = koef * DEFAULT_SIZE;
  const iconWidth = koef * 6;
  const iconPosition = koef * DEFAULT_ICON_POSITION;

  const iconStyles = {
    position: "absolute",
    width: `${iconWidth}px`,
    height: `${iconHeight}px`,
  };

  const leftCenterIconStyles = Object.assign({}, iconStyles, {
    left: `${iconPosition}px`,
    top: `calc(50% - ${iconHeight / 2}px)`,
  });

  const rightCenterIconStyles = Object.assign({}, iconStyles, {
    right: `${iconPosition}px`,
    top: `calc(50% - ${iconHeight / 2}px)`,
  });

  return (
    <CinematicFrame size={size}>
      <LeftCenterIcon style={leftCenterIconStyles} />
      <RightCenterIcon style={rightCenterIconStyles} />
      {children}
    </CinematicFrame>
  );
};
