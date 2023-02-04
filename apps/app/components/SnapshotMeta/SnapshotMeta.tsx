import type { Snapshot } from "types";

import { SnapshotMeta } from "./SnapshotMeta.styles";

type SnapshotMetaComponentProps = {
  snapshot: Snapshot;
};

export default function SnapshotMetaComponent({
  snapshot,
}: SnapshotMetaComponentProps) {
  return (
    <SnapshotMeta>
      <span>Cols: {snapshot.board.cols}</span>
      <span>Rows: {snapshot.board.rows}</span>
      <span>Blocks: {snapshot.blocks.length}</span>
      <span>
        Block size: {snapshot.block.width}px x {snapshot.block.height}px
      </span>
      <span>Theme: {snapshot.theme.name}</span>
      <span>Type: {snapshot.type}</span>
    </SnapshotMeta>
  );
}
