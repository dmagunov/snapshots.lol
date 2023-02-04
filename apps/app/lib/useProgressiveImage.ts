import { useEffect, useState } from "react";
import { isUrl } from "./utils";

export default function useProgressiveImage(src: string | undefined) {
  const [sourceIsLoaded, setSourceIsLoaded] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (src && isUrl(src)) {
      const img = new Image();
      img.src = src;
      img.onload = () => setSourceIsLoaded(src);
    }
  }, [src]);

  return sourceIsLoaded;
}
