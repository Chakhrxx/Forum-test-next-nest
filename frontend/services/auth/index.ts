import { axiosInstance } from "@/libs/axios";
import {
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
} from "@/types/auth";
import { User } from "@/types/user";

// Service to handle authentication-related operations
export const authService = {
  // Sign in a user with provided credentials
  signIn: async (requestData?: SignInRequest): Promise<SignInResponse> => {
    return axiosInstance
      .post<SignInResponse>(`/auth/sign-in/${requestData}`) // Send POST request to sign in
      .then((response) => response.data); // Return the response data (token/user info)
  },

  // Sign up a new user with provided information
  signUp: async (data: SignUpRequest): Promise<SignUpResponse> => {
    console.log("data", data); // Log the data for debugging

    return axiosInstance
      .post<SignUpResponse>("/auth/sign-up", data) // Send POST request to sign up
      .then((response) => response.data); // Return the response data (user info or confirmation)
  },

  // Retrieve the profile of the currently authenticated user
  getProfile: async (): Promise<User> => {
    return axiosInstance<User>("/me") // Send GET request to fetch user profile
      .then((response) => response.data); // Return the user profile data from the response
  },
};
