export function Footer() {
  return (
    <footer className="mt-auto border-t bg-card">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-center sm:flex-row sm:text-left">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm text-primary-foreground">
            ♻️
          </span>
          <div>
            <p className="text-sm font-bold">EcoSort AI</p>
            <p className="text-xs text-muted-foreground">Smart waste segregation for a cleaner tomorrow</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Final-year project demo · AI results are simulated for demonstration
        </p>
      </div>
    </footer>
  );
}
