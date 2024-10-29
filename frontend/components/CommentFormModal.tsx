// CommentFormModal.tsx
import BaseModal from "@/components/BaseModal";
import React from "react";

interface CommentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  comment: string;
  editingComment: string;
  setComment: (value: string) => void;
  onPost: () => void;
}

const CommentFormModal: React.FC<CommentFormModalProps> = ({
  isOpen,
  onClose,
  comment,
  editingComment,
  setComment,
  onPost,
}) => {
  if (!isOpen) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="relative flex flex-col w-full p-8">
        <button
          onClick={onClose}
          className="absolute top-0 right-3 text-gray-500 hover:text-gray-700 text-[24px]"
        >
          &times;{" "}
        </button>
        <h1 className="font-semibold">Add Comments</h1>
        <textarea
          className="w-full my-6 h-[100px] font-ibm-plex rounded-lg p-2 placeholder:text-secondary placeholder:text-[16px] placeholder:font-ibm-plex outline-success border"
          placeholder="What's on your mind"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          className="w-full bg-white font-ibm-plex text-success border-[1px] border-success text-[14px] font-semibold rounded-lg py-1 px-3 mt-2 opacity-70"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="w-full bg-success font-ibm-plex text-white border-[1px] border-success text-[14px] font-semibold rounded-lg py-1 px-3 mt-2 opacity-70"
          onClick={onPost}
        >
          {editingComment ? "Confirm" : "Post"}
        </button>
      </div>
    </BaseModal>
  );
};

export default CommentFormModal;
