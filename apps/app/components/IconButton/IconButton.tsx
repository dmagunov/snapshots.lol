import { IconButton } from "./IconButton.styles";

interface IconButtonComponentProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children?: React.ReactNode;
}

export default function IconButtonComponent({
  children,
  ...props
}: IconButtonComponentProps) {
  return (
    <IconButton rel="noreferrer" role="button" {...props}>
      {children}
    </IconButton>
  );
}
