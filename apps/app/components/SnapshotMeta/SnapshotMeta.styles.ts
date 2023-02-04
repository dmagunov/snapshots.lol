import styled from "styled-components";

export const SnapshotMeta = styled.div`
  position: absolute;
  z-index: 1;
  left: 3rem;
  bottom: 3rem;
  padding: 0 2rem;
  box-sizing: border-box;
  width: 100%;

  font-family: ${(props) => props.theme.meta?.fontFamily};
  color: ${(props) => props.theme.meta?.color};
  font-size: ${(props) => props.theme.meta?.fontSize};
  font-weight: ${(props) => props.theme.meta?.fontWeight};

  span {
    display: block;
    margin-bottom: 0.5rem;
  }

  @media (max-width: ${(props) => props.theme.breakpoints?.mobile}) {
    bottom: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;

    span {
      display: inline-block;
      margin-bottom: 0.5rem;
      margin-right: 1.1rem;
    }
  }
`;
