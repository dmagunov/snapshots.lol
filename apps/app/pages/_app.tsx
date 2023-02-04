import { useState } from "react";
import Head from "next/head";
import Script from "next/script";
import { AppProps } from "next/app";
import { ThemeProvider } from "styled-components";
import { ToastContainer } from "react-toastify";
import { WagmiConfig } from "wagmi";

import { theme as defaultTheme } from "@thenftsnapshot/themes/Default";
import { wagmiClient } from "lib/wagmiClient";

import GlobalStyle from "./_app.styles";
import "react-toastify/dist/ReactToastify.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState(defaultTheme);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="NFT Cultural Snapshots" />
        <meta name="keywords" content="NFT, Snapshot" />
        <title>The NFT Snapshot</title>

        <link rel="manifest" href="/manifest.json" />

        <link
          href="/icons/icon-16.png"
          rel="icon"
          type="image/png"
          sizes="16x16"
        />
        <link
          href="/icons/icon-32.png"
          rel="icon"
          type="image/png"
          sizes="32x32"
        />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="shortcut icon" href="/icons/icon-192.png" />

        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="white"
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="black"
        />
      </Head>
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-PV2FSPF');
          `}
      </Script>
      <WagmiConfig client={wagmiClient}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <Component {...pageProps} updateTheme={setTheme} />
        </ThemeProvider>
        <ToastContainer />
      </WagmiConfig>
    </>
  );
}
