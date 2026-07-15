import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // TODO: connect to backend login API in the next step
    console.log("Login data:", formData);

    setIsLoading(false);
  };

  return (
    <section className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-dark mb-6 text-center">
        Login
      </h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          required
        />
        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
        />

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <Button type="submit" fullWidth isLoading={isLoading}>
          Login
        </Button>

        <p className="text-sm text-center mt-4 text-dark">
          Don't have an account?{" "}
          <Link to="/signup" className="text-fern font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </section>
  );
}