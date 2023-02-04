import { PixelButton } from "./PixelButton.styles";

interface PixelButtonComponentProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  props?: any;
}

export default function PixelButtonComponent({
  children,
  ...props
}: PixelButtonComponentProps) {
  return (
    <PixelButton className="pixel-button" role="button" {...props}>
      <div className="pixel-button__left"></div>
      <div className="pixel-button__content">{children}</div>
      <div className="pixel-button__right"></div>
    </PixelButton>
  );
}
