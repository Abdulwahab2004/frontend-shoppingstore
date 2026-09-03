import { useEffect, useState } from "react";
import {
  Users,
  Package,
  LayoutGrid,
  ShoppingBag,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { getDashboardStats } from "../../services/adminService";
import Loader from "../../components/common/Loader";

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const RANGE_OPTIONS = [
  { label: "7 days", value: 7 },
  { label: "15 days", value: 15 },
  { label: "30 days", value: 30 },
];

function RevenueChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-sage/60 rounded-xl p-6 text-center">
        <p className="text-forest text-sm">No revenue data for this period.</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.total), 1);
  // Fewer than ~10 bars → show weekday labels under every bar.
  // More than that → thin out labels so they don't overlap.
  const showEveryLabel = data.length <= 10;

  return (
    <div className="bg-white border border-sage/60 rounded-xl p-5">
      <div className="flex items-end gap-1.5 h-48 overflow-x-auto">
        {data.map((d, i) => {
          const dateObj = new Date(d._id);
          const showLabel = showEveryLabel || i % Math.ceil(data.length / 10) === 0;

          return (
            <div
              key={d._id}
              className="flex flex-col items-center justify-end h-full group relative"
              style={{ minWidth: data.length > 15 ? "20px" : "32px", flex: 1 }}
            >
              {/* Tooltip on hover */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dark text-white text-[11px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                ${d.total.toFixed(2)}
              </div>

              <div
                className="w-full bg-gradient-to-t from-fern to-fern/60 rounded-t-md transition-all duration-500 ease-out group-hover:from-forest group-hover:to-forest/70"
                style={{ height: `${Math.max((d.total / maxValue) * 100, 3)}%` }}
              />

              <span className="text-[10px] text-forest mt-2 whitespace-nowrap">
                {showLabel
                  ? dateObj.toLocaleDateString(undefined, { month: "short", day: "numeric" })
                  : ""}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, accent }) {
  return (
    <div className="bg-white border border-sage/60 rounded-xl p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-forest uppercase tracking-wide">{label}</p>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accent}`}>
          <Icon size={16} />
        </div>
      </div>
      <p className="text-2xl font-bold text-dark">{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChartLoading, setIsChartLoading] = useState(false);
  const [error, setError] = useState("");
  const [range, setRange] = useState(7);

  // Initial full load (stats + chart together)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats(range);
        setStats(data);
      } catch (err) {
        setError("Failed to load dashboard stats");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fetch only when the range changes after initial load —
  // keeps the stat cards visible and just refreshes the chart data
  const handleRangeChange = async (newRange) => {
    setRange(newRange);
    setIsChartLoading(true);
    try {
      const data = await getDashboardStats(newRange);
      setStats(data);
    } catch (err) {
      setError("Failed to load dashboard stats");
    } finally {
      setIsChartLoading(false);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp size={22} className="text-fern" />
        <h1 className="text-2xl font-bold text-dark">Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <StatCard
          label="Total Users"
          value={stats.totalUsers}
          icon={Users}
          accent="bg-blue-100 text-blue-600"
        />
        <StatCard
          label="Total Products"
          value={stats.totalProducts}
          icon={Package}
          accent="bg-purple-100 text-purple-600"
        />
        <StatCard
          label="Total Categories"
          value={stats.totalCategories}
          icon={LayoutGrid}
          accent="bg-orange-100 text-orange-600"
        />
        <StatCard
          label="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingBag}
          accent="bg-fern/20 text-fern"
        />
        <StatCard
          label="Total Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          accent="bg-green-100 text-green-600"
        />
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-dark">Revenue Trend</h2>
        <div className="flex bg-sage/15 rounded-lg p-1">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleRangeChange(opt.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-200 ${
                range === opt.value
                  ? "bg-fern text-white"
                  : "text-dark hover:bg-white"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {isChartLoading ? (
        <div className="bg-white border border-sage/60 rounded-xl p-5 h-48 flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <RevenueChart data={stats.revenueByDay} />
      )}

      <h2 className="text-lg font-semibold text-dark mb-3 mt-8">Recent Orders</h2>
      <div className="bg-white border border-sage/60 rounded-xl overflow-hidden">
        {stats.recentOrders.length === 0 ? (
          <p className="p-6 text-center text-forest text-sm">No orders yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-sage/20 text-dark text-left">
              <tr>
                <th className="p-3 font-medium">Customer</th>
                <th className="p-3 font-medium">Amount</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr
                  key={order._id}
                  className="border-t border-sage/40 hover:bg-sage/10 transition-colors duration-150"
                >
                  <td className="p-3 text-dark">{order.user?.name || "Unknown"}</td>
                  <td className="p-3 font-semibold text-dark">${order.totalAmount.toFixed(2)}</td>
                  <td className="p-3">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                        STATUS_STYLES[order.status] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3 text-forest">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}