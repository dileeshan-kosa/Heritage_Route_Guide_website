"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Compass, User, Mail, Lock, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      } catch (e) {
        localStorage.removeItem("user");
      }
    }
  }, [router]);

  // Login Mutation
  const loginMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }
      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem("user", JSON.stringify(data.user));
      setSuccessMsg("Logged in successfully! Redirecting...");
      setErrorMsg("");
      setTimeout(() => {
        if (data.user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }, 1500);
    },
    onError: (err: any) => {
      setErrorMsg(err.message || "An error occurred");
      setSuccessMsg("");
    },
  });

  // Register Mutation
  const registerMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }
      return data;
    },
    onSuccess: () => {
      setSuccessMsg("Account created! Please log in now.");
      setErrorMsg("");
      setIsLogin(true);
      // Keep email, clear password/username
      setPassword("");
      setUsername("");
    },
    onError: (err: any) => {
      setErrorMsg(err.message || "An error occurred");
      setSuccessMsg("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (isLogin) {
      if (!email || !password) {
        setErrorMsg("All fields are required");
        return;
      }
      loginMutation.mutate();
    } else {
      if (!username || !email || !password) {
        setErrorMsg("All fields are required");
        return;
      }
      registerMutation.mutate();
    }
  };

  const isLoading = loginMutation.isPending || registerMutation.isPending;

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 transition-colors duration-500 overflow-hidden">
      {/* Dynamic Ambient Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-amber-500/10 dark:bg-amber-500/5 blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-700/10 dark:bg-amber-600/5 blur-3xl" />

      {/* Main card */}
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xl p-8 backdrop-blur-xl transition-all duration-300">
        
        {/* Back Link */}
        <Link 
          href="/" 
          className="absolute top-6 left-6 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 flex items-center gap-1 text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Guide
        </Link>

        {/* Logo and title */}
        <div className="flex flex-col items-center mt-6 mb-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center mb-3">
            <Compass className="w-6 h-6 text-amber-600 dark:text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold font-serif text-zinc-950 dark:text-white">
            {isLogin ? "Welcome Back" : "Start Your Journey"}
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 max-w-[280px]">
            {isLogin 
              ? "Access the Sri Lankan heritage roadmap dashboard & utility planner" 
              : "Register to manage and personalize your road trip planner settings"}
          </p>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="mb-5 p-3.5 text-xs font-medium text-red-650 bg-red-50 dark:bg-red-950/20 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-950/50">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-5 p-3.5 text-xs font-medium text-emerald-650 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400 rounded-xl border border-emerald-100 dark:border-emerald-950/50">
            {successMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="e.g. kosala12"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-600 transition-all font-medium"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-600 transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-600 transition-all font-medium"
              />
            </div>
          </div>

          {/* Special Admin Disclaimer */}
          {!isLogin && (
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 leading-normal bg-amber-500/5 dark:bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
              * Note: Registering with an email ending in <strong>.adm@gmail.com</strong> or <strong>.adm@gamil.com</strong> will register you as an administrator. Only one administrator account is permitted by the system.
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold bg-amber-650 hover:bg-amber-600 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-zinc-950 transition-all cursor-pointer shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed mt-6"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isLogin ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Toggle link */}
        <div className="text-center mt-6">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMsg("");
              setSuccessMsg("");
            }}
            disabled={isLoading}
            className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
          >
            {isLogin 
              ? "Don't have an account? Create an account" 
              : "Already have an account? Sign In"}
          </button>
        </div>

      </div>
    </div>
  );
}
