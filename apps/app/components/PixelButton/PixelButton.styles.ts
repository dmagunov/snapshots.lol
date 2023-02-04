import styled from "styled-components";

export const PixelButton = styled.a`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  padding: 0;
  cursor: pointer;
  width: fit-content;
  text-decoration: none;
  color: #fff;
  font-size: 3.6rem;
  font-weight: 700;

  &:hover {
    color: #fff500;
  }

  .pixel-button__content {
    flex-grow: 1;
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    background-repeat: repeat-x;
    white-space: nowrap;
    padding-bottom: 0.5rem;
    padding-left: 3rem;
    padding-right: 3rem;
    background-image: url("/images/pixel-button-pink-middle.png");
  }

  .pixel-button__left {
    height: 72px;
    width: 18px;
    background-image: url("/images/pixel-button-pink-left.png");
  }

  .pixel-button__right {
    height: 72px;
    width: 18px;
    background-image: url("/images/pixel-button-pink-right.png");
  }
`;
