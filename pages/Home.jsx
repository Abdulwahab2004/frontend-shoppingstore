import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="bg-sage/20">
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-dark mb-4">
          Shop Smarter, Live Better
        </h1>
        <p className="text-base md:text-lg text-forest mb-8">
          Discover quality products at prices you'll love.
        </p>
        <Link
          to="/signup"
          className="inline-block bg-fern text-white px-6 py-3 rounded-lg font-medium hover:bg-forest transition-colors duration-200"
        >
          Get Started
        </Link>
      </div>
    </section>
  );
}