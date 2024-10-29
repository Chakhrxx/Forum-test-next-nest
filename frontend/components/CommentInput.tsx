// CommentInput.tsx
import React from "react";

// Define the props interface for CommentInput component
interface CommentInputProps {
  isOpen: boolean;
  comment: string;
  setComment: (value: string) => void;
  onPost: () => void;
  onCancel: () => void;
}

const CommentInput: React.FC<CommentInputProps> = ({
  isOpen,
  comment,
  setComment,
  onPost,
  onCancel,
}) => {
  // If not open, return null to hide the component
  if (!isOpen) return null;

  return (
    <div className="hidden lg:flex lg:flex-col w-full mt-4">
      {/* Textarea for entering the comment */}
      <textarea
        className="w-full h-[100px] font-ibm-plex rounded-lg p-2 placeholder:text-secondary placeholder:text-[16px] placeholder:font-ibm-plex outline-success border"
        placeholder="What's on your mind" // Placeholder text
        value={comment} // Bind the value to the comment state
        onChange={(e) => setComment(e.target.value)} // Update comment state on change
      />
      <div className="flex justify-end space-x-3">
        {/* Cancel button to discard the comment input */}
        <button
          className="w-20 bg-white font-ibm-plex text-success border-[1px] border-success text-[14px] font-semibold rounded-lg py-1 px-3 mt-2 opacity-70"
          onClick={onCancel} // Call onCancel when clicked
        >
          Cancel
        </button>
        {/* Post button to submit the comment */}
        <button
          className="w-20 bg-success font-ibm-plex text-white border-[1px] border-success text-[14px] font-semibold rounded-lg py-1 px-3 mt-2 opacity-70"
          onClick={onPost} // Call onPost when clicked
        >
          {comment ? "Confirm" : "Post"}
        </button>
      </div>
    </div>
  );
};

export default CommentInput;
