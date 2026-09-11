import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getScans, WASTE_INFO, WASTE_TYPES, type ScanRecord } from "../lib/waste";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — EcoSort AI" },
      { name: "description", content: "See your total scanned items, recyclable rate, and a chart of waste types." },
      { property: "og:title", content: "Dashboard — EcoSort AI" },
      { property: "og:description", content: "Scan statistics and waste type breakdown." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [scans, setScans] = useState<ScanRecord[]>([]);

  useEffect(() => {
    setScans(getScans());
  }, []);

  const total = scans.length;
  const recyclable = scans.filter((s) => s.recyclable).length;
  const avgConfidence =
    total === 0 ? 0 : Math.round((scans.reduce((a, s) => a + s.confidence, 0) / total) * 10) / 10;

  const counts = WASTE_TYPES.map((t) => ({
    type: t,
    count: scans.filter((s) => s.type === t).length,
  }));
  const max = Math.max(1, ...counts.map((c) => c.count));

  const stats = [
    { icon: "📷", label: "Total scans", value: total },
    { icon: "♻️", label: "Recyclable items", value: recyclable },
    { icon: "🎯", label: "Avg. confidence", value: `${avgConfidence}%` },
    { icon: "🌍", label: "CO₂ saved (est.)", value: `${(recyclable * 0.4).toFixed(1)} kg` },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold md:text-4xl">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            An overview of your waste-scanning activity.
          </p>
        </div>
        <Link
          to="/scanner"
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-transform hover:scale-[1.03]"
        >
          + New Scan
        </Link>
      </div>

      {/* Stat cards */}
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card-lift rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
            <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-xl">
              {s.icon}
            </span>
            <p className="mt-3 text-2xl font-extrabold">{s.value}</p>
            <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        {/* Bar chart */}
        <div className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border lg:col-span-3">
          <h2 className="font-bold">Waste types scanned</h2>
          <p className="text-xs text-muted-foreground">Number of items per category</p>
          <div className="mt-6 flex h-52 items-end justify-around gap-3">
            {counts.map((c) => (
              <div key={c.type} className="flex h-full w-full max-w-20 flex-col items-center justify-end gap-2">
                <span className="text-xs font-bold">{c.count}</span>
                <div
                  className="w-full rounded-t-lg transition-all duration-700"
                  style={{
                    height: `${(c.count / max) * 78}%`,
                    minHeight: c.count > 0 ? "10px" : "3px",
                    backgroundColor: WASTE_INFO[c.type].color,
                    opacity: c.count > 0 ? 1 : 0.25,
                  }}
                />
                <span className="text-lg" title={c.type}>
                  {WASTE_INFO[c.type].icon}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-around gap-3 text-center">
            {counts.map((c) => (
              <span key={c.type} className="w-full max-w-20 text-[11px] font-medium text-muted-foreground">
                {c.type}
              </span>
            ))}
          </div>
        </div>

        {/* Breakdown */}
        <div className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border lg:col-span-2">
          <h2 className="font-bold">Category share</h2>
          <p className="text-xs text-muted-foreground">Percentage of all scans</p>
          <div className="mt-5 space-y-4">
            {counts.map((c) => {
              const pct = total === 0 ? 0 : Math.round((c.count / total) * 100);
              return (
                <div key={c.type}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">
                      {WASTE_INFO[c.type].icon} {c.type}
                    </span>
                    <span className="font-semibold text-muted-foreground">{pct}%</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: WASTE_INFO[c.type].color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
