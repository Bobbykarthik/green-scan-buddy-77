import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — EcoSort AI" },
      {
        name: "description",
        content: "Learn why EcoSort AI was built and how AI-powered waste segregation helps the environment.",
      },
      { property: "og:title", content: "About — EcoSort AI" },
      { property: "og:description", content: "How AI-powered waste segregation helps the environment." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: About,
});

const FEATURES = [
  {
    icon: "🤖",
    title: "AI classification",
    text: "A computer-vision model identifies the waste type from a single photo with a confidence score.",
  },
  {
    icon: "♻️",
    title: "Recycling guidance",
    text: "Every result includes a recyclability verdict and a simple, actionable disposal instruction.",
  },
  {
    icon: "📊",
    title: "Progress tracking",
    text: "The dashboard and history pages show how much you've scanned and what you're recycling.",
  },
];

const FACTS = [
  ["91%", "of plastic ever produced has never been recycled"],
  ["2.1B", "tonnes of waste generated globally each year"],
  ["1 item", "sorted correctly keeps contamination out of a whole recycling batch"],
];

function About() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary">
          🌱 Final-year project
        </span>
        <h1 className="mt-4 text-3xl font-extrabold md:text-4xl">About EcoSort AI</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
          EcoSort AI is a smart waste-segregation assistant. Most recyclable waste ends up in
          landfills simply because people aren't sure which bin to use. By identifying waste from a
          photo, EcoSort AI removes the guesswork and helps everyone dispose of waste correctly.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.title} className="card-lift rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border">
            <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-2xl">
              {f.icon}
            </span>
            <h2 className="mt-4 text-lg font-bold">{f.title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-3xl bg-leaf p-8 md:p-10">
        <h2 className="text-center text-2xl font-bold text-leaf-foreground">Why it matters</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {FACTS.map(([v, l]) => (
            <div key={l} className="text-center">
              <p className="text-3xl font-extrabold text-leaf-foreground">{v}</p>
              <p className="mt-1 text-xs leading-relaxed text-leaf-foreground/75">{l}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border">
        <h2 className="font-bold">How the AI works</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          In a production version, uploaded images would be sent to a convolutional neural network
          (CNN) trained on a labelled waste dataset such as TrashNet. The model outputs class
          probabilities for the five categories, and the highest-scoring class is shown with its
          confidence. For this demonstration, results are simulated so the full experience works
          without a live model.
        </p>
      </div>

      <div className="mt-10 text-center">
        <Link
          to="/scanner"
          className="inline-block rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-transform hover:scale-[1.03]"
        >
          Try the scanner →
        </Link>
      </div>
    </main>
  );
}
