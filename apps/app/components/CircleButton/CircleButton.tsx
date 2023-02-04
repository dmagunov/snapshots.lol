import { CircleButton } from "./CircleButton.styles";

type CircleButtonComponentProps = {
  title?: string;
  children?: React.ReactNode;
  props?: any;
  disabled?: boolean;
  color?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
};

export default function CircleButtonComponent({
  title,
  children,
  disabled = false,
  color = "blue",
  ...props
}: CircleButtonComponentProps) {
  return (
    <CircleButton
      color={color}
      disabled={disabled}
      title={title}
      role="button"
      {...props}
    >
      {children}
    </CircleButton>
  );
}
