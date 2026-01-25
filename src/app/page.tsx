import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function LandingPage() {
  return (
    <div className="min-h-screen gradient-dark">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold">SekurAI</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <Link href="#features" className="hover:text-white transition">Features</Link>
            <Link href="#pricing" className="hover:text-white transition">Pricing</Link>
            <Link href="/docs" className="hover:text-white transition">Docs</Link>
          </div>

          <div className="flex items-center gap-4">
            <SignedOut>
              <Link href="/sign-in" className="text-sm text-gray-400 hover:text-white transition">
                Sign In
              </Link>
              <Link href="/sign-up" className="btn-primary text-sm">
                Start Free Trial
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="btn-primary text-sm">
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Agentic
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Penetration Testing
                </span>
              </h1>
              <p className="text-xl text-gray-400 mb-8 max-w-lg">
                AI agents that reason, adapt, and chain attacks autonomously —
                just like elite pentesters, running 24/7.
              </p>
              <div className="flex gap-4">
                <Link href="/sign-up" className="btn-primary">
                  Start Free Trial
                </Link>
                <Link href="#demo" className="btn-secondary">
                  Watch Demo
                </Link>
              </div>
            </div>

            {/* Right: Visual */}
            <div className="relative">
              <div className="glass rounded-2xl p-6 glow-blue">
                <div className="bg-[#0a0f1a] rounded-lg p-4 font-mono text-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-gray-500 ml-2">SekurAI Agent</span>
                  </div>
                  <div className="space-y-2 text-gray-300">
                    <p><span className="text-blue-400">[INFO]</span> Initializing agent...</p>
                    <p><span className="text-cyan-400">[DISCOVERY]</span> Found 47 endpoints</p>
                    <p><span className="text-yellow-400">[SQLi Agent]</span> Testing /api/users</p>
                    <p><span className="text-green-400">[FOUND]</span> SQL Injection in user_id param</p>
                    <p><span className="text-purple-400">[CHAINING]</span> Escalating to admin access...</p>
                    <p className="animate-pulse"><span className="text-blue-400">▊</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why SekurAI?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass rounded-xl p-6">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Autonomous Reasoning</h3>
              <p className="text-gray-400">
                Our AI agents think and adapt in real-time, finding vulnerabilities others miss.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass rounded-xl p-6">
              <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Attack Chain Discovery</h3>
              <p className="text-gray-400">
                Visualize complex attack paths and uncover hidden lateral movement possibilities.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass rounded-xl p-6">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Evidence-First Results</h3>
              <p className="text-gray-400">
                Receive detailed, actionable reports with proof-of-exploit and remediation steps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to secure your application?</h2>
          <p className="text-gray-400 mb-8">
            Start your free trial today. No credit card required.
          </p>
          <Link href="/sign-up" className="btn-primary text-lg px-8 py-4">
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-cyan-400"></div>
            <span className="font-semibold">SekurAI</span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2024 SekurAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
