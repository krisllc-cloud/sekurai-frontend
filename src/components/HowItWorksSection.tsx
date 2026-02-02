"use client";

export default function HowItWorksSection() {
    return (
        <section className="py-24 px-6 relative z-10">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">How It Works</h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Three simple steps to find vulnerabilities before attackers do
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-start justify-between gap-12 md:gap-6 relative">
                    {/* Connecting Line for Desktop */}
                    <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-px bg-gradient-to-r from-purple-500/0 via-cyan-500/30 to-purple-500/0"></div>

                    {/* Step 1 */}
                    <div className="flex-1 text-center group">
                        <div className="relative inline-block mb-6">
                            <div className="text-7xl font-black bg-gradient-to-b from-purple-400/30 to-transparent bg-clip-text text-transparent group-hover:from-purple-400/50 transition-all duration-300">
                                01
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Enter Your URL</h3>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                            Paste your web app's URL. We validate it's reachable before starting.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="flex-1 text-center group">
                        <div className="relative inline-block mb-6">
                            <div className="text-7xl font-black bg-gradient-to-b from-cyan-400/30 to-transparent bg-clip-text text-transparent group-hover:from-cyan-400/50 transition-all duration-300">
                                02
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <svg className="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">AI Agents Attack</h3>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                            Watch XSS, SQL, IDOR, SSRF agents test in parallel, real-time.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="flex-1 text-center group">
                        <div className="relative inline-block mb-6">
                            <div className="text-7xl font-black bg-gradient-to-b from-blue-400/30 to-transparent bg-clip-text text-transparent group-hover:from-blue-400/50 transition-all duration-300">
                                03
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Get Your Report</h3>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                            Detailed findings with proof-of-concept and remediation guidance.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
