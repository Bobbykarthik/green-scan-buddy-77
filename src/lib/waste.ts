export type WasteType = "Plastic" | "Paper" | "Glass" | "Metal" | "Organic";

export interface WasteInfo {
  type: WasteType;
  recyclable: boolean;
  instruction: string;
  color: string; // tailwind-safe hex for charts
  icon: string;
}

export interface ScanRecord {
  id: string;
  image: string; // data URL
  type: WasteType;
  confidence: number;
  recyclable: boolean;
  date: string; // ISO
}

export const WASTE_INFO: Record<WasteType, WasteInfo> = {
  Plastic: {
    type: "Plastic",
    recyclable: true,
    instruction:
      "Rinse the container, remove caps if required, and place it in the blue recycling bin.",
    color: "#3b82f6",
    icon: "🧴",
  },
  Paper: {
    type: "Paper",
    recyclable: true,
    instruction:
      "Keep it dry and flat, remove any plastic tape, and place it in the paper recycling bin.",
    color: "#f59e0b",
    icon: "📄",
  },
  Glass: {
    type: "Glass",
    recyclable: true,
    instruction:
      "Rinse the glass item and place it in the glass recycling container. Handle broken glass with care.",
    color: "#06b6d4",
    icon: "🍾",
  },
  Metal: {
    type: "Metal",
    recyclable: true,
    instruction:
      "Rinse cans and tins, crush them if possible, and place them in the metal recycling bin.",
    color: "#8b5cf6",
    icon: "🥫",
  },
  Organic: {
    type: "Organic",
    recyclable: false,
    instruction:
      "Place it in the green compost bin. Organic waste can be composted into nutrient-rich soil.",
    color: "#22c55e",
    icon: "🍎",
  },
};

export const WASTE_TYPES = Object.keys(WASTE_INFO) as WasteType[];

// ---- Demo AI classifier ----
// Simulates an AI model: waits, then returns a plausible result.
export function demoClassify(): Promise<{ type: WasteType; confidence: number }> {
  return new Promise((resolve) => {
    const delay = 1800 + Math.random() * 1200;
    setTimeout(() => {
      const type = WASTE_TYPES[Math.floor(Math.random() * WASTE_TYPES.length)];
      const confidence = Math.round((82 + Math.random() * 16) * 10) / 10;
      resolve({ type, confidence });
    }, delay);
  });
}

// ---- Local storage of scan history ----
const STORAGE_KEY = "waste-scan-history";

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

// A tiny 1x1 coloured pixel per type, used as placeholder thumbnails for seed rows.
const SEED_IMG =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" rx="14" fill="#e8f5ec"/><text x="40" y="50" font-size="34" text-anchor="middle">♻️</text></svg>`
  );

const SEED_SCANS: ScanRecord[] = [
  { id: "seed-1", image: SEED_IMG, type: "Plastic", confidence: 94.2, recyclable: true, date: daysAgo(0) },
  { id: "seed-2", image: SEED_IMG, type: "Organic", confidence: 91.7, recyclable: false, date: daysAgo(0) },
  { id: "seed-3", image: SEED_IMG, type: "Paper", confidence: 88.4, recyclable: true, date: daysAgo(1) },
  { id: "seed-4", image: SEED_IMG, type: "Plastic", confidence: 96.1, recyclable: true, date: daysAgo(1) },
  { id: "seed-5", image: SEED_IMG, type: "Glass", confidence: 90.3, recyclable: true, date: daysAgo(2) },
  { id: "seed-6", image: SEED_IMG, type: "Metal", confidence: 93.8, recyclable: true, date: daysAgo(2) },
  { id: "seed-7", image: SEED_IMG, type: "Organic", confidence: 87.5, recyclable: false, date: daysAgo(3) },
  { id: "seed-8", image: SEED_IMG, type: "Paper", confidence: 92.9, recyclable: true, date: daysAgo(4) },
  { id: "seed-9", image: SEED_IMG, type: "Plastic", confidence: 89.6, recyclable: true, date: daysAgo(5) },
  { id: "seed-10", image: SEED_IMG, type: "Glass", confidence: 95.0, recyclable: true, date: daysAgo(6) },
];

export function getScans(): ScanRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_SCANS));
      return SEED_SCANS;
    }
    return JSON.parse(raw) as ScanRecord[];
  } catch {
    return SEED_SCANS;
  }
}

export function addScan(scan: Omit<ScanRecord, "id" | "date">): ScanRecord {
  const record: ScanRecord = {
    ...scan,
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
  };
  const scans = [record, ...getScans()];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scans));
  return record;
}

export function clearScans() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
}
