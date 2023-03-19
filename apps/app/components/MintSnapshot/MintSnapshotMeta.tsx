import type { Snapshot as SnapshotType } from "types";

import { useEffect } from "react";
import { useFetch } from "usehooks-ts";

const API_META_URL = "/api/meta";

type MintSnapshotMetaComponentProps = {
  snapshot: SnapshotType;
  children: React.ReactNode;
  onSuccess: (url: string) => void;
  onError: (error) => void;
};

type Response = {
  url: string;
};

export default function MintSnapshotMetaComponent({
  snapshot,
  children,
  onSuccess,
  onError,
}: MintSnapshotMetaComponentProps) {
  const { data, error } = useFetch<Response>(API_META_URL, {
    method: "POST",
    body: JSON.stringify(snapshot),
  });

  useEffect(() => {
    if (data?.url) {
      onSuccess(data.url);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      onError(error);
    }
  }, [error]);

  if (data) {
    return <></>;
  }

  return <>{children}</>;
}
