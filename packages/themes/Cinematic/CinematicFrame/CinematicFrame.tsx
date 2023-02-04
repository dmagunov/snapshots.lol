import styled from "styled-components";

import { DEFAULT_SIZE, DEFAULT_ICON_POSITION } from "../config";
// icons
import LeftTopIcon from "../images/left-top.svg";
import LeftBottomIcon from "../images/left-bottom.svg";
import RightBottomIcon from "../images/right-bottom.svg";
import RightTopIcon from "../images/right-top.svg";

const CinematicFrameContainer = styled.div`
  background-color: #000;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

type Props = {
  children: React.ReactNode;
  size: number;
};

export default function CinematicFrame({ children, size = 20 }: Props) {
  const koef = size / DEFAULT_SIZE;

  const iconSize = koef * DEFAULT_SIZE;
  const iconPosition = koef * DEFAULT_ICON_POSITION;

  const frameStyles = {
    padding: `${size}px`,
  };

  const cornerIconStyles = {
    position: "absolute",
    width: `${iconSize}px`,
    height: `${iconSize}px`,
  };

  const leftTopIconStyles = Object.assign({}, cornerIconStyles, {
    left: `${iconPosition}px`,
    top: `${iconPosition}px`,
  });

  const leftBottomIconStyles = Object.assign({}, cornerIconStyles, {
    left: `${iconPosition}px`,
    bottom: `${iconPosition}px`,
  });

  const rightTopIconStyles = Object.assign({}, cornerIconStyles, {
    right: `${iconPosition}px`,
    top: `${iconPosition}px`,
  });

  const rightBottomIconStyles = Object.assign({}, cornerIconStyles, {
    right: `${iconPosition}px`,
    bottom: `${iconPosition}px`,
  });

  return (
    <CinematicFrameContainer style={frameStyles}>
      <LeftTopIcon style={leftTopIconStyles} />
      <RightTopIcon style={rightTopIconStyles} />
      <RightBottomIcon style={rightBottomIconStyles} />
      <LeftBottomIcon style={leftBottomIconStyles} />

      {children}
    </CinematicFrameContainer>
  );
}
