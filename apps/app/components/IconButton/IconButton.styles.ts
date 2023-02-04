import styled from "styled-components";

export const IconButton = styled.a`
  cursor: pointer;
  display: flex;
  text-decoration: none;
  text-align: center;
  align-items: center;
  box-sizing: border-box;
  svg {
    width: 5rem;
    .stroke {
      stroke: #fff;
    }
    .fill {
      fill: #fff;
    }
  }

  @media (max-width: ${(props) => props.theme.breakpoints?.mobile}) {
    svg {
      width: 3rem;
    }
  }
`;
