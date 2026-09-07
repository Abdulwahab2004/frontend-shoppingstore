import { useState } from "react";
import api from "../services/api";

export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState({ loading: false, success: "", error: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: "", error: "" });
    try {
      const res = await api.post("/contact", form);
      setStatus({ loading: false, success: res.data.message, error: "" });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus({
        loading: false,
        success: "",
        error: err.response?.data?.message || "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-semibold mb-6">Contact Us</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border rounded-lg px-4 py-2"
        />
        <input
          type="email"
          name="email"
          placeholder="Your email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border rounded-lg px-4 py-2"
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={form.subject}
          onChange={handleChange}
          required
          className="w-full border rounded-lg px-4 py-2"
        />
        <textarea
          name="message"
          placeholder="Your message"
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
          className="w-full border rounded-lg px-4 py-2"
        />
        <button
          type="submit"
          disabled={status.loading}
          className="bg-fern text-white px-6 py-2 rounded-lg disabled:opacity-50"
        >
          {status.loading ? "Sending..." : "Send Message"}
        </button>
        {status.success && <p className="text-green-600 text-sm">{status.success}</p>}
        {status.error && <p className="text-red-600 text-sm">{status.error}</p>}
      </form>
    </div>
  );
}