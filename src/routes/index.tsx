import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EcoSort AI — Smart Waste Segregation" },
      {
        name: "description",
        content:
          "Upload a photo of waste and let AI identify whether it's plastic, paper, glass, metal, or organic — with recycling guidance.",
      },
      { property: "og:title", content: "EcoSort AI — Smart Waste Segregation" },
      {
        property: "og:description",
        content:
          "Upload a photo of waste and let AI identify the waste type with recycling guidance.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Home,
});

const STEPS = [
  {
    icon: "📸",
    title: "Upload a photo",
    text: "Take or upload a picture of any waste item you want to identify.",
  },
  {
    icon: "🤖",
    title: "AI analyzes it",
    text: "The AI model identifies the waste type and gives a confidence score.",
  },
  {
    icon: "♻️",
    title: "Dispose it right",
    text: "Get a clear recycling verdict and a simple disposal instruction.",
  },
];

const TYPES = [
  { icon: "🧴", name: "Plastic", note: "Bottles, bags, containers" },
  { icon: "📄", name: "Paper", note: "Newspapers, cardboard" },
  { icon: "🍾", name: "Glass", note: "Bottles, jars" },
  { icon: "🥫", name: "Metal", note: "Cans, tins, foil" },
  { icon: "🍎", name: "Organic", note: "Food scraps, peels" },
];

function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-accent to-background">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div className="fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1 text-xs font-semibold text-primary shadow-sm ring-1 ring-border">
              🌱 AI-Powered Recycling
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight md:text-5xl">
              Sort waste smarter with <span className="text-primary">AI</span>
            </h1>
            <p className="mt-4 max-w-md text-base text-muted-foreground md:text-lg">
              EcoSort AI identifies waste from a single photo — plastic, paper, glass,
              metal, or organic — and tells you exactly how to dispose of it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/scanner"
                className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-transform hover:scale-[1.03]"
              >
                Scan Waste Now →
              </Link>
              <Link
                to="/dashboard"
                className="rounded-xl bg-card px-6 py-3 text-sm font-semibold text-foreground shadow-sm ring-1 ring-border transition-colors hover:bg-accent"
              >
                View Dashboard
              </Link>
            </div>
            <div className="mt-10 flex gap-8">
              {[
                ["5", "Waste types"],
                ["95%", "Avg. accuracy"],
                ["<2s", "Scan time"],
              ].map(([v, l]) => (
                <div key={l}>
                  <p className="text-2xl font-extrabold text-primary">{v}</p>
                  <p className="text-xs font-medium text-muted-foreground">{l}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="fade-up relative mx-auto w-full max-w-sm" style={{ animationDelay: "0.15s" }}>
            <div className="rounded-3xl bg-card p-6 shadow-xl ring-1 ring-border">
              <div className="flex aspect-square items-center justify-center rounded-2xl bg-accent text-7xl">
                🧴
              </div>
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
                    Plastic
                  </span>
                  <span className="text-sm font-semibold text-muted-foreground">94.2% confident</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[94%] rounded-full bg-primary" />
                </div>
                <p className="rounded-xl bg-secondary p-3 text-xs leading-relaxed text-secondary-foreground">
                  ♻️ Recyclable — rinse and place in the blue recycling bin.
                </p>
              </div>
            </div>
            <div className="absolute -right-4 -top-4 rounded-2xl bg-leaf px-4 py-2 text-xs font-bold text-leaf-foreground shadow-lg">
              AI Result ✓
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold">How it works</h2>
        <p className="mx-auto mt-2 max-w-md text-center text-sm text-muted-foreground">
          Three simple steps to sort any waste item correctly.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.title} className="card-lift rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border">
              <div className="flex items-center gap-3">
                <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-2xl">
                  {s.icon}
                </span>
                <span className="text-xs font-bold text-muted-foreground">STEP {i + 1}</span>
              </div>
              <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Waste types */}
      <section className="bg-leaf py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold text-leaf-foreground">
            Five waste categories
          </h2>
          <p className="mx-auto mt-2 max-w-md text-center text-sm text-leaf-foreground/70">
            The AI classifies every scan into one of these types.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {TYPES.map((t) => (
              <div
                key={t.name}
                className="card-lift rounded-2xl bg-card/95 p-5 text-center shadow-sm"
              >
                <span className="text-3xl">{t.icon}</span>
                <h3 className="mt-2 font-bold">{t.name}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">{t.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h2 className="text-3xl font-bold">Ready to sort your first item?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Upload a photo and get an instant AI classification.
        </p>
        <Link
          to="/scanner"
          className="mt-6 inline-block rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-transform hover:scale-[1.03]"
        >
          Open the Waste Scanner →
        </Link>
      </section>
    </main>
  );
}
