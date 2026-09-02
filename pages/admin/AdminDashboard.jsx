
import { useEffect, useState } from "react";
import { getDashboardStats } from "../../services/adminService";
import Loader from "../../components/common/Loader";

function RevenueChart({ data }) {
  if (!data || data.length === 0) {
    return <p className="text-forest">No revenue data for the last 7 days.</p>;
  }

  const maxValue = Math.max(...data.map((d) => d.total), 1);

  return (
    <div className="flex items-end gap-3 h-40 bg-white border border-sage rounded-lg p-4">
      {data.map((d) => (
        <div key={d._id} className="flex flex-col items-center flex-1">
          <div
            className="w-full bg-fern rounded-t"
            style={{ height: `${(d.total / maxValue) * 100}%` }}
            title={`$${d.total.toFixed(2)}`}
          />
          <span className="text-xs text-forest mt-1">
            {new Date(d._id).toLocaleDateString(undefined, { weekday: "short" })}
          </span>
        </div>
      ))}
    </div>
  );
}
function StatCard({ label, value }) {
  return (
    <div className="bg-white border border-sage rounded-lg p-4">
      <p className="text-sm text-forest">{label}</p>
      <p className="text-2xl font-bold text-dark mt-1">{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        setError("Failed to load dashboard stats");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) return <Loader />;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-dark mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <StatCard label="Total Users" value={stats.totalUsers} />
        <StatCard label="Total Products" value={stats.totalProducts} />
        <StatCard label="Total Categories" value={stats.totalCategories} />
        <StatCard label="Total Orders" value={stats.totalOrders} />
        <StatCard label="Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} />
      </div>
<h2 className="text-lg font-semibold text-dark mb-3">Revenue (Last 7 Days)</h2>
<RevenueChart data={stats.revenueByDay} />

<h2 className="text-lg font-semibold text-dark mb-3 mt-8">Recent Orders</h2>
      <h2 className="text-lg font-semibold text-dark mb-3">Recent Orders</h2>
      <div className="bg-white border border-sage rounded-lg overflow-hidden">
        {stats.recentOrders.length === 0 ? (
          <p className="p-4 text-forest">No orders yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-sage/20 text-dark text-left">
              <tr>
                <th className="p-3">Customer</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order._id} className="border-t border-sage/50">
                  <td className="p-3">{order.user?.name || "Unknown"}</td>
                  <td className="p-3">${order.totalAmount.toFixed(2)}</td>
                  <td className="p-3 capitalize">{order.status}</td>
                  <td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}