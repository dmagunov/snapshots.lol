import type { Theme } from "../index";

export const theme: Theme = {
  breakpoints: {
    mobile: "600px",
  },
  snapshot: {
    backgroundColor: "#490043",
    scale: 0.6
  },
  board: {
    backgroundColor: "transparent",
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
    backgroundColor: "transparent",
    color: "#fff500",
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
  return <div>{children}</div>;
};

export const SnapshotBoardFrame = ({ children }: Props) => {
  return <div>{children}</div>;
};
