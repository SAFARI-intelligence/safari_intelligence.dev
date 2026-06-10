import { FC } from "react";

interface NPSCaptureModalProps {
  isVisible: boolean;
  onClose: () => void;
}

declare const NPSCaptureModal: FC<NPSCaptureModalProps>;
export default NPSCaptureModal;
