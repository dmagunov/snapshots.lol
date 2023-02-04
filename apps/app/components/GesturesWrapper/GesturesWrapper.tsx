import { useState, useRef, useEffect } from "react";
import { isMobile } from "react-device-detect";
import { useSpring, animated } from "@react-spring/web";
import { createUseGesture, dragAction, pinchAction } from "@use-gesture/react";

import { useWindowSize } from "usehooks-ts";
import useGesturePrevent from "lib/useGesturePrevent";

import { GesturesWrapper } from "./GesturesWrapper.styles";

const DRAG_BOUND_DELTA = 10;
const MIN_SCALE = 0.1;
const MAX_SCALE = 10;
const SPRING_CONFIG = {
  mass: 1,
  tension: 200,
  friction: 30,
  velocity: 0,
  damping: 5,
};

const AnimatedGesturesWrapper = animated(GesturesWrapper);
const useGesture = createUseGesture([dragAction, pinchAction]);

type GesturesWrapperComponentProps = {
  children: React.ReactNode;
  zIndex: number;
  scale: number;
  top?: string;
  left?: string;
};

export default function GesturesWrapperComponent({
  children,
  zIndex,
  scale,
  top,
  left,
}: GesturesWrapperComponentProps) {
  useGesturePrevent();

  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const [dragging, setDragging] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  const [style, api] = useSpring(() => {
    return {
      x: 0,
      y: 0,
      scale: scale,
      rotateZ: 0,
      config: SPRING_CONFIG,
    };
  }, [scale]);

  useEffect(() => {
    if (isMobile) {
      api.set({ scale: scale * 0.7 });
    }
  }, [scale]);

  // Another approach
  // youtube.com/watch?v=y-IvlWmp7dU
  // https://github.com/samselikoff/2020-12-15-image-cropper
  useGesture(
    {
      onDragStart: () => setDragging(true),
      onDragEnd: () => setDragging(false),
      onDrag: ({
        pinching,
        cancel,
        offset: [offsetX, offsetY],
        xy: [x, y],
      }) => {
        if (
          pinching ||
          x >= windowWidth - DRAG_BOUND_DELTA ||
          x <= DRAG_BOUND_DELTA ||
          y >= windowHeight - DRAG_BOUND_DELTA ||
          y <= DRAG_BOUND_DELTA
        )
          return cancel();
        api.start({ x: offsetX, y: offsetY });
      },
      onPinch: ({
        direction: [directionDelta],
        origin: [ox, oy],
        first,
        movement: [ms],
        offset: [s, a],
        memo,
      }) => {
        // Runs only at the beggining of gesture
        if (first && ref && ref.current) {
          // x/y relative to the top/left of the viewport
          const { width, height, x, y } = ref.current.getBoundingClientRect();

          // ox/oy where the cursor was relative to viewport
          const tx = ox - (x + width / 2);
          const ty = oy - (y + height / 2);
          memo = [style.x.get(), style.y.get(), tx, ty];
        }

        const x = memo[0] - (ms - 1) * memo[2];
        const y = memo[1] - (ms - 1) * memo[3];

        api.start({ scale: s, x, y });
        return memo;
      },
    },
    {
      target: ref,
      eventOptions: { passive: false },
      drag: {
        from: () => [style.x.get(), style.y.get()],
        filterTaps: true,
        rubberband: false,
        preventDefault: true,
      },
      pinch: {
        from: () => [style.scale.get(), style.rotateZ.get()],
        scaleBounds: () =>
          getScaleBounds(ref?.current, windowWidth, windowHeight),
        rubberband: false,
        modifierKey: null,
        preventDefault: true,
        pointer: {
          touch: true,
        },
      },
    }
  );

  return (
    <AnimatedGesturesWrapper
      dragging={dragging}
      zIndex={zIndex}
      ref={ref}
      style={style}
      top={top}
      left={left}
    >
      {children}
    </AnimatedGesturesWrapper>
  );
}

const getScaleBounds = (
  el: HTMLDivElement | null,
  windowWidth: number,
  windowHeight: number
) => {
  let min = MIN_SCALE;
  let max = MAX_SCALE;

  if (!el) return { min, max };

  const containerRealWidth = el.offsetWidth;
  const containerRealHeight = el.offsetHeight;

  let containerMax = Math.max(containerRealWidth, containerRealHeight);
  let windowMin = Math.min(windowWidth, windowHeight);

  const scaleCoefficient = 1 / (containerMax / (windowMin / 2));
  // 0.5 ???
  min = scaleCoefficient > 1 ? 0.5 : scaleCoefficient;

  return {
    min,
    max,
  };
};
