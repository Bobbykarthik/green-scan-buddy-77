import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getScans, clearScans, WASTE_INFO, type ScanRecord } from "../lib/waste";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Scan History — EcoSort AI" },
      { name: "description", content: "Browse every waste item you've scanned with EcoSort AI." },
      { property: "og:title", content: "Scan History — EcoSort AI" },
      { property: "og:description", content: "Browse every waste item you've scanned." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: History,
});

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function History() {
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [filter, setFilter] = useState<string>("All");

  useEffect(() => {
    setScans(getScans());
  }, []);

  const filtered = filter === "All" ? scans : scans.filter((s) => s.type === filter);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold md:text-4xl">Scan History</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {scans.length} item{scans.length === 1 ? "" : "s"} scanned so far.
          </p>
        </div>
        {scans.length > 0 && (
          <button
            onClick={() => {
              clearScans();
              setScans([]);
            }}
            className="rounded-xl bg-card px-4 py-2 text-sm font-semibold text-destructive ring-1 ring-border transition-colors hover:bg-destructive/10"
          >
            Clear history
          </button>
        )}
      </div>

      {/* Filter chips */}
      <div className="mt-6 flex flex-wrap gap-2">
        {["All", "Plastic", "Paper", "Glass", "Metal", "Organic"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              filter === f
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground ring-1 ring-border hover:bg-accent"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl bg-card py-16 text-center shadow-sm ring-1 ring-border">
          <span className="text-5xl">🗑️</span>
          <p className="font-semibold">No scans found</p>
          <p className="max-w-xs text-sm text-muted-foreground">
            Upload a waste image in the scanner and it will appear here.
          </p>
          <Link
            to="/scanner"
            className="mt-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Scan something →
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => {
            const info = WASTE_INFO[s.type];
            return (
              <div
                key={s.id}
                className="card-lift overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border"
              >
                <div className="flex items-center gap-4 p-4">
                  <img
                    src={s.image}
                    alt={`Scanned ${s.type} waste`}
                    className="size-16 rounded-xl object-cover ring-1 ring-border"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{info.icon} {s.type}</span>
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                        style={{
                          backgroundColor: `${info.color}1f`,
                          color: info.color,
                        }}
                      >
                        {s.confidence}%
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(s.date)}</p>
                  </div>
                </div>
                <div className="border-t px-4 py-3">
                  <span
                    className={`text-xs font-semibold ${
                      s.recyclable ? "text-primary" : "text-destructive"
                    }`}
                  >
                    {s.recyclable ? "♻️ Recyclable" : "🚫 Not recyclable"}
                  </span>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {info.instruction}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
