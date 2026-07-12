export default function SwatchPage() {
  return (
    <main className="p-8 space-y-12">
      <h1 className="font-heading text-4xl">Design System Swatch Page</h1>

      {/* --- COLOR SWATCHES --- */}
      <section>
        <h2 className="font-heading text-2xl mb-4">Color Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-background border border-border">Background</div>
          <div className="p-4 rounded-lg bg-foreground text-background">Foreground</div>
          <div className="p-4 rounded-lg bg-primary text-primary-foreground">Primary</div>
          <div className="p-4 rounded-lg bg-secondary text-secondary-foreground">Secondary</div>
          <div className="p-4 rounded-lg bg-accent text-accent-foreground">Accent</div>
          <div className="p-4 rounded-lg bg-muted text-muted-foreground">Muted</div>
          <div className="p-4 rounded-lg bg-card text-card-foreground border border-border">Card</div>
          <div className="p-4 rounded-lg border-2 border-border">Border</div>
        </div>
      </section>

      {/* --- TYPOGRAPHY --- */}
      <section>
        <h2 className="font-heading text-2xl mb-4">Typography</h2>
        <div className="space-y-4">
          <h1 className="font-heading text-5xl">Heading 1 (font-heading)</h1>
          <h2 className="font-heading text-4xl">Heading 2 (font-heading)</h2>
          <h3 className="font-heading text-3xl">Heading 3 (font-heading)</h3>
          <p className="font-sans text-base">Body Text (font-sans). Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <p className="font-sans text-sm text-muted-foreground">Muted Body Text (font-sans, text-muted-foreground).</p>
        </div>
      </section>

      {/* --- COMPONENT EXAMPLES --- */}
      <section>
        <h2 className="font-heading text-2xl mb-4">Components</h2>
        <div className="space-y-4 p-6 bg-card rounded-lg border">
           {/* Assuming you have these Shadcn components */}
           <button className="bg-primary text-primary-foreground p-2 rounded-md">Primary Button</button>
           <div>
              <label className="text-sm font-medium text-muted-foreground">Email Input</label>
              <input className="w-full p-2 mt-1 bg-background border border-border rounded-md" placeholder="you@example.com" />
           </div>
        </div>
      </section>
    </main>
  );
}