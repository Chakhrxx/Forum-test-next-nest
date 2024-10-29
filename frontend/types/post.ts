import { User } from "./user";
import { Comment } from "./comment";

export enum Community {
  History = "History",
  Food = "Food",
  Pets = "Pets",
  Health = "Health",
  Fashion = "Fashion",
  Exercise = "Exercise",
  Others = "Others",
}

export interface Post {
  id: string;
  title: string;
  description: string;
  community: Community;
  users: User;
  comments: Comment[];
  created: Date;
  updated: Date;
}

export interface PostRequest {
  title: string;
  description: string;
  community: Community;
  userId: User["id"];
}
export interface PostPaginateResponse {
  posts: Post[];
  total: number;
  page: number;
  totalPages: number;
}

export type PostResponse = Post;
