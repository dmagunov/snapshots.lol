import type { Snapshot as SnapshotType } from "types";
import type { Theme } from "@thenftsnapshot/themes";

import ToolBar from "components/ToolBar/ToolBar";
import PageMeta from "components/PageMeta/PageMeta";
import Snapshot from "components/Snapshot/Snapshot";
import ShareButton from "components/ShareButton/ShareButton";
import IconButton from "components/IconButton/IconButton";

import QuestionIcon from "public/images/question.svg";

type SnapshotPageComponentProps = {
  snapshot: SnapshotType;
  updateTheme: (theme: Theme) => void;
};

export default function SnapshotPageComponent({
  snapshot,
  updateTheme,
}: SnapshotPageComponentProps) {
  return (
    <>
      <PageMeta
        title={snapshot.name}
        description={snapshot.description}
        url={snapshot.url}
        image={snapshot.image}
      />
      <Snapshot snapshot={snapshot} updateTheme={updateTheme} />
      <ToolBar>
        <ShareButton title={snapshot.name} url={snapshot.url} />

        <IconButton
          href={"https://thenftsnapshot.com"}
          title="About TheNFTSnapshot"
          target="_blank"
          data-track-element="snapshot-questionmark-button"
        >
          <QuestionIcon width="20" />
        </IconButton>
      </ToolBar>
    </>
  );
}
