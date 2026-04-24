export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-900 text-neutral-100">
      <div className="max-w-4xl mx-auto px-6 py-24">
        <div className="space-y-16">
          {/* Hero Section */}
          <section className="text-center space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Next.js Starter
            </h1>
            <p className="text-xl md:text-2xl text-neutral-400 max-w-2xl mx-auto">
              A minimal, AI-friendly Next.js 16 template with TypeScript and Tailwind CSS 4. Ready to build anything.
            </p>
          </section>

          {/* Tech Stack */}
          <section className="space-y-4">
            <h2 className="text-3xl font-semibold text-center">Tech Stack</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              {[
                ["Next.js 16", "App Router"],
                ["React 19", "Server Components"],
                ["TypeScript", "Strict Mode"],
                ["Tailwind CSS 4", "Utility-first"],
                ["Bun", "Fast Package Manager"],
              ].map(([tech, desc]) => (
                <div key={tech} className="p-4 rounded-lg bg-neutral-800 border border-neutral-700">
                  <div className="font-semibold text-blue-400">{tech}</div>
                  <div className="text-sm text-neutral-400">{desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Getting Started */}
          <section className="space-y-4">
            <h2 className="text-3xl font-semibold text-center">Getting Started</h2>
            <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
              <p className="mb-4 text-neutral-300">
                This template is designed for AI-assisted development. Start the dev server and describe what you want to build.
              </p>
              <div className="space-y-2">
                <code className="block text-emerald-400">
                  $ bun install
                </code>
                <code className="block text-emerald-400">
                  $ bun dev
                </code>
                <p className="text-neutral-400 text-sm mt-4">
                  Then visit <span className="text-blue-400">http://localhost:3000</span>
                </p>
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="space-y-4">
            <h2 className="text-3xl font-semibold text-center">Features</h2>
            <ul className="grid md:grid-cols-2 gap-3 text-lg">
              {[
                "Zero config TypeScript with strict mode",
                "Tailwind CSS 4 pre-configured",
                "ESLint for code quality",
                "Memory bank for AI context",
                "Recipe system for common features (database, auth)",
                "Optimized production builds",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <span className="text-emerald-400">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
