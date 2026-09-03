import { useState } from "react";
import { SlidersHorizontal, ChevronDown, X } from "lucide-react";

export default function Filters({ onFilter }) {
  const [isOpen, setIsOpen] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [appliedCount, setAppliedCount] = useState(0);

  const handleApply = () => {
    onFilter({ minPrice, maxPrice });
    setAppliedCount((minPrice ? 1 : 0) + (maxPrice ? 1 : 0));
    setIsOpen(false);
  };

  const handleClear = () => {
    setMinPrice("");
    setMaxPrice("");
    setAppliedCount(0);
    onFilter({ minPrice: "", maxPrice: "" });
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${
          appliedCount > 0
            ? "border-fern bg-fern/10 text-fern"
            : "border-sage text-dark hover:bg-sage/20"
        }`}
      >
        <SlidersHorizontal size={15} />
        <span>Filter by Price</span>
        {appliedCount > 0 && (
          <span className="bg-fern text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
            {appliedCount}
          </span>
        )}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-40 opacity-100 mt-3" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white border border-sage/60 rounded-xl p-4 flex flex-wrap items-end gap-3 shadow-sm">
          <div>
            <label className="block text-xs font-medium text-forest mb-1">Min Price</label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0"
              className="w-24 px-2.5 py-1.5 rounded-lg border border-sage outline-none focus:border-fern transition-colors duration-200 text-sm"
            />
          </div>
          <span className="text-forest text-sm pb-2">—</span>
          <div>
            <label className="block text-xs font-medium text-forest mb-1">Max Price</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="1000"
              className="w-24 px-2.5 py-1.5 rounded-lg border border-sage outline-none focus:border-fern transition-colors duration-200 text-sm"
            />
          </div>
          <button
            onClick={handleApply}
            className="bg-fern text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-forest transition-all duration-200 hover:shadow-sm"
          >
            Apply
          </button>
          {appliedCount > 0 && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1 text-red-600 text-sm font-medium hover:underline"
            >
              <X size={13} />
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}