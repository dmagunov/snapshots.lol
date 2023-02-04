import styled from "styled-components";

type StyledProps = {
  disabled: boolean;
  color: string;
};

export const CircleButton = styled.div`
  display: flex;
  text-decoration: none;
  text-align: center;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background-image: url("/images/${(props: StyledProps) =>
    props.color}-circle.png");
  max-width: 13rem;
  max-height: 13rem;
  border-radius: 50%;
  font-size: 3rem;
  font-weight: bold;
  pointer-events: ${(props: StyledProps) => (props.disabled ? "none" : "auto")};
  color: ${(props: StyledProps) => (props.disabled ? "#8b8b8b" : "#000")};
  cursor: ${(props: StyledProps) =>
    props.disabled ? "not-allowed" : "pointer"};
  &:hover {
    box-shadow: 1px 2px 3px 1px rgba(0, 0, 0, 0.1);
  }
`;
