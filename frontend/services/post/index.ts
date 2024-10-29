import { request } from "http";
// src/services/post/index.ts
import { axiosInstance } from "@/libs/axios";
import {
  Post,
  PostPaginateResponse,
  PostRequest,
  PostResponse,
} from "@/types/post";

export const PostService = {
  create: async (data: PostRequest): Promise<PostResponse> => {
    return axiosInstance
      .post<PostResponse>(`/posts`, data)
      .then((response) => response.data);
  },
  findOne: async (id: string): Promise<Post> => {
    return axiosInstance
      .get<Post>(`/posts/${id}`)
      .then((response) => response.data);
  },
  findMyPost: async (): Promise<PostPaginateResponse> => {
    return axiosInstance
      .get<PostPaginateResponse>(`/posts/me`)
      .then((response) => response.data);
  },
  findAll: async (): Promise<PostPaginateResponse> => {
    return axiosInstance
      .get<PostPaginateResponse>(`/posts`)
      .then((response) => response.data);
  },
  update: async (id: string, data: PostRequest): Promise<PostResponse> => {
    return axiosInstance
      .patch<PostResponse>(`/posts/${id}`, data)
      .then((response) => response.data);
  },
  delete: async (id: string) => {
    return axiosInstance.delete(`/posts/${id}`);
  },
};
