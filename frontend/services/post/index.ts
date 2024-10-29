import { axiosInstance } from "@/libs/axios";
import {
  Post,
  PostPaginateResponse,
  PostRequest,
  PostResponse,
} from "@/types/post";

// Service to manage posts with CRUD operations
export const PostService = {
  // Create a new post
  create: async (data: PostRequest): Promise<PostResponse> => {
    return axiosInstance
      .post<PostResponse>(`/posts`, data) // Send POST request to create a new post
      .then((response) => response.data); // Return the post data from the response
  },

  // Find a post by its ID
  findOne: async (id: string): Promise<Post> => {
    return axiosInstance
      .get<Post>(`/posts/${id}`) // Send GET request to retrieve a specific post
      .then((response) => response.data); // Return the post data from the response
  },

  // Find all posts created by the current user
  findMyPost: async (): Promise<PostPaginateResponse> => {
    return axiosInstance
      .get<PostPaginateResponse>(`/posts/me`) // Send GET request to retrieve user's posts
      .then((response) => response.data); // Return the posts data from the response
  },

  // Find all posts
  findAll: async (): Promise<PostPaginateResponse> => {
    return axiosInstance
      .get<PostPaginateResponse>(`/posts`) // Send GET request to retrieve all posts
      .then((response) => response.data); // Return the posts data from the response
  },

  // Update an existing post by its ID
  update: async (id: string, data: PostRequest): Promise<PostResponse> => {
    return axiosInstance
      .patch<PostResponse>(`/posts/${id}`, data) // Send PATCH request to update the post
      .then((response) => response.data); // Return the updated post data from the response
  },

  // Delete a post by its ID
  delete: async (id: string) => {
    return axiosInstance.delete(`/posts/${id}`); // Send DELETE request to remove the post
  },
};
