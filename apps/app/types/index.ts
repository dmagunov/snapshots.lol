import type { Theme } from "@thenftsnapshot/themes"

export type SnapshotBlockDimensions = {
  width: number;
  height: number;
};

export type SnapshotBlock = {
  row: number;
  col: number;
  tweetId?: string;
  youtubeId?: string;
  text?: string;
  info?: string;
  url?: string;
  image?: string;
  background?: string;
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
  block: SnapshotBlockDimensions;
  board: SnapshotBoard;
  theme: SnapshotTheme;
  blocks: SnapshotBlock[];
};
