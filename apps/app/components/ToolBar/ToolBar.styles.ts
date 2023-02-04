import styled from "styled-components";

export const ToolBar = styled.div`
  position: fixed;
  z-index: 2;
  top: 2rem;
  right: 2rem;
  display: flex;
  align-items: stretch;
  width: fit-content;
  & > :not(:last-child) {
    margin-right: 2rem;
  }
  @media (max-width: ${(props) => props.theme.breakpoints?.mobile}) {
    top: 1.5rem;
    right: 1.5rem;
    & > :not(:last-child) {
      margin-right: 1.5rem;
    }
  }
`;
