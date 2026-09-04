import { useState } from "react";
import { SlidersHorizontal, ChevronDown, X } from "lucide-react";

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

export default function Filters({ onFilter }) {
  const [isOpen, setIsOpen] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("newest");
  const [applied, setApplied] = useState({ minPrice: "", maxPrice: "", sort: "newest" });

  const activeCount =
    (applied.minPrice ? 1 : 0) + (applied.maxPrice ? 1 : 0) + (applied.sort !== "newest" ? 1 : 0);

  const handleApply = () => {
    const next = { minPrice, maxPrice, sort };
    setApplied(next);
    onFilter(next);
    setIsOpen(false);
  };

  const handleClear = () => {
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    const next = { minPrice: "", maxPrice: "", sort: "newest" };
    setApplied(next);
    onFilter(next);
    setIsOpen(false);
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${
          activeCount > 0
            ? "border-fern bg-fern/10 text-fern"
            : "border-sage text-dark hover:bg-sage/20"
        }`}
      >
        <SlidersHorizontal size={15} />
        <span>Filters</span>
        {activeCount > 0 && (
          <span className="bg-fern text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
            {activeCount}
          </span>
        )}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-64 opacity-100 mt-3" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white border border-sage/60 rounded-xl p-4 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-medium text-forest mb-2">Sort By</label>
            <div className="flex flex-wrap gap-2">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSort(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors duration-200 ${
                    sort === opt.value
                      ? "bg-fern text-white border-fern"
                      : "border-sage text-dark hover:bg-sage/20"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-forest mb-2">Price Range</label>
            <div className="flex flex-wrap items-end gap-3">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min"
                className="w-24 px-2.5 py-1.5 rounded-lg border border-sage outline-none focus:border-fern transition-colors duration-200 text-sm"
              />
              <span className="text-forest text-sm pb-2">—</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max"
                className="w-24 px-2.5 py-1.5 rounded-lg border border-sage outline-none focus:border-fern transition-colors duration-200 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleApply}
              className="bg-fern text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-forest transition-all duration-200 hover:shadow-sm"
            >
              Apply
            </button>
            {activeCount > 0 && (
              <button
                onClick={handleClear}
                className="flex items-center gap-1 text-red-600 text-sm font-medium hover:underline"
              >
                <X size={13} />
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}