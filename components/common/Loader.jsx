export default function Loader({ size = "md" }) {
  const sizes = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div className="flex items-center justify-center py-6">
      <div
        className={`${sizes[size]} rounded-full border-sage border-t-fern animate-spin font-poppins`}
      />
    </div>
  );
}