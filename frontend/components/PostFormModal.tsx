// PostFormModal.tsx
import React from "react";
import Dropdown from "@/components/Dropdown";
import BaseModal from "@/components/BaseModal";

interface Post {
  id: number;
  user: string;
  community: string;
  title: string;
  description: string;
  commentsCount: number;
}

// Define the props interface for the PostFormModal component
interface PostFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPost: Post | null;
  postTitle: string;
  postDescription: string;
  postCommunity: string;
  errorMessages: {
    title: string;
    description: string;
    community: string;
  };
  handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleCommunitySelect: (community: string) => void;
  handlePostSubmit: () => void;
}

// PostFormModal functional component definition
const PostFormModal: React.FC<PostFormModalProps> = ({
  isOpen,
  onClose,
  currentPost,
  postTitle,
  postDescription,
  postCommunity,
  errorMessages,
  handleTitleChange,
  handleDescriptionChange,
  handleCommunitySelect,
  handlePostSubmit,
}) => {
  // Return null if the modal is not open
  if (!isOpen) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="relative flex flex-col w-full p-8 space-y-5">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-0 right-3 text-gray-500 hover:text-gray-700 text-[24px]"
        >
          &times; {/* Close icon */}
        </button>

        {/* Modal title */}
        <h1 className="font-semibold">
          {currentPost ? "Edit Post" : "Create Post"}
        </h1>

        {/* Community dropdown selection */}
        <Dropdown
          className="bg-white text-success border rounded-lg border-success"
          selected={postCommunity}
          onSelect={handleCommunitySelect}
        />
        {errorMessages.community && (
          <p className="text-red-500">{errorMessages.community}</p> // Display community error message
        )}

        {/* Title input */}
        <input
          type="text"
          value={postTitle}
          onChange={handleTitleChange}
          className="w-full font-ibm-plex rounded-lg p-2 placeholder:text-secondary placeholder:text-[16px] placeholder:font-ibm-plex outline-success border"
          placeholder="Title" // Placeholder for title input
        />
        {errorMessages.title && (
          <p className="text-red-500">{errorMessages.title}</p> // Display title error message
        )}

        {/* Description textarea */}
        <textarea
          value={postDescription}
          onChange={handleDescriptionChange}
          className="w-full h-[300px] font-ibm-plex rounded-lg p-2 placeholder:text-secondary placeholder:text-[16px] placeholder:font-ibm-plex outline-success border"
          placeholder="What's on your mind" // Placeholder for description textarea
        />
        {errorMessages.description && (
          <p className="text-red-500">{errorMessages.description}</p> // Display description error message
        )}

        {/* Button group for larger screens */}
        <div className="hidden lg:flex justify-end space-x-2">
          <button
            className="w-32 bg-white font-ibm-plex text-success border-[1px] border-success text-[14px] font-semibold rounded-lg py-1 px-3 mt-2 "
            onClick={onClose} // Cancel action
          >
            Cancel
          </button>
          <button
            className="w-32 bg-success font-ibm-plex text-white border-[1px] border-success text-[14px] font-semibold rounded-lg py-1 px-3 mt-2 "
            onClick={handlePostSubmit} // Submit action
          >
            {currentPost ? "Confirm" : "Post"}
          </button>
        </div>

        {/* Button group for smaller screens */}
        <div className="flex flex-col w-full lg:hidden">
          <button
            className="w-full bg-white font-ibm-plex text-success border-[1px] border-success text-[14px] font-semibold rounded-lg py-1 px-3 mt-2 opacity-70"
            onClick={onClose} // Cancel action
          >
            Cancel
          </button>
          <button
            className="w-full bg-success font-ibm-plex text-white border-[1px] border-success text-[14px] font-semibold rounded-lg py-1 px-3 mt-2 opacity-70"
            onClick={handlePostSubmit} // Submit action
          >
            {currentPost ? "Confirm" : "Post"}
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default PostFormModal;
