// components/DeletePostModal.tsx
import BaseModal from "@/components/BaseModal";

interface DeletePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const DeletePostModal: React.FC<DeletePostModalProps> = ({
  isOpen,
  onClose,
  onDelete,
}) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="relative flex flex-col w-full p-8 space-y-5 text-center">
        <button
          onClick={onClose}
          className="absolute top-0 right-3 text-gray-500 hover:text-gray-700 text-[24px]"
        >
          &times; {/* Close icon */}
        </button>

        <h1 className="font-semibold text-[20px]">
          Please confirm if you wish to delete the post
        </h1>

        <p className="text-[#5B5B5B] text-[14px]">
          This action cannot be undone. Please confirm if you want to proceed
          with deleting this post.
        </p>

        {/* <div className="hidden lg:flex justify-end space-x-2">
          <button
            className="w-full bg-white font-ibm-plex text-gray-500 border-[1px] border-gray-300 text-[14px] font-semibold rounded-lg py-1 px-3 mt-2"
            onClick={onClose} // Cancel action
          >
            Cancel
          </button>
          <button
            className="w-full bg-danger  font-ibm-plex text-white border-[1px] border-danger  text-[14px] font-semibold rounded-lg py-1 px-3 mt-2"
            onClick={onDelete}
          >
            Delete
          </button>
        </div> */}

        <div className="flex flex-col w-full lg:flex-row lg:space-x-4 pt-8">
          <button
            className="w-full bg-white font-ibm-plex text-gray-500 border-[1px] border-gray-300 text-[14px] font-semibold rounded-lg py-1 px-3 mt-2"
            onClick={onClose} // Cancel action
          >
            Cancel
          </button>
          <button
            className="w-full bg-danger font-ibm-plex text-white border-[1px] border-danger  text-[14px] font-semibold rounded-lg py-1 px-3 mt-2"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default DeletePostModal;
