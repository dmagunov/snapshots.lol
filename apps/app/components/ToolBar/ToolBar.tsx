import { ToolBar } from "./ToolBar.styles";

type ToolBarComponentProps = {
  children: React.ReactNode;
};

export default function ToolBarComponent({ children }: ToolBarComponentProps) {
  return <ToolBar>{children}</ToolBar>;
}
