import { User } from "./user";

export type accessToken = string;

export interface SignUpRequest {
  username: string;
  email: string;
}

export interface SignUpResponse {
  user: User;
  accessToken: accessToken;
}

export type SignInRequest = string;

export interface SignInResponse {
  accessToken: string;
}
