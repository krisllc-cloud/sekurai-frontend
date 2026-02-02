"use client";

export default function ValuePropsSection() {
    return (
        <section className="py-20 px-6 bg-purple-50">
            <div className="max-w-5xl mx-auto text-center">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    Democratizing Security
                </h2>
                <p className="text-xl text-gray-600 mb-16 max-w-2xl mx-auto">
                    Every developer deserves access to world-class security testing.
                    <br />
                    Not just the ones with six-figure budgets.
                </p>

                <div className="grid md:grid-cols-3 gap-12">
                    {/* Minutes */}
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-purple-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">Minutes</h3>
                        <p className="text-gray-600">vs weeks of waiting</p>
                    </div>

                    {/* 90%+ Savings */}
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-100 flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-cyan-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">90%+ Savings</h3>
                        <p className="text-gray-600">vs traditional pentests</p>
                    </div>

                    {/* Zero */}
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">Zero</h3>
                        <p className="text-gray-600">scheduling headaches</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
