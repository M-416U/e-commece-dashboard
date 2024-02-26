import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog";

type props_types = {
  title: string;
  description: string;
  IsOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
};

const dialog_model = ({
  title,
  description,
  IsOpen,
  onClose,
  children,
}: props_types) => {
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };
  return (
    <Dialog open={IsOpen} onOpenChange={onChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
};

export default dialog_model;
