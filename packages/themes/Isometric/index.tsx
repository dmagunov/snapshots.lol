import type { Theme } from "../index";
import ShadowBox from "./ShadowBox/ShadowBox";

export const theme: Theme = {
  breakpoints: {
    mobile: "600px",
  },
  snapshot: {
    backgroundColor: "#00acd4",
  },
  board: {
    backgroundColor: "#fff",
  },
  title: {
    color: "#000",
    backgroundColor: "#fff",
    fontSize: "2.5rem",
    padding: "1rem 4rem",
    fontWeight: "normal",
  },
  block: {
    fontSize: "5rem",
    color: "#fff500",
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
  return <ShadowBox size={24}>{children}</ShadowBox>;
};

export const SnapshotBoardFrame = ({ children }: Props) => {
  return <ShadowBox size={90}>{children}</ShadowBox>;
};
