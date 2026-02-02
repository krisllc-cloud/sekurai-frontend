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
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/sekurai_logo_light.png"
              alt="SekürAI"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <span className="text-xl font-bold text-gray-900">SekürAI</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <Link href="#features" className="hover:text-purple-600 transition">
              Features
            </Link>
            <Link href="#how-it-works" className="hover:text-purple-600 transition">
              How It Works
            </Link>
            <Link href="/docs" className="hover:text-purple-600 transition">
              Docs
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <SignedOut>
              <Link href="/sign-in" className="text-sm text-gray-600 hover:text-purple-600 transition">
                Sign In
              </Link>
              <Link href="/sign-up" className="text-sm px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition">
                Start Free Trial
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="text-sm px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition">
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <LandingHero />

      {/* Stats Grid */}
      <StatsGrid />

      {/* Value Props */}
      <ValuePropsSection />

      {/* How It Works */}
      <div id="how-it-works">
        <HowItWorksSection />
      </div>

      {/* Features */}
      <div id="features">
        <FeaturesSection />
      </div>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-purple-50 to-cyan-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ready to secure your application?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Start your free trial today. No credit card required.
          </p>
          <Link
            href="/sign-up"
            className="inline-block text-lg px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors shadow-lg hover:shadow-xl"
          >
            Get Started Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-6 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/sekurai_logo_light.png"
              alt="SekürAI"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="font-semibold text-gray-900">SekürAI</span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2026 SekürAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
