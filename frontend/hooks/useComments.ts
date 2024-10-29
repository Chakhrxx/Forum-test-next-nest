import { useState, useEffect } from "react";
import { CommentRequest } from "@/types/comment";
import { CommentService } from "@/services/comment";

export const useComments = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createComment = async (data: CommentRequest) => {
    console.log("createPost", data);
    setLoading(true);
    setError(null);
    try {
      await CommentService.create(data);
    } catch (err) {
      setError("Error create comment");
      console.error("Error creating comment:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await CommentService.delete(id);
    } catch (err) {
      setError("Error delete comment");
      console.error("Error deleting comment:", err);
    } finally {
      setLoading(false);
    }
  };
  const updateComment = async (id: string, data: CommentRequest) => {
    setLoading(true);
    setError(null);
    try {
      const respone = await CommentService.update(id, data);
    } catch (err) {
      setError("Error update comment");
      console.error("Error updating comment:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createComment,
    updateComment,
    deleteComment,
  };
};
