import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Login</h2>

      <input
        type="email"
        name="email"
        placeholder="Email"
        className="border p-2 w-full mb-2"
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        className="border p-2 w-full mb-4"
        onChange={handleChange}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        onClick={handleSubmit}
      >
        Login
      </button>

      <p className="text-sm mt-4 text-center">
        Don’t have an account?{" "}
        <span
          onClick={() => navigate("/register")}
          className="text-blue-600 underline cursor-pointer"
        >
          Register here
        </span>
      </p>
    </div>
  );
}
