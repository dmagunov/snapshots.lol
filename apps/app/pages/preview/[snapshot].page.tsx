import type { Snapshot as SnapshotType } from "types";
import type { Theme } from "@thenftsnapshot/themes"

import useLoader from "lib/useLoader";
import API from "lib/api";

import { EaselDarkLoader, LoaderOverlay } from "components/Loader/Loader";
import Snapshot from "components/Snapshot/Snapshot";

type Params = {
  params: {
    snapshot: string;
  };
};

type Props = {
  snapshot: SnapshotType;
  updateTheme: (theme: Theme) => void;
};

export const getServerSideProps = async ({ params }: Params) => {
  let snapshot: SnapshotType;

  try {
    snapshot = await API.getSnapshot(params.snapshot) as unknown as SnapshotType;
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

  return (
    <>
      <Snapshot
        snapshot={snapshot}
        updateTheme={updateTheme}
      />
    </>
  );
}
