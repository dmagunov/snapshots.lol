import type { Snapshot as SnapshotType } from "types";
import type { Theme } from "@thenftsnapshot/themes"

import { GetStaticPaths } from "next";

import useLoader from "lib/useLoader";
import API from "lib/api";
import { fromMetaToSnapshot } from "lib/snapshot";

import ToolBar from "components/ToolBar/ToolBar";
import { EaselDarkLoader, LoaderOverlay } from "components/Loader/Loader";
import PageMeta from "components/PageMeta/PageMeta";
import Snapshot from "components/Snapshot/Snapshot";
import ShareButton from "components/ShareButton/ShareButton";
import IconButton from "components/IconButton/IconButton";

import QuestionIcon from "public/images/question.svg";

type Params = {
  params: {
    snapshot: string;
  };
};

type Props = {
  snapshot: SnapshotType;
  updateTheme: (theme: Theme) => void;
};

export const getStaticPaths: GetStaticPaths = async () => {
  let snapshotSlugs: (string | undefined)[] = [];

  try {
    snapshotSlugs = await API.getSnapshots();
  } catch (error) {
    console.error(error);
  }

  return {
    paths: snapshotSlugs.map((snapshot) => {
      return {
        params: {
          snapshot,
        },
      };
    }),
    fallback: false,
  };
};

export const getStaticProps = async ({ params }: Params) => {
  let snapshot: SnapshotType | null = null;

  try {
    let snapshotMeta = await API.getSnapshotMeta(params.snapshot);
    snapshot = await fromMetaToSnapshot(snapshotMeta);
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      snapshot,
    },
  };
};

export default function SnapshotPage({ snapshot, updateTheme }: Props) {
  const isLoading = useLoader();

  if (isLoading) {
    return (
      <LoaderOverlay>
        <EaselDarkLoader />
      </LoaderOverlay>
    );
  }

  const snapshotImageUrl = API.getSnapshotScreenshotUrl(snapshot.id);

  return (
    <>
      <PageMeta
        title={snapshot.name}
        description={snapshot.description}
        url={snapshot.url}
        image={snapshotImageUrl}
      />
      <Snapshot
        snapshot={snapshot}
        updateTheme={updateTheme}
      />
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
