import { Link } from "react-router-dom";

export default function PaymentFailure() {
  return (
    <section className="max-w-md mx-auto px-4 py-16 text-center">
      <div className="bg-white border border-sage rounded-lg p-6">
        <h1 className="text-2xl font-bold text-dark mb-2">Payment Cancelled</h1>
        <p className="text-forest mb-6">
          Your payment was not completed. You can try again anytime.
        </p>
        <Link to="/cart" className="text-fern font-medium hover:underline">
          Back to Cart
        </Link>
      </div>
    </section>
  );
}