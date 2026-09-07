import { useState } from "react";
import { Mail, Send, CheckCircle2 } from "lucide-react";
import { submitContact } from "../services/contactService";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await submitContact(formData);
      setIsSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="max-w-md mx-auto px-4 py-20 text-center">
        <CheckCircle2 size={44} className="mx-auto text-fern mb-3" />
        <h1 className="text-xl font-bold text-dark mb-2">Message Sent</h1>
        <p className="text-forest text-sm">
          Thanks for reaching out — we'll get back to you soon.
        </p>
      </section>
    );
  }

  return (
    <section className="max-w-lg mx-auto px-4 py-12">
      <div className="flex items-center gap-2 mb-2">
        <Mail size={22} className="text-fern" />
        <h1 className="text-2xl font-bold text-dark">Contact Us</h1>
      </div>
      <p className="text-forest text-sm mb-6">
        Have a question or feedback? Send us a message.
      </p>

      <form onSubmit={handleSubmit} className="bg-white border border-sage/60 rounded-xl p-6 shadow-sm">
        <Input label="Name" name="name" value={formData.name} onChange={handleChange} required />
        <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-dark">Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 rounded-lg border border-sage outline-none focus:border-fern transition-colors duration-200"
          />
        </div>

        {error && (
          <p className="text-red-600 text-sm mb-3 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}

        <Button type="submit" isLoading={isSubmitting} fullWidth>
          <span className="flex items-center justify-center gap-2">
            <Send size={15} />
            Send Message
          </span>
        </Button>
      </form>
    </section>
  );
}