/** @type {import('next').NextConfig} */
const runtimeCaching = require("next-pwa/cache");

const withPWA = require("next-pwa")({
  dest: "public",
  runtimeCaching,
  publicExcludes: ["!snapshots/**/*"],
  // NEXT: disableDevLogs
  // https://developer.chrome.com/docs/workbox/reference/workbox-webpack-plugin/#type-GenerateSW
  disable: process.env.NODE_ENV === "development",
});

const withTM = require("next-transpile-modules")([
  "@thenftsnapshot/hardhat",
  "@thenftsnapshot/themes",
]);

module.exports = withTM(
  withPWA({
    compiler: {
      styledComponents: true,
    },
    webpack(config) {
      config.module.rules.push({
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ["@svgr/webpack"],
      });

      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };

      return config;
    },
    pageExtensions: ["page.tsx", "page.ts"],
  })
);
