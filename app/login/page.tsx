"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.error) {
      console.log(result.error);
    } else {
      router.push("/");
    }
  };
  const {data}=useSession();
  useEffect(()=>{
    if(data){
      router.push("/");
    }
  },[data]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl p-8">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          Welcome Back 
        </h1>

        {/* Form */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Email */}
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 active:scale-[0.98] transition duration-300"
          >
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="grow h-px bg-gray-700"></div>
          <span className="px-3 text-gray-400 text-sm">OR</span>
          <div className="grow h-px bg-gray-700"></div>
        </div>

        <button 
        onClick={()=>signIn("github")}
        className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 active:scale-[0.98] transition duration-300"
        >SignIn with Github</button>

         {/* Divider */}
        <div className="flex items-center my-6">
          <div className="grow h-px bg-gray-700"></div>
          <span className="px-3 text-gray-400 text-sm">OR</span>
          <div className="grow h-px bg-gray-700"></div>
        </div>

        {/* Register Link */}
        <p className="text-center text-gray-400 text-sm">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-indigo-400 font-semibold hover:underline"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
