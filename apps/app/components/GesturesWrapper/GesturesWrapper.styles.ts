import styled from "styled-components";

type StyledProps = {
  dragging: boolean;
  zIndex: number;
  top: string;
  left: string;
};

export const GesturesWrapper = styled.div`
  -webkit-font-smoothing: subpixel-antialiased;
  position: absolute;
  z-index: ${(props: StyledProps) => props.zIndex};
  top: ${(props: StyledProps) => props.top || "auto"};
  left: ${(props: StyledProps) => props.left || "auto"};
  touch-action: none;
  user-select: none;
  cursor: ${(props: StyledProps) => (props.dragging ? "grabbing" : "grab")};
  * {
    cursor: ${(props: StyledProps) =>
      props.dragging ? "grabbing" : undefined};
  }
`;
