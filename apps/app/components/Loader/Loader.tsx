import { ReactElement } from "react";
import Image from "next/image";

export { default as LoaderOverlay } from "./Loader.styles";

export function EaselLoader(): ReactElement {
  return <>
    <Image
      src="/images/easel.gif"
      alt="Loading..."
      width={320}
      height={320}
      style={{
        maxWidth: "100%",
        height: "auto"
      }} />
  </>;
}

export function EaselDarkLoader(): ReactElement {
  return <>
    <Image
      src="/images/easel-dark.gif"
      alt="Loading..."
      width={160}
      height={188}
      style={{
        maxWidth: "100%",
        height: "auto"
      }} />
  </>;
}

export function HandsLoader(): ReactElement {
  return <>
    <Image
      src="/images/hands.gif"
      alt="Loading..."
      width={320}
      height={320}
      style={{
        maxWidth: "100%",
        height: "auto"
      }} />
  </>;
}

export function RoadLoader(): ReactElement {
  return <>
    <Image
      src="/images/road.gif"
      alt="Loading..."
      width={320}
      height={320}
      style={{
        maxWidth: "100%",
        height: "auto"
      }} />
  </>;
}

export function BoardLoader(): ReactElement {
  return <>
    <Image
      src="/images/board.gif"
      alt="Loading..."
      width={320}
      height={320}
      style={{
        maxWidth: "100%",
        height: "auto"
      }} />
  </>;
}

export function CupLoader(): ReactElement {
  return <>
    <Image
      src="/images/cup.gif"
      alt="Loading..."
      width={320}
      height={320}
      style={{
        maxWidth: "100%",
        height: "auto"
      }} />
  </>;
}

export function NoHumanLoader(): ReactElement {
  return <>
    <Image
      src="/images/nohuman.gif"
      alt="Loading..."
      width={320}
      height={320}
      style={{
        maxWidth: "100%",
        height: "auto"
      }} />
  </>;
}
