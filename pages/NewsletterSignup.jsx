import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { subscribeNewsletter } from "../services/newsletterService";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await subscribeNewsletter(email);
      setIsSubscribed(true);
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to subscribe");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="flex items-center gap-2 text-sage text-sm">
        <CheckCircle2 size={16} />
        Thanks for subscribing!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xs">
      <p className="text-sage text-sm mb-2">Subscribe for updates and offers</p>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          required
          className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 outline-none focus:border-sage text-sm transition-colors duration-200"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-9 h-9 flex-shrink-0 rounded-lg bg-fern hover:bg-forest flex items-center justify-center text-white transition-colors duration-200 disabled:opacity-60"
          aria-label="Subscribe"
        >
          <Send size={15} />
        </button>
      </div>
      {error && <p className="text-red-300 text-xs mt-1.5">{error}</p>}
    </form>
  );
}