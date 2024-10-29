import { request } from "http";
// src/services/post/index.ts
import { axiosInstance } from "@/libs/axios";
import { CommentRequest, CommentResponse } from "@/types/comment";

export const CommentService = {
  create: async (data: CommentRequest): Promise<CommentResponse> => {
    return axiosInstance
      .post<CommentResponse>(`/comments`, data)
      .then((response) => response.data);
  },
  update: async (
    id: string,
    data: CommentRequest
  ): Promise<CommentResponse> => {
    return axiosInstance
      .patch<CommentResponse>(`/comments/${id}`, data)
      .then((response) => response.data);
  },
  delete: async (id: string) => {
    return axiosInstance.delete(`/comments/${id}`);
  },
};
