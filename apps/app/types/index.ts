import type { Theme } from "@thenftsnapshot/themes"

export type SnapshotBlockDimensions = {
  width: number;
  height: number;
};

export type SnapshotBlockTextStyles = {
  align?: string;
  valign?: "top" | "middle" | "bottom";
  color?: string;
  backgroundColor?: string;
  fontSize?: string;
  fontWeight?: string;
  textShadow?: string;
};

export type SnapshotBlockStyles = {
  text?: SnapshotBlockTextStyles;
}

export type SnapshotBlock = {
  row: number;
  col: number;
  tweetId?: string;
  youtubeId?: string;
  text?: string;
  styles?: SnapshotBlockStyles;
  info?: string;
  url?: string;
  image?: string;
  background?: string;
  address?: string;
};

export type SnapshotBoard = {
  cols: number;
  rows: number;
};

export type SnapshotTheme = {
  name: string;
  styles?: Theme;
};

export type Snapshot = {
  name: string;
  url: string;
  id: string;
  type: string;
  image?: string;
  description?: string;
  block: SnapshotBlockDimensions;
  board: SnapshotBoard;
  theme: SnapshotTheme;
  blocks: SnapshotBlock[];
};
