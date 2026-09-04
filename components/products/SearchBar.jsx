import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { useDebounce } from "../../hooks/useDebounce";

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const debouncedValue = useDebounce(value, 500);
  const isPending = value !== debouncedValue && value.length > 0;
  const inputRef = useRef(null);

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue]);

  const handleClear = () => {
    setValue("");
    inputRef.current?.focus();
  };

  return (
    <div className="mb-6">
      <div
        className={`relative flex items-center rounded-full border-2 bg-white transition-all duration-200 ${
          isFocused ? "border-fern shadow-[0_0_0_4px_rgba(88,129,87,0.12)]" : "border-sage"
        }`}
      >
        <Search
          size={17}
          className={`absolute left-4 transition-colors duration-200 ${
            isFocused ? "text-fern" : "text-forest"
          }`}
        />

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search products..."
          className="w-full pl-11 pr-11 py-2.5 rounded-full outline-none bg-transparent text-dark placeholder:text-forest/60"
        />

        <div className="absolute right-3 flex items-center">
          {isPending ? (
            <Loader2 size={16} className="text-fern animate-spin" />
          ) : (
            value && (
              <button
                onClick={handleClear}
                className="w-6 h-6 rounded-full flex items-center justify-center text-forest hover:bg-sage/20 hover:text-dark transition-colors duration-200"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}