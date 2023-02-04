import styled from "styled-components";

import CircleButton from "components/CircleButton/CircleButton";

export const Address = styled.div`
  margin-top: 0.5rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
  color: #fff;
  &::before {
    content: " ";
    border-radius: 50%;
    display: inline-block;
    background-color: green;
    width: 0.6rem;
    height: 0.6rem;
    margin-right: 0.4rem;
  }
`;

export const Balance = styled.div`
  margin-top: 0.5rem;
  font-size: 1rem;
  color: #222;
`;

export const Label = styled.div`
  margin-top: 0.5rem;
  font-size: 1rem;
  font-weight: 400;
  color: #fff500;
`;

export const MintButton = styled(CircleButton)`
  width: 13rem;
  height: 13rem;
`;
