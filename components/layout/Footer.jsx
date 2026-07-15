import { APP_NAME } from "./../../utils/constant";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white mt-10">
      <div className="max-w-6xl mx-auto px-4 py-6 text-center">
        <p className="text-sage">{APP_NAME}</p>
        <p className="text-sm mt-1">
          © {year} {APP_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}