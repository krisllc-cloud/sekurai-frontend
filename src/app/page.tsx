import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import AgenticNetwork from "@/components/AgenticNetwork";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-grid bg-glow relative overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="glass-strong rounded-2xl px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500 flex items-center justify-center glow-blue">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold text-gray-900">SekurAI</span>
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm">
              <Link href="#features" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">Features</Link>
              <Link href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">Pricing</Link>
              <Link href="/docs" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">Docs</Link>
            </div>

            <div className="flex items-center gap-4">
              <SignedOut>
                <Link href="/sign-in" className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-300">
                  Sign In
                </Link>
                <Link href="/sign-up" className="btn-primary text-sm !py-2.5 !px-5">
                  Start Free Trial
                </Link>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard" className="btn-primary text-sm !py-2.5 !px-5">
                  Dashboard
                </Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-gray-700">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Now in Beta — Get early access
              </div>

              <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight">
                <span className="text-gray-900">Agentic</span>
                <br />
                <span className="text-gradient-animated">Penetration</span>
                <br />
                <span className="text-gradient-cyan">Testing</span>
              </h1>

              <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
                AI agents that <span className="text-gray-900 font-semibold">reason, adapt, and chain attacks</span> autonomously —
                just like elite pentesters, running 24/7.
              </p>

              <div className="flex gap-4 pt-4">
                <Link href="/sign-up" className="btn-primary">
                  Start Free Trial
                </Link>
                <Link href="#demo" className="btn-secondary flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Watch Demo
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-8 border-t border-gray-200">
                <div>
                  <div className="text-3xl font-bold text-gradient-blue">15+</div>
                  <div className="text-sm text-gray-500">AI Agents</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gradient-cyan">99%</div>
                  <div className="text-sm text-gray-500">Accuracy</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">24/7</div>
                  <div className="text-sm text-gray-500">Monitoring</div>
                </div>
              </div>
            </div>

            {/* Right: Agentic Network Visual */}
            <div className="relative animate-float">
              <AgenticNetwork />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gray-900">Why </span>
              <span className="text-gradient-blue">SekurAI</span>
              <span className="text-gray-900">?</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Not another scanner. True AI reasoning that thinks like a hacker.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="feature-card group">
              <div className="icon-container icon-blue mb-6">
                <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">Autonomous Reasoning</h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI agents think and adapt in real-time, finding vulnerabilities that pattern-matching scanners miss.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="feature-card group">
              <div className="icon-container icon-cyan mb-6">
                <svg className="w-7 h-7 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-cyan-600 transition-colors">Attack Chain Discovery</h3>
              <p className="text-gray-600 leading-relaxed">
                Visualize complex attack paths. Credential to escalation to database dump — automatically chained.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="feature-card group">
              <div className="icon-container icon-green mb-6">
                <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-green-600 transition-colors">Evidence-First Results</h3>
              <p className="text-gray-600 leading-relaxed">
                Every finding includes proof. Screenshots, requests, extracted data. Zero false positives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="glass-strong rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 pointer-events-none"></div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4 relative z-10 text-gray-900">
              Ready to secure your application?
            </h2>
            <p className="text-gray-600 mb-8 text-lg relative z-10">
              Start your free trial today. No credit card required.
            </p>
            <Link href="/sign-up" className="btn-primary text-lg !px-10 !py-4 relative z-10 inline-block">
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-6 relative z-10 bg-white/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500"></div>
            <span className="font-bold text-lg text-gray-900">SekurAI</span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2025 SekurAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
