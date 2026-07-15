import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useauth";
import Loader from "../components/common/Loader";

export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}