import type { Snapshot } from "types";

import Head from "next/head";

import { SCREENSHOT_FILE_NAME } from "lib/api";

const DESCRIPTION = "Click to View Snapshot";
const WEBSITE_NAME = "The NFT Snapshot";
const NEXT_PUBLIC_AWS_S3_BUCKET_URL = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_URL!;

type SnapshotPageMetaProps = {
  snapshot: Snapshot;
};

export default function SnapshotPageMeta({ snapshot }: SnapshotPageMetaProps) {
  const snapshotImageUrl = `${NEXT_PUBLIC_AWS_S3_BUCKET_URL}/${snapshot.id}/${SCREENSHOT_FILE_NAME}`;

  return (
    <Head>
      <title>{snapshot.name}</title>

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@nft_snapshot" />
      <meta name="twitter:title" content={snapshot.name} />
      <meta name="twitter:description" content={DESCRIPTION} />
      <meta name="twitter:image" content={snapshotImageUrl} />

      <meta name="description" content={DESCRIPTION} />
      <meta property="og:site_name" content={WEBSITE_NAME}></meta>
      <meta property="og:title" content={snapshot.name} />
      <meta property="og:description" content={DESCRIPTION} />
      <meta property="og:image:alt" content={snapshot.name} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={snapshot.url} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:determiner" content="the" />

      <meta property="og:image" content={snapshotImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" />
    </Head>
  );
}
