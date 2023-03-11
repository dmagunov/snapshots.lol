import styled from "styled-components";
import { DialogContent } from "@reach/dialog";

import "@reach/dialog/styles.css";

export const DialogContentStyled: any = styled(DialogContent)`
  background: transparent;
  box-sizing: border-box;
  width: 65vw;
  height: 70vh;
  max-width: 100rem;
  .shadow-box__container {
    width: 100%;
    height: 100%;
  }
  @media (max-width: ${(props) => props.theme.breakpoints?.mobile}) {
    width: 90%;
    height: 90vh;
    margin: 5vh auto;

    .shadow-box__container {
      margin-right: 0;
      margin-bottom: 0;
    }
    .shadow-box__right-shadow {
      display: none;
    }
    .shadow-box__bottom-shadow {
      display: none;
    }
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 2rem;
  border: none;
  background: transparent;
  outline: none;
  color: #000;
  font-size: 3rem;
  box-sizing: border-box;
  font-weight: 600;
  cursor: pointer;
  @media (max-width: ${(props) => props.theme.breakpoints?.mobile}) {
    right: 0rem;
    padding-left: 2rem;
    padding-right: 2rem;
  }
`;

export const DialogContentFrame = styled.div`
  padding: 4rem 5rem;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: #fff500;
  position: relative;
  color: #000;

  picture {
    max-width: 80%;
  }
  img {
    max-width: 100%;
    height: auto;
    border: 3px solid #000;
    border-radius: 0.5rem;
  }
  p {
    font-size: 2rem;
    margin-top: 5rem;
    text-align: center;
  }
  @media (max-width: ${(props) => props.theme.breakpoints?.mobile}) {
    padding: 2rem;
  }
`;
