// src/app/signup/page.tsx or src/pages/signup.tsx (depending on your structure)

// Add the "use client" directive at the top
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const { signUp, loading, error } = useAuth(); // Change to use signUp for registration
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); // Add state for email
  const router = useRouter(); // Initialize the router

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const requestData = { username, email }; // Create the sign-up request object
      await signUp(requestData); // Use signUp instead of signIn
      router.push("/");
    } catch (error) {}
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
          Sign up
        </h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 lg:w-[60%] text-center"
        >
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Bind the state
            className="w-full font-ibm-plex rounded-lg p-2 placeholder:text-secondary placeholder:text-[16px] placeholder:font-ibm-plex outline-success"
            placeholder="Username"
            required
          />
          <input
            type="email" // Change type to email for validation
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Bind the state
            className="w-full font-ibm-plex rounded-lg p-2 placeholder:text-secondary placeholder:text-[16px] placeholder:font-ibm-plex outline-success"
            placeholder="Email"
            required
          />
          <button
            type="submit" // Add type="submit" for better semantics
            className="w-full bg-success font-ibm-plex text-white text-[14px] font-semibold rounded-lg p-2 shadow-sm"
          >
            {loading ? "Signing up..." : "Sign up"}{" "}
            {/* Conditional loading text */}
          </button>
          {error && <p className="text-red-500">{error}</p>}{" "}
          {/* Display error if present */}
          <div className="flex flex-col items-center mt-4 font-castoro italic">
            <p className="text-white text-center text-[14px]">
              If you have an account,{" "}
              <a className="text-success underline" href="/sign-in">
                sign in
              </a>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
