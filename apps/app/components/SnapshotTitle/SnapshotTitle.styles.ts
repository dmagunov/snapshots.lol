import styled from "styled-components";

export const SnapshotTitle = styled.div`
  text-align: center;
  box-sizing: border-box;
  height: 100%;
  display: flex;
  align-items: center;
  padding: ${(props) => props.theme.title?.padding};
  color: ${(props) => props.theme.title?.color};
  background-color: ${(props) => props.theme.title?.backgroundColor};
  font-size: ${(props) => props.theme.title?.fontSize};
  font-weight: ${(props) => props.theme.title?.fontWeight};
  font-family: ${(props) => props.theme.title?.fontFamily};
  min-height: 3rem;
  @media (max-width: ${(props) => props.theme.breakpoints?.mobile}) {
    white-space: nowrap;
    overflow: hidden;
    line-height: 100%;
    padding-top: 0;
    padding-bottom: 0;
  }
`;
