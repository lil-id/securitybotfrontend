import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!phone) {
      setError("Phone number is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/auth/login`, {
        "numberPhone": phone,
      });

      if (data.data.code !== 200) {
        setError("Login failed. Invalid or Not Found Phone Number.");
        return;
      }

      // Store authentication data (e.g., token) in localStorage
      localStorage.setItem("authToken", data.data.data.token);

      // Redirect to Dashboard
      navigate("/dashboard");
    } catch (err) {
      setError("Login failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Login</h2>
        <input
          type="text"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />
        {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}