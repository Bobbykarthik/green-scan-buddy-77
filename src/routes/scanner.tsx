import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { WASTE_INFO, demoClassify, addScan, type WasteType } from "../lib/waste";

export const Route = createFileRoute("/scanner")({
  head: () => ({
    meta: [
      { title: "Waste Scanner — EcoSort AI" },
      {
        name: "description",
        content: "Upload a waste image and let AI identify the waste type with a confidence score and disposal instructions.",
      },
      { property: "og:title", content: "Waste Scanner — EcoSort AI" },
      { property: "og:description", content: "Upload a waste image and get an AI classification instantly." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Scanner,
});

type Phase = "idle" | "ready" | "scanning" | "done";

interface Result {
  type: WasteType;
  confidence: number;
}

function Scanner() {
  const [image, setImage] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<Result | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  function loadFile(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      setResult(null);
      setPhase("ready");
    };
    reader.readAsDataURL(file);
  }

  async function scan() {
    if (!image) return;
    setPhase("scanning");
    const r = await demoClassify();
    setResult(r);
    setPhase("done");
    addScan({
      image,
      type: r.type,
      confidence: r.confidence,
      recyclable: WASTE_INFO[r.type].recyclable,
    });
  }

  function reset() {
    setImage(null);
    setResult(null);
    setPhase("idle");
    if (fileInput.current) fileInput.current.value = "";
  }

  const info = result ? WASTE_INFO[result.type] : null;

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold md:text-4xl">Waste Scanner</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Upload a photo of a waste item and the AI will identify its type.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {/* Upload card */}
        <div className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border">
          <h2 className="font-bold">1 · Upload image</h2>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => loadFile(e.target.files?.[0])}
          />

          {!image ? (
            <button
              onClick={() => fileInput.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                loadFile(e.dataTransfer.files?.[0]);
              }}
              className={`mt-4 flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-colors ${
                dragOver ? "border-primary bg-accent" : "border-input bg-muted/40 hover:bg-accent"
              }`}
            >
              <span className="text-4xl">🗑️</span>
              <span className="text-sm font-semibold">Click or drop an image here</span>
              <span className="text-xs text-muted-foreground">JPG, PNG — any waste item photo</span>
            </button>
          ) : (
            <div className="relative mt-4">
              <img
                src={image}
                alt="Uploaded waste item"
                className="aspect-[4/3] w-full rounded-xl object-cover"
              />
              {phase === "scanning" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-foreground/50">
                  <div className="h-1 w-3/4 overflow-hidden rounded-full bg-card/30">
                    <div className="scan-line h-full w-full bg-primary" />
                  </div>
                  <p className="text-sm font-semibold text-card">AI analyzing…</p>
                </div>
              )}
              {phase !== "scanning" && (
                <button
                  onClick={reset}
                  className="absolute right-2 top-2 rounded-lg bg-card/90 px-2.5 py-1.5 text-xs font-semibold shadow hover:bg-card"
                >
                  ✕ Remove
                </button>
              )}
            </div>
          )}

          <button
            onClick={scan}
            disabled={phase !== "ready"}
            className="mt-4 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
          >
            {phase === "scanning" ? "Analyzing…" : "Identify Waste Type"}
          </button>
        </div>

        {/* Result card */}
        <div className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border">
          <h2 className="font-bold">2 · AI result</h2>

          {phase === "done" && result && info ? (
            <div className="fade-up mt-4 space-y-4">
              <div className="flex items-center gap-4 rounded-xl bg-accent p-4">
                <span className="text-4xl">{info.icon}</span>
                <div>
                  <p className="text-2xl font-extrabold text-primary">{result.type}</p>
                  <span
                    className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      info.recyclable
                        ? "bg-primary/10 text-primary"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {info.recyclable ? "♻️ Recyclable" : "🚫 Not recyclable — compost instead"}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-semibold">
                  <span>Confidence</span>
                  <span className="text-primary">{result.confidence}%</span>
                </div>
                <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-700"
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>
              </div>

              <div className="rounded-xl bg-secondary p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-secondary-foreground/70">
                  Disposal instruction
                </p>
                <p className="mt-1 text-sm leading-relaxed text-secondary-foreground">
                  {info.instruction}
                </p>
              </div>

              <p className="text-center text-xs text-muted-foreground">
                ✓ Saved to your scan history
              </p>
            </div>
          ) : (
            <div className="mt-4 flex aspect-[4/3] flex-col items-center justify-center gap-3 rounded-xl bg-muted/40 text-center">
              <span className="text-4xl">{phase === "scanning" ? "⏳" : "🔍"}</span>
              <p className="max-w-[220px] text-sm text-muted-foreground">
                {phase === "scanning"
                  ? "The AI model is examining your image…"
                  : "Your classification result will appear here after scanning."}
              </p>
            </div>
          )}
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Demo mode: AI results are simulated for this final-year project demonstration.
      </p>
    </main>
  );
}
