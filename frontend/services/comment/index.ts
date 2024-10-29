import { axiosInstance } from "@/libs/axios";
import { CommentRequest, CommentResponse } from "@/types/comment";

// Service to manage comments with CRUD operations
export const CommentService = {
  // Create a new comment
  create: async (data: CommentRequest): Promise<CommentResponse> => {
    return axiosInstance
      .post<CommentResponse>(`/comments`, data) // Send POST request to create a new comment
      .then((response) => response.data); // Return the comment data from the response
  },

  // Update an existing comment by its ID
  update: async (
    id: string,
    data: CommentRequest
  ): Promise<CommentResponse> => {
    return axiosInstance
      .patch<CommentResponse>(`/comments/${id}`, data) // Send PATCH request to update the comment
      .then((response) => response.data); // Return the updated comment data from the response
  },

  // Delete a comment by its ID
  delete: async (id: string) => {
    return axiosInstance.delete(`/comments/${id}`); // Send DELETE request to remove the comment
  },
};
