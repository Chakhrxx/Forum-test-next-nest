// src/services/authService.ts
import { axiosInstance } from "@/libs/axios";
import {
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
} from "@/types/auth";
import { User } from "@/types/user";

export const authService = {
  signIn: async (requestData?: SignInRequest): Promise<SignInResponse> => {
    return axiosInstance
      .post<SignInResponse>(`/auth/sign-in/${requestData}`)
      .then((response) => response.data);
  },

  signUp: async (data: SignUpRequest): Promise<SignUpResponse> => {
    // Create request object
    console.log("data", data);

    return axiosInstance
      .post<SignUpResponse>("/auth/sign-up", data)
      .then((response) => response.data);
  },

  getProfile: async (): Promise<User> => {
    return axiosInstance<User>("/me").then((response) => response.data);
  },
};
