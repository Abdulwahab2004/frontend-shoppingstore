import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { signupUser } from "../services/authService";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      await signupUser(formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-dark mb-6 text-center">
        Create Account
      </h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        <Input
          label="Full Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="John Doe"
          required
        />
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
        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="••••••••"
          required
        />

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <Button type="submit" fullWidth isLoading={isLoading}>
          Sign Up
        </Button>

        <p className="text-sm text-center mt-4 text-dark">
          Already have an account?{" "}
          <Link to="/login" className="text-fern font-medium hover:underline">
            Login
          </Link>
        </p>
      </form>
    </section>
  );
}