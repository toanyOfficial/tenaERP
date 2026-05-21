export type ModalSize = "mini" | "small" | "medium" | "large";

export type ModalProps = {
  open: boolean;
  title?: string;
  size?: ModalSize;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  closable?: boolean;
};
