"use client";

export default function HowItWorksSection() {
    return (
        <section className="py-20 px6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
                    <p className="text-xl text-gray-600">
                        Three simple steps to find vulnerabilities before attackers do
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative">
                    {/* Connectors for desktop */}
                    <div className="hidden md:block absolute top-20 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-purple-300 via-cyan-300 to-purple-300"></div>

                    {/* Step 1 */}
                    <div className="relative">
                        <div className="bg-white rounded-xl p-8 border-2 border-purple-200 hover:border-purple-400 transition-colors shadow-sm">
                            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                                1
                            </div>
                            <div className="w-12 h-12 mx-auto mb-4 text-purple-600">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                                Enter Your URL
                            </h3>
                            <p className="text-gray-600 text-center">
                                Paste your web application's URL. We'll validate it's reachable
                                before starting.
                            </p>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="relative">
                        <div className="bg-white rounded-xl p-8 border-2 border-cyan-200 hover:border-cyan-400 transition-colors shadow-sm">
                            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                                2
                            </div>
                            <div className="w-12 h-12 mx-auto mb-4 text-cyan-600">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                                AI Agents Attack
                            </h3>
                            <p className="text-gray-600 text-center">
                                Watch as XSS, SQL, IDOR, SSRF agents test your app—all in
                                parallel, in real-time.
                            </p>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="relative">
                        <div className="bg-white rounded-xl p-8 border-2 border-purple-200 hover:border-purple-400 transition-colors shadow-sm">
                            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                                3
                            </div>
                            <div className="w-12 h-12 mx-auto mb-4 text-purple-600">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                                Get Your Report
                            </h3>
                            <p className="text-gray-600 text-center">
                                Receive detailed findings with proof-of-concept payloads and
                                remediation guidance.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
