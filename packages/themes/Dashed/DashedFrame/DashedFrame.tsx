import styled from "styled-components";

const DashedFrameContainer = styled.div`
  border-style: dashed;
  border-color: #fff;
  position: relative;
  box-shadow: 7px 7px 0 0 rgba(0, 0, 0, 0.2);
`;

type Props = {
  children: React.ReactNode;
  border: number;
  shadow: number;
};

export default function DashedFrame({
  children,
  border = 8,
  shadow = 15,
}: Props) {
  const styles = {
    padding: `${border}px`,
    borderWidth: `${border}px`,
    boxShadow: `${shadow}px ${shadow}px 0 0 rgba(0, 0, 0, 0.2)`,
  };
  return <DashedFrameContainer style={styles}>{children}</DashedFrameContainer>;
}
