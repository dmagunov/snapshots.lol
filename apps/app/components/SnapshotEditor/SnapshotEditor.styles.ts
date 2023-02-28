import styled from "styled-components";
import CircleButton from "components/CircleButton/CircleButton";

export const Page = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
`;

export const Banner = styled.div`
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
  text-align: center;
  background-color: #ce100f;
  color: #fff;
  font-size: 1.4rem;
  a {
    color: #fff;
    font-weight: bold;
  }
`;

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: calc(100% - 3rem);
  flex-grow: 1;
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
