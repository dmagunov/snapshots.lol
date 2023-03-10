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
  box-sizing: border-box;
  text-align: center;
  background-color: #ce100f;
  color: #fff;
  font-size: 1.4rem;
  height: 3rem;
  p {
    padding: 0;
    line-height: 3rem;
    margin: 0 auto;
  }
  a {
    color: #fff;
    font-weight: bold;
  }
  @media (max-width: ${(props) => props.theme.breakpoints?.mobile}) {
    p {
      max-width: 70%;
    }
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
