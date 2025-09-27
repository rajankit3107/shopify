import React, { useState } from "react";
import client, { setAuthToken } from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();
  async function submit(e: any) {
    e.preventDefault();
    const res = await client.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    setAuthToken(res.data.token);
    nav("/");
  }
  return (
    <form className="max-w-md" onSubmit={submit}>
      <h2 className="text-2xl mb-4">Login</h2>
      <input
        className="w-full mb-2 p-2 border"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email"
      />
      <input
        type="password"
        className="w-full mb-2 p-2 border"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="password"
      />
      <button className="px-4 py-2 bg-indigo-600 text-white rounded">
        Login
      </button>
    </form>
  );
}
