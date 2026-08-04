const workflow = [
  "Search web, academic, and code sources from one research question.",
  "Select credible sources and keep normalized metadata for citations.",
  "Draft sections with a Gemini-backed assistant that stays honest about missing evidence.",
  "Publish marketing, help, and research templates from Contentstack.",
];

const stack = [
  ["AI provider", "Google Gemini Developer API free tier for development"],
  ["CMS", "Contentstack Delivery API for editable pages and templates"],
  ["App", "Next.js App Router, React, Tailwind, shadcn/ui"],
  ["Future data layer", "Postgres with pgvector, Redis queues, Yjs document state"],
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#191816]">
      <section className="border-b border-[#ded8cc] bg-[#fbfaf6]">
        <div className="mx-auto flex min-h-[72vh] w-full max-w-6xl flex-col justify-between px-6 py-8 sm:px-10 lg:px-12">
          <nav className="flex items-center justify-between text-sm">
            <span className="font-semibold tracking-[0.18em] text-[#6f5d3f] uppercase">
              Synthara
            </span>
            <div className="flex gap-5 text-[#5b574f]">
              <a href="#overview" className="hover:text-[#191816]">
                Overview
              </a>
              <a href="#docs" className="hover:text-[#191816]">
                Plan
              </a>
            </div>
          </nav>

          <div id="overview" className="grid gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div className="max-w-2xl">
              <p className="mb-5 text-sm font-medium text-[#8a5a25]">
                AI research assistant SaaS
              </p>
              <h1 className="text-4xl font-semibold leading-tight text-[#191816] sm:text-6xl">
                Research discovery, drafting, and citations in one workspace.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-[#5b574f]">
                Synthara is designed around a dual-pane research flow: source discovery on one
                side, an AI-assisted editor on the other, and citation data that follows the
                document from outline to export.
              </p>
            </div>

            <div className="border border-[#ded8cc] bg-white p-5 shadow-sm">
              <div className="border-b border-[#e8e2d6] pb-4">
                <p className="text-sm font-medium text-[#8a5a25]">Development setup</p>
                <h2 className="mt-2 text-2xl font-semibold">Free-first integrations</h2>
              </div>
              <dl className="divide-y divide-[#eee8dd]">
                {stack.map(([label, value]) => (
                  <div key={label} className="grid gap-2 py-4 sm:grid-cols-[8rem_1fr]">
                    <dt className="text-sm font-medium text-[#6f675d]">{label}</dt>
                    <dd className="text-sm leading-6 text-[#26231f]">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section
        id="docs"
        className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-12 sm:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:px-12"
      >
        <div>
          <p className="text-sm font-medium text-[#8a5a25]">Product flow</p>
          <h2 className="mt-3 text-3xl font-semibold">What this foundation enables</h2>
        </div>
        <ol className="grid gap-3 sm:grid-cols-2">
          {workflow.map((item, index) => (
            <li key={item} className="border border-[#ded8cc] bg-[#fbfaf6] p-5">
              <span className="text-sm font-semibold text-[#8a5a25]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="mt-3 leading-7 text-[#3b3731]">{item}</p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
