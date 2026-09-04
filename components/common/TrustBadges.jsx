import { Truck, ShieldCheck, RotateCcw, Headset } from "lucide-react";

const stats = [
  {
    icon: Truck,
    value: "95%",
    label: "On-Time Delivery",
    desc: "Orders delivered as promised, every time.",
  },
  {
    icon: ShieldCheck,
    value: "98%",
    label: "Customer Satisfaction",
    desc: "Rated by thousands of happy shoppers.",
  },
  {
    icon: RotateCcw,
    value: "15 Days",
    label: "Easy Returns",
    desc: "Change of mind? Return it, hassle-free.",
  },
  {
    icon: Headset,
    value: "24/7",
    label: "Customer Support",
    desc: "We're here to help, whenever you need.",
  },
];

export default function TrustBadges() {
  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 py-10">
      <div className="rounded-2xl bg-gradient-to-r from-forest to-fern px-6 py-8 sm:px-10 sm:py-10 shadow-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {stats.map(({ icon: Icon, value, label, desc }) => (
            <div
              key={label}
              className="group flex flex-col items-center text-center gap-2 sm:flex-row sm:text-left sm:items-start"
            >
              <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/25 group-hover:scale-105">
                <Icon className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-white leading-tight">
                  {value}
                </p>
                <p className="text-sm font-semibold text-white/90">{label}</p>
                <p className="hidden sm:block text-xs text-white/70 mt-1">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}