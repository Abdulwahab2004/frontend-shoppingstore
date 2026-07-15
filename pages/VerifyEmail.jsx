import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("pending"); // pending | success | error
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = () => {
    setIsLoading(true);

    // TODO: call backend verify-email API with the token in the next step
    console.log("Verifying token:", token);

    setIsLoading(false);
    setStatus("success"); // placeholder — replace with real API result
  };

  return (
    <section className="max-w-md mx-auto px-4 py-16 text-center">
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-dark mb-4">
          Verify Your Email
        </h1>

        {isLoading && <Loader />}

        {!isLoading && status === "pending" && (
          <>
            <p className="text-forest mb-6">
              Click the button below to verify your email address.
            </p>
            <Button onClick={handleVerify} fullWidth>
              Verify Email
            </Button>
          </>
        )}

        {!isLoading && status === "success" && (
          <>
            <p className="text-fern font-medium mb-6">
              Your email has been verified!
            </p>
            <Link to="/login" className="text-fern font-medium hover:underline">
              Go to Login
            </Link>
          </>
        )}

        {!isLoading && status === "error" && (
          <p className="text-red-600 font-medium">
            Verification failed. Please try again.
          </p>
        )}
      </div>
    </section>
  );
}