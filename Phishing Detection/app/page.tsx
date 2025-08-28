import { UrlAnalyzer } from "@/components/url-analyzer"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
            Phishing Website Detection
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Analyze any URL to detect potential phishing attacks and get a detailed risk assessment.
          </p>
        </header>

        <UrlAnalyzer />
      </div>
    </main>
  )
}
