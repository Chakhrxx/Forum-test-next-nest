// src/hooks/useAuth.ts
import { useState, useCallback, useEffect } from "react";
import { authService } from "@/services/auth";
import {
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
} from "@/types/auth";
import { User } from "@/types/user";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = useCallback(async (requestData: SignInRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response: SignInResponse = await authService.signIn(requestData);
      localStorage.setItem("accessToken", response.accessToken);
      await getProfile();
      return response; // Optionally return the response for further use
    } catch (err) {
      setError("Sign in failed. Please check your credentials.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(async (data: SignUpRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response: SignUpResponse = await authService.signUp(data);
      setUser(response.user); // Assuming the user profile is part of the response
      localStorage.setItem("accessToken", response.accessToken);
      return response; // Optionally return the response for further use
    } catch (err) {
      setError("Sign up failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const userProfile: User = await authService.getProfile();
      setUser(userProfile);
    } catch (err) {
      setError("Failed to fetch user profile.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getProfile();
  }, []);

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    getProfile,
  };
};
