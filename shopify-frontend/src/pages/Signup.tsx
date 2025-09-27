import { useState } from "react";
import client from "../api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  const nav = useNavigate();
  async function submit(e: any) {
    e.preventDefault();
    await client.post("/auth/signup", { email, password, role });
    alert("Signup OK");
    nav("/login");
  }
  return (
    <form className="max-w-md" onSubmit={submit}>
      <h2 className="text-2xl mb-4">Signup</h2>
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
      <select
        className="w-full mb-2 p-2 border"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="CUSTOMER">Customer</option>
        <option value="VENDOR">Vendor</option>
      </select>
      <button className="px-4 py-2 bg-green-600 text-white rounded">
        Sign up
      </button>
    </form>
  );
}
