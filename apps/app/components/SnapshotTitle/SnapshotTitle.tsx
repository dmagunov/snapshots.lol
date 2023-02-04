import { SnapshotTitle } from "./SnapshotTitle.styles";

type SnapshotTitleComponentProps = {
  title: string;
};

export default function SnapshotTitleComponent({
  title,
}: SnapshotTitleComponentProps) {
  return <SnapshotTitle>{title}</SnapshotTitle>;
}
