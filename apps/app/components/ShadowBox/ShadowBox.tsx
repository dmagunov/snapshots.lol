import { isMobile } from "react-device-detect";
import styled from "styled-components";

const ShadowBoxContainer = styled.div`
  position: relative;
  display: inline-block;
  img {
    vertical-align: text-bottom;
    text-align: right;
    max-width: 100%;
  }
`;

const ShadowBoxBottomShadow = styled.div`
  position: absolute;
  left: 0px;
  bottom: -20px;
  height: 20px;
  width: 100%;
  background-color: #0d181b;
  transform-origin: 0 0;
  transform: skewX(40deg) scaleY(1);
  box-sizing: border-box;
`;

const ShadowBoxRightShadow = styled.div`
  position: absolute;
  right: -17px;
  top: 0;
  height: 100%;
  width: 17px;
  background-color: #182d32;
  transform-origin: 0 0;
  transform: rotate(0) skewY(50deg) scaleX(1);
  box-sizing: border-box;
`;

type Props = {
  size: number;
  children: React.ReactNode;
};

export default function ShadowBox({ size = 20, children }: Props) {
  size = isMobile ? size / 2 : size;
  const GAP_SIZE = Math.ceil((3 * size) / 20);

  const mainStyles = {
    marginRight: `${size}px`,
    marginBottom: `${size}px`,
  };

  const bottomShadowStyles = {
    bottom: `-${size}px`,
    height: `${size}px`,
  };

  const rightShadowStyles = {
    right: `${-size + GAP_SIZE}px`,
    width: `${size - GAP_SIZE}px`,
  };

  return (
    <ShadowBoxContainer className="shadow-box__container" style={mainStyles}>
      <ShadowBoxBottomShadow
        className="shadow-box__bottom-shadow"
        style={bottomShadowStyles}
      ></ShadowBoxBottomShadow>
      {children}
      <ShadowBoxRightShadow
        className="shadow-box__right-shadow"
        style={rightShadowStyles}
      ></ShadowBoxRightShadow>
    </ShadowBoxContainer>
  );
}
