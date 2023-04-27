import { ReactElement } from "react";
import Image from "next/legacy/image";

export { default as LoaderOverlay } from "./Loader.styles";

export function EaselLoader(): ReactElement {
  return (
    <>
      <Image
        src="/images/easel.gif"
        alt="Loading..."
        width={320}
        height={320}
      />
    </>
  );
}

export function EaselDarkLoader(): ReactElement {
  return (
    <>
      <Image
        src="/images/easel-dark.gif"
        alt="Loading..."
        width={160}
        height={188}
      />
    </>
  );
}

export function HandsLoader(): ReactElement {
  return (
    <>
      <Image
        src="/images/hands.gif"
        alt="Loading..."
        width={320}
        height={320}
      />
    </>
  );
}

export function RoadLoader(): ReactElement {
  return (
    <>
      <Image src="/images/road.gif" alt="Loading..." width={320} height={320} />
    </>
  );
}

export function BoardLoader(): ReactElement {
  return (
    <>
      <Image
        src="/images/board.gif"
        alt="Loading..."
        width={320}
        height={320}
      />
    </>
  );
}

export function CupLoader(): ReactElement {
  return (
    <>
      <Image src="/images/cup.gif" alt="Loading..." width={320} height={320} />
    </>
  );
}

export function NoHumanLoader(): ReactElement {
  return (
    <>
      <Image
        src="/images/nohuman.gif"
        alt="Loading..."
        width={320}
        height={320}
      />
    </>
  );
}
