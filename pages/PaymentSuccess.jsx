import { Link, useSearchParams } from "react-router-dom";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <section className="max-w-md mx-auto px-4 py-16 text-center">
      <div className="bg-white border border-sage rounded-lg p-6">
        <h1 className="text-2xl font-bold text-dark mb-2">Payment Successful!</h1>
        <p className="text-forest mb-6">
          Thank you for your order. A confirmation has been recorded.
        </p>
        <Link to="/products" className="text-fern font-medium hover:underline">
          Continue Shopping
        </Link>
      </div>
    </section>
  );
}