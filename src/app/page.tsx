import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import LandingHero from "@/components/LandingHero";
import StatsGrid from "@/components/StatsGrid";
import ValuePropsSection from "@/components/ValuePropsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import FeaturesSection from "@/components/FeaturesSection";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white selection:bg-purple-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0A0F1C]/80 backdrop-blur-xl border-b border-white/5 supports-[backdrop-filter]:bg-[#0A0F1C]/60">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo-icon.png"
              alt="SekürAI"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500 tracking-tight">
              SekürAI
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <Link href="#features" className="hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="hover:text-white transition-colors">
              How It Works
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              About
            </Link>
            <Link href="/docs" className="hover:text-white transition-colors">
              Docs
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <SignedOut>
              <Link href="/sign-in" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/sign-up" className="text-sm font-medium px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all shadow-lg shadow-purple-900/20">
                Start Free Trial
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="text-sm font-medium px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-lg transition-all">
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" appearance={{
                elements: {
                  avatarBox: "w-9 h-9 border-2 border-white/10"
                }
              }} />
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="relative">
          <LandingHero />
        </div>
      </div>

      {/* Stats Grid */}
      <StatsGrid />

      {/* Value Props */}
      <ValuePropsSection />

      {/* How It Works */}
      <div id="how-it-works">
        <HowItWorksSection />
      </div>

      {/* Features */}
      <div id="features" className="py-20">
        <FeaturesSection />
      </div>

      {/* CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F1C] to-purple-950/20"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl font-bold text-white mb-6 tracking-tight">
            Ready to secure your application?
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join thousands of developers building a safer internet. Start your first autonomous security mission today.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 text-lg px-8 py-4 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:scale-105"
          >
            Get Started Free
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6 bg-[#05080F]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Image
              src="/logo-icon.png"
              alt="SekürAI"
              width={24}
              height={24}
              className="w-6 h-6 opacity-80"
            />
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-400">
              SekürAI
            </span>
          </div>
          <div className="flex gap-8 text-sm text-gray-500">
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/docs" className="hover:text-white transition-colors">Documentation</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          </div>
          <p className="text-gray-600 text-sm">
            © 2026 SekürAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
