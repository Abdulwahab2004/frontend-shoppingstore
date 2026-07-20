import { APP_NAME } from "./../../utils/constant";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white mt-10 font-poppins">
      <div className="max-w-6xl mx-auto px-4 py-6 text-center">
        <p className="text-sage font-poppins">{APP_NAME}</p>
        <p className="text-sm mt-1 font-poppins">
          © {year} {APP_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}