/* eslint-disable @next/next/no-img-element */
import type { Snapshot as SnapshotType } from "types";

import { useEffect, useState } from "react";
import { useFetch } from "usehooks-ts";

const API_SNAPSHOT_URL = "/api/screenshot";

type MintSnapshotScreenshotComponentProps = {
  snapshot: SnapshotType;
  children: React.ReactNode;
  onSuccess: (data) => void;
  onError: (error) => void;
};

type Response = {
  screenshotUrl: string;
};

interface ImageWithRetryComponentProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  maxRetries?: number;
  retryDelay?: number;
  onSuccess?: () => void;
}

export default function MintSnapshotScreenshotComponent({
  snapshot,
  children,
  onSuccess,
  onError,
}: MintSnapshotScreenshotComponentProps) {
  const { data, error } = useFetch<Response>(API_SNAPSHOT_URL, {
    method: "POST",
    body: JSON.stringify(snapshot),
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (error) {
      console.error(error);
      onError(error);
    }
  }, [error]);

  return (
    <>
      {!isLoaded && children}

      {data && (
        <picture style={{ display: isLoaded ? "block" : "none" }}>
          <ImageWithRetry
            src={data.screenshotUrl}
            maxRetries={5}
            retryDelay={1000}
            onSuccess={() => {
              setIsLoaded(true);
              onSuccess(data);
            }}
          />
        </picture>
      )}
    </>
  );
}

function ImageWithRetry({
  src,
  maxRetries = 3,
  retryDelay = 1000,
  onSuccess,
  ...props
}: ImageWithRetryComponentProps) {
  const [retryCount, setRetryCount] = useState(0);

  function handleImageError() {
    if (retryCount < maxRetries) {
      const nextDelay = retryDelay * Math.pow(2, retryCount);
      setTimeout(() => {
        setRetryCount(retryCount + 1);
      }, nextDelay);
    }
  }

  function handleImageLoad() {
    if (onSuccess) {
      onSuccess();
    }
  }

  const key = `${src}-${retryCount}`;

  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <img
      key={key}
      src={src}
      onError={handleImageError}
      onLoad={handleImageLoad}
      {...props}
    />
  );
}
