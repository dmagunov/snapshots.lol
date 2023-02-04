import styled from "styled-components";
import CircleButton from "components/CircleButton/CircleButton";

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: row;
`;

export const CodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  > section {
    resize: horizontal;
    overflow: auto;
  }
`;

export const PreviewContainer = styled.div`
  display: flex;
  height: 100%;
  flex-grow: 1;
`;

export const EditButton = styled(CircleButton)`
  width: 13rem;
  height: 13rem;
`;
