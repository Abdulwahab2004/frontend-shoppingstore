import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useauth";
import Loader from "../components/common/Loader";
import AdminLayout from "../Layouts/AdminLayout";

export default function AdminRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <Loader />;

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <AdminLayout>{children}</AdminLayout>;
}