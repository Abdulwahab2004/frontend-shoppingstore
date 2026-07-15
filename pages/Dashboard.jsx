import { useAuth } from "../hooks/useauth";
import Button from "../components/common/Button";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <section className="max-w-4xl mx-auto px-4 py-16">
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-dark mb-2">
          Welcome, {user?.name || "User"}
        </h1>
        <p className="text-forest mb-6">{user?.email}</p>

        <Button variant="outline" onClick={logout}>
          Logout
        </Button>
      </div>
    </section>
  );
}