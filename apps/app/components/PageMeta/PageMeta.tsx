import Head from "next/head";

const WEBSITE_NAME = "The NFT Snapshot";

type PageMetaProps = {
  title: string;
  description: string;
  url: string;
  image: string;
};

export default function PageMeta({
  title,
  description,
  url,
  image,
}: PageMetaProps) {
  return (
    <Head>
      <title>{title}</title>

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@nft_snapshot" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <meta name="description" content={description} />
      <meta property="og:site_name" content={WEBSITE_NAME}></meta>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:determiner" content="the" />

      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" />
    </Head>
  );
}
