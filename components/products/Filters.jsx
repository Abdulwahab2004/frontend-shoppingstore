import { useState } from "react";

export default function Filters({ onFilter }) {
  const [isOpen, setIsOpen] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleApply = () => {
    onFilter({ minPrice, maxPrice });
    setIsOpen(false);
  };

  const handleClear = () => {
    setMinPrice("");
    setMaxPrice("");
    onFilter({ minPrice: "", maxPrice: "" });
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-sage text-dark hover:bg-sage/20 transition-colors duration-200"
      >
        <span>Filter by Price</span>
        <span className="text-fern">{isOpen ? "−" : "+"}</span>
      </button>

      {isOpen && (
        <div className="mt-3 bg-white border border-sage rounded-lg p-4 flex flex-wrap items-end gap-3 shadow-sm">
          <div>
            <label className="block text-sm text-dark mb-1">Min Price</label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0"
              className="w-24 px-2 py-1 rounded-lg border border-sage outline-none focus:border-fern transition-colors duration-200"
            />
          </div>
          <div>
            <label className="block text-sm text-dark mb-1">Max Price</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="1000"
              className="w-24 px-2 py-1 rounded-lg border border-sage outline-none focus:border-fern transition-colors duration-200"
            />
          </div>
          <button
            onClick={handleApply}
            className="bg-fern text-white px-4 py-2 rounded-lg hover:bg-forest transition-colors duration-200"
          >
            Apply
          </button>
          <button
            onClick={handleClear}
            className="border border-sage text-dark px-4 py-2 rounded-lg hover:bg-sage/20 transition-colors duration-200"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}