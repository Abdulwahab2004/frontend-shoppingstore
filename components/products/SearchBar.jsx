import { useState, useEffect } from "react";
import { useDebounce } from "../../hooks/useDebounce";

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value, 500);

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue]);

  return (
    <div className="mb-6">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search products..."
        className="w-full px-3 py-2 rounded-lg border border-sage outline-none focus:border-fern transition-colors duration-200"
      />
    </div>
  );
}