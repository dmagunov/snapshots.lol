import type { Theme } from "../index";

import DashedFrame from "./DashedFrame/DashedFrame";

export const theme: Theme = {
  breakpoints: {
    mobile: "600px",
  },
  snapshot: {
    backgroundColor: "#a60000",
  },
  title: {
    color: "#fff",
    backgroundColor: "inherit",
    fontSize: "2.5rem",
    padding: "1rem 4rem",
    fontWeight: "normal",
  },
  block: {
    color: "#fff",
    fontSize: "4rem",
    fontFamily: `"IBM Plex Sans", sans-serif`,
    backgroundColor: "transparent",
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
  return (
    <DashedFrame border={2} shadow={7}>
      {children}
    </DashedFrame>
  );
};

export const SnapshotBoardFrame = ({ children }: Props) => {
  return (
    <DashedFrame border={8} shadow={15}>
      {children}
    </DashedFrame>
  );
};
