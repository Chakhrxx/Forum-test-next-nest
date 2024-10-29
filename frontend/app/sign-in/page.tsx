"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

export default function SignInPage() {
  const { signIn, loading, error } = useAuth(); // Access signIn method and loading/error state
  const [username, setUsername] = useState(""); // State for username (or email)
  const router = useRouter(); // Initialize the router

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signIn(username); // Call the signIn method from the hook
      router.push("/"); // Navigate to the home page on success
    } catch (err) {
      // Handle errors if needed
      console.error(err);
    }
  };

  return (
    <main className="w-full h-screen flex flex-col lg:flex-row-reverse bg-green-500">
      <div className="flex flex-col bg-green-300 justify-center items-center space-y-4 w-full h-[45%] lg:h-full rounded-b-[36px] lg:rounded-l-[36px]">
        <img
          src="/images/Banner.png"
          alt="Banner"
          className="w-[172px] h-[132px] lg:w-[300px] lg:h-[230px]"
        />
        <h1 className="font-castoro italic font-normal text-white text-[24px]">
          a Board
        </h1>
      </div>
      <div className="w-full flex flex-col h-[55%] lg:h-full lg:items-center justify-center rounded-b-[36px] space-y-8 p-6">
        <h1 className="text-white text-[28px] font-semibold text-left lg:w-[60%]">
          Sign in
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6 lg:w-[60%]">
          {" "}
          {/* Add onSubmit handler */}
          <input
            type="text"
            value={username} // Bind state
            onChange={(e) => setUsername(e.target.value)} // Update state on change
            className="w-full font-ibm-plex rounded-lg p-2 placeholder:text-secondary placeholder:text-[16px] placeholder:font-ibm-plex outline-success"
            placeholder="Username"
            required
          />
          <button
            type="submit" // Specify type for better semantics
            className="w-full bg-success font-ibm-plex text-white text-[14px] font-semibold rounded-lg p-2 shadow-sm"
          >
            {loading ? "Signing in..." : "Sign in"}{" "}
            {/* Conditional loading text */}
          </button>
          <div className="flex flex-col items-center mt-4 font-castoro italic">
            <p className="text-white text-center text-[14px]">
              If you don't have an account,{" "}
              <a className="text-success underline" href="/sign-up">
                please sign up.
              </a>
            </p>
          </div>
          {error && <p className="text-red-500">{error}</p>}{" "}
          {/* Display error if present */}
        </form>
      </div>
    </main>
  );
}
