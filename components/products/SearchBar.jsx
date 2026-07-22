import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search products..."
        className="flex-1 px-3 py-2 rounded-lg border border-sage outline-none focus:border-fern transition-colors duration-200"
      />
      <button
        type="submit"
        className="bg-fern text-white px-4 py-2 rounded-lg hover:bg-forest transition-colors duration-200"
      >
        Search
      </button>
    </form>
  );
}