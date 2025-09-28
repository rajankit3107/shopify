import React, { useState } from "react";
import client, { setAuthToken } from "../api";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await client.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("userId", res.data.user.id);
      setAuthToken(res.data.token);
      window.location.href = "/";
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
      <Card className="w-full max-w-lg bg-white/90 backdrop-blur-lg border border-gray-100 shadow-lg">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-semibold text-gray-900">
            Sign in to your account
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back! Please enter your credentials.
          </p>
        </CardHeader>

        <form onSubmit={submit} className="space-y-6">
          <CardContent className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="focus:ring-2 focus:ring-indigo-500"
              />
              <div className="text-right mt-1">
                <Link
                  to="/forgot-password"
                  className="text-xs text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pt-0">
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 transition cursor-pointer"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
            <p className="text-center text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
