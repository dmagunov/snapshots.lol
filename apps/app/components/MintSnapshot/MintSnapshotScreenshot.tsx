import type { Snapshot as SnapshotType } from "types";

import { useEffect } from "react";
import { useFetch } from "usehooks-ts";

const API_SNAPSHOT_URL = "/api/screenshot";

type MintSnapshotScreenshotComponentProps = {
  snapshot: SnapshotType;
  children: React.ReactNode;
  onSuccess: (data) => void;
  onError: (error) => void;
};

type Response = {
  screenshot: string;
};

export default function MintSnapshotScreenshotComponent({
  snapshot,
  children,
  onSuccess,
  onError
}: MintSnapshotScreenshotComponentProps) {
  const { data, error } = useFetch<Response>(API_SNAPSHOT_URL, {
    method: "POST",
    body: JSON.stringify(snapshot)
  });

  useEffect(() => {
    if (data) {
      onSuccess(data);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      console.error(error);
      onError(error);
    }
  }, [error]);

  if (data) {
    return (
      <picture>
        <img src={data.screenshot} alt={snapshot.name} />
      </picture>
    );
  }

  return <>{children}</>;
}
