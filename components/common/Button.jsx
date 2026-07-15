export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  fullWidth = false,
  disabled = false,
  isLoading = false,
}) {
  const base =
    "px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-fern text-white hover:bg-forest",
    secondary: "bg-sage text-dark hover:bg-fern hover:text-white",
    outline: "border border-fern text-fern hover:bg-fern hover:text-white",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""}`}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
}