import type { Snapshot } from "types";
import type { Theme } from "@thenftsnapshot/themes";

import { useTheme } from "styled-components";
import Image from "next/legacy/image";
import { merge as _merge } from "lodash-es";
import { useEffect, useState } from "react";

import {
  SnapshotTitleFrame,
  SnapshotBoardFrame,
} from "@thenftsnapshot/themes/Default";
import { isUrl } from "lib/utils";
import SnapshotTitle from "components/SnapshotTitle/SnapshotTitle";
import GesturesWrapper from "components/GesturesWrapper/GesturesWrapper";
import SnapshotBoard from "components/SnapshotBoard/SnapshotBoard";
import SnapshotMeta from "components/SnapshotMeta/SnapshotMeta";

import { Snapshot as SnapshotContainer } from "./Snapshot.styles";

type SnapshotComponentProps = {
  snapshot: Snapshot;
  updateTheme: (theme: Theme) => void;
};

export default function SnapshotComponent({
  snapshot,
  updateTheme,
}: SnapshotComponentProps) {
  const theme = useTheme();
  // NEXT: use proper type
  const [LazySnapshotTitleFrame, setLazySnapshotTitleFrame] = useState<any>(
    () => SnapshotTitleFrame
  );
  const [LazySnapshotBoardFrame, setLazySnapshotBoardFrame] = useState<any>(
    () => SnapshotBoardFrame
  );

  useEffect(() => {
    async function fetchTheme() {
      const Module = await import(
        `@thenftsnapshot/themes/${snapshot.theme.name}/index`
      );
      const theme = _merge({}, Module.theme, snapshot.theme.styles || {});
      updateTheme(theme);
      setLazySnapshotTitleFrame(() => Module.SnapshotTitleFrame);
      setLazySnapshotBoardFrame(() => Module.SnapshotBoardFrame);
    }

    fetchTheme();
  }, [snapshot.theme.name, snapshot.theme.styles]);

  return (
    <SnapshotContainer
      backgroundImage={
        theme.snapshot?.backgroundImage &&
        isUrl(theme.snapshot?.backgroundImage)
          ? theme.snapshot?.backgroundImage
          : undefined
      }
    >
      {/* NEXT: refactor, we do not need to use next image, all images are remote */}
      {theme.snapshot?.backgroundImage &&
        !isUrl(theme.snapshot.backgroundImage) && (
          <Image
            alt=""
            src={theme.snapshot.backgroundImage}
            layout={theme.snapshot?.backgroundLayout || "fill"}
            objectFit={theme.snapshot?.backgroundFit || "cover"}
            priority={true}
            quality={90}
          />
        )}

      <GesturesWrapper scale={1} zIndex={2} top={"20px"}>
        <LazySnapshotTitleFrame>
          <SnapshotTitle title={snapshot.name} />
        </LazySnapshotTitleFrame>
      </GesturesWrapper>

      {/* NEXT: Introduce scale on themeStyles snapshot object */}
      <GesturesWrapper scale={theme.snapshot?.scale || 1} zIndex={3}>
        <LazySnapshotBoardFrame>
          <SnapshotBoard
            cols={snapshot.board.cols}
            rows={snapshot.board.rows}
            cellWidth={snapshot.block.width}
            cellHeight={snapshot.block.height}
            blocks={snapshot.blocks}
          ></SnapshotBoard>
        </LazySnapshotBoardFrame>
      </GesturesWrapper>
      <SnapshotMeta snapshot={snapshot} />
    </SnapshotContainer>
  );
}
