export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-lg border border-sage text-dark hover:bg-sage/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
      >
        Prev
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1 rounded-lg border transition-colors duration-200 ${
            p === currentPage
              ? "bg-fern text-white border-fern"
              : "border-sage text-dark hover:bg-sage/20"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-lg border border-sage text-dark hover:bg-sage/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
      >
        Next
      </button>
    </div>
  );
}