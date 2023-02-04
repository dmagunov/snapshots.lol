import { useState, useEffect } from "react";
import { useCopyToClipboard } from "react-use";

import IconButton from "components/IconButton/IconButton";

import { CopiedMessage } from "./ShareButton.styles";
import ShareIcon from "public/images/share.svg";

const COPIED_MESSAGE_TIMEOUT = 2000;

type ShareButtonComponentProps = {
  title: string;
  url: string;
};

export default function ShareButtonComponent({
  title,
  url,
}: ShareButtonComponentProps) {
  const [copyToClipboardState, copyToClipboard] = useCopyToClipboard();
  const [isCopied, setCopied] = useState(false);

  const share = () => {
    try {
      navigator.share({
        title: title,
        url: url,
      });
    } catch (error) {
      copyToClipboard(url);
    }
  };

  useEffect(() => {
    if (copyToClipboardState.value) {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, COPIED_MESSAGE_TIMEOUT);
    }
  }, [copyToClipboardState]);

  return (
    <IconButton onClick={share} title={"Copy Link to Snapshot"} role="button">
      <ShareIcon width="20" />
      {isCopied && <CopiedMessage>Copied to Clipboard</CopiedMessage>}
    </IconButton>
  );
}
