import { Post } from "./post";
import { User } from "./user";

export interface Comment {
  id: string;
  message: string;
  users: User;
  created: Date;
  updated: Date;
}

export interface CommentRequest {
  message: string;
  postId: Post["id"];
  userId: User["id"];
}
export interface CommentResponse {
  id: string;
  message: string;
  created: Date;
  updated: Date;
  posts: Post;
  users: User;
}
