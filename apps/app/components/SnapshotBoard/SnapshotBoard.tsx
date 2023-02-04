import type { SnapshotBlock } from "types";

import { memo } from "react";

import "lib/utils";

import SnapshotBoardBlock from "./SnapshotBoardBlock";
import { SnapshotBoardRow } from "./SnapshotBoard.styles";

type Props = {
  cols: number;
  rows: number;
  cellWidth: number;
  cellHeight: number;
  blocks: Array<SnapshotBlock>;
};

const getBlock = (
  blocks: Array<SnapshotBlock>,
  col: number,
  row: number
): any => {
  let block = blocks.filterBy("col", col).findBy("row", row);

  if (block) {
    return block;
  }

  return {
    row,
    col,
  };
};

const SnapshotBoard = memo(
  ({
    cols = 0,
    rows = 0,
    cellWidth = 80,
    cellHeight = 80,
    blocks = [],
  }: Props) => {
    cols = cols ? cols : 0;
    rows = rows ? rows : 0;

    let colsArr = Array(cols).fill(0);
    let rowsArr = Array(rows).fill(0);

    return (
      <div className="snapshot-board">
        {colsArr.map((col, i) => (
          <SnapshotBoardRow key={i}>
            {rowsArr.map((row, j) => (
              <SnapshotBoardBlock
                key={`${i}-${j}`}
                width={cellWidth}
                height={cellHeight}
                data={getBlock(blocks, i, j)}
              />
            ))}
          </SnapshotBoardRow>
        ))}
      </div>
    );
  }
);

SnapshotBoard.displayName = "SnapshotBoard";

export default SnapshotBoard;
