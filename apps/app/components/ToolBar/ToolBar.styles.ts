import styled from "styled-components";

export const ToolBar = styled.div`
  position: fixed;
  z-index: 2;
  top: 2.5rem;
  right: 2.5rem;
  display: flex;
  align-items: stretch;
  width: fit-content;
  & > :not(:last-child) {
    margin-right: 2rem;
  }
  @media (max-width: ${(props) => props.theme.breakpoints?.mobile}) {
    top: 1.5rem;
    right: 1.5rem;
    background: #274252;
    padding: 0.5rem;
    border-radius: 50%;
    & > :not(:last-child) {
      margin-right: 1.5rem;
    }
  }
`;
