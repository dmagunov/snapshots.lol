import type { Snapshot as SnapshotType } from "types";
import type { Theme } from "@thenftsnapshot/themes"

import { GetStaticPaths } from "next";

import useLoader from "lib/useLoader";
import API from "lib/api";
import { fromMetaToSnapshot } from "lib/snapshot";
import { EaselDarkLoader, LoaderOverlay } from "components/Loader/Loader";
import SnapshotPage from "components/SnapshotPage/SnapshotPage";
import SnapshotEditor from "components/SnapshotEditor/SnapshotEditor";

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
    fallback: true,
  };
};

export const getStaticProps = async ({ params }: Params) => {
  let snapshot: SnapshotType | null = null;

  try {
    let snapshotMeta = await API.getSnapshotMeta(params.snapshot);
    if (snapshotMeta) {
      snapshot = await fromMetaToSnapshot(snapshotMeta);
    }
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      snapshot,
    },
  };
};

export default function Snapshot({ snapshot, updateTheme }: Props) {
  const isLoading = useLoader();

  if (isLoading) {
    return (
      <LoaderOverlay>
        <EaselDarkLoader />
      </LoaderOverlay>
    );
  }

  if (!snapshot) return (
    <SnapshotEditor updateTheme={updateTheme} />
  );

  return (
    <SnapshotPage
      snapshot={snapshot}
      updateTheme={updateTheme}
    />
  );
  
}
