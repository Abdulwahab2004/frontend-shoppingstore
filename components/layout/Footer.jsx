import { APP_NAME } from "../../utils/constant";
import { Link } from "react-router-dom";
import NewsletterSignup from "../../pages/NewsletterSignup";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white mt-10 font-poppins">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col items-center gap-6">
        <Link
          to="/contact"
          className="text-sage hover:text-white text-sm transition-colors duration-200"
        >
          Contact Us
        </Link>

        <NewsletterSignup />

        <div className="text-center pt-4 border-t border-white/10 w-full">
          <p className="text-sage font-poppins">{APP_NAME}</p>
          <p className="text-sm mt-1 font-poppins">
            © {year} {APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}