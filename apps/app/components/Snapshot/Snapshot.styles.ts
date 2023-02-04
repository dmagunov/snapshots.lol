import styled from "styled-components";

type StyledProps = {
  backgroundImage?: string;
};

export const Snapshot = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  justify-content: center;
  flex-direction: column;
  overflow: hidden;
  touch-action: none;
  user-select: none;
  position: relative;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-color: ${(props) => props.theme.snapshot?.backgroundColor};
  background-image: url("${(props: StyledProps) => props.backgroundImage}");
`;
