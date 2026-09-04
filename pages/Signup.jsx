import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { signupUser } from "../services/authService";

const validatePassword = (password) => {
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter";
  if (!/[a-z]/.test(password)) return "Password must contain a lowercase letter";
  if (!/[0-9]/.test(password)) return "Password must contain a number";
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Password must contain a special character";
  return "";
};

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      await signupUser(formData);
      setIsSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-dark mb-4">
            Verify Your Email
          </h1>
          <p className="text-forest mb-6">
            We've sent a verification link to your email. Please check your
            inbox (and spam folder) to verify your account.
          </p>
          <Link to="/login">
            <Button fullWidth>Go to Login</Button>
          </Link>
        </div>
      </section>
    );
  }

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
        <p className="text-xs text-gray-500 mb-3">
          Must be 8+ characters with uppercase, lowercase, number, and special character.
        </p>
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