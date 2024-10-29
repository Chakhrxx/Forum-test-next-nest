import classNames from "classnames";
import { FC, ReactNode } from "react";

// Define the type for Modal props
export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
  className?: string;
};

const BaseModal: FC<ModalProps> = ({
  isOpen,
  className,
  onClose,
  children,
}) => {
  // Determine the classes for the modal based on its open state
  const modalClasses = isOpen
    ? "fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto"
    : "hidden"; // Hidden when modal is closed

  return (
    <div className={modalClasses}>
      {/* Background overlay to dim the rest of the screen */}
      <div
        className="absolute inset-0 bg-black bg-opacity-70"
        onClick={onClose} // Close modal on background click
      ></div>
      {/* Modal content container */}
      <div
        className={classNames(
          "bg-white w-11/12 lg:w-5/12 mx-auto rounded-xl shadow z-50 overflow-x-hidden overflow-y-scroll",
          className // Include any additional class names
        )}
      >
        {children} {/* Render the modal content */}
      </div>
    </div>
  );
};

export default BaseModal;
