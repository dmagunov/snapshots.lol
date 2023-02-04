import type { SnapshotBlock } from "types";

import { TwitterTweetEmbed } from "react-twitter-embed";
import Image from "next/image";
import YouTube from "react-youtube";

import useProgressiveImage from "lib/useProgressiveImage";
import { isUrl } from "lib/utils";

import {
  SnapshotBoardBlock,
  SnapshotBoardBlockVideo,
  SnapshotBoardBlockTweet,
  SnapshotBoardBlockText,
  SnapshotBoardBlockTextContent,
} from "./SnapshotBoardBlock.styles";

const YOUTUBE_OPTIONS = {
  playerVars: {
    controls: 1,
    autoplay: 0,
    mute: 1,
    playsinline: 1,
    rel: 0,
  },
};

type SnapshotBoardBlockComponentProps = {
  width: number;
  height: number;
  data: SnapshotBlock;
};

export default function SnapshotBoardBlockComponent({
  width = 80,
  height = 80,
  data,
  ...props
}: SnapshotBoardBlockComponentProps) {
  const isImageLoaded = useProgressiveImage(data.image);

  return (
    <SnapshotBoardBlock
      title={data.info}
      style={getStyles(data, width, height, isImageLoaded)}
      onClick={() => data.url && window.open(data.url, "_blank")}
      {...props}
    >
      {data.image && !isUrl(data.image) && (
        <Image
          alt={data.text}
          src={data.image}
          layout="fill"
          objectFit="cover"
          priority={true}
          quality={90}
        />
      )}

      {data.tweetId && (
        <SnapshotBoardBlockTweet>
          <TwitterTweetEmbed tweetId={data.tweetId} />
        </SnapshotBoardBlockTweet>
      )}

      {data.youtubeId && (
        <SnapshotBoardBlockVideo>
          <YouTube
            videoId={data.youtubeId}
            title={data.text}
            opts={YOUTUBE_OPTIONS}
          />
        </SnapshotBoardBlockVideo>
      )}

      {data.text && (
        <SnapshotBoardBlockText>
          <SnapshotBoardBlockTextContent>
            <span>{data.text}</span>
          </SnapshotBoardBlockTextContent>
        </SnapshotBoardBlockText>
      )}
    </SnapshotBoardBlock>
  );
}

const getStyles = (
  data: SnapshotBlock,
  width: number,
  height: number,
  isImageLoaded: undefined | string
) => {
  let styles: {
    width?: string;
    height?: string;
    cursor?: string;
    backgroundColor?: string;
    backgroundImage?: string;
  } = {};
  styles.width = `${width}px`;
  styles.height = `${height}px`;
  styles.backgroundColor = data.background ? data.background : undefined;
  styles.cursor = data.url ? "pointer" : "inherit";

  if (data.image && isUrl(data.image)) {
    styles.backgroundImage = isImageLoaded
      ? `url(${data.image})`
      : `url(/images/loader.svg)`;
  }
  return styles;
};
