import Link from "next/link";
import Image from "next/image";

export const metadata = {
    title: "Terms of Service - SekurAI",
    description: "SekurAI Terms of Service - Authorization requirements, prohibited activities, and legal compliance for security testing.",
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#0A0F1C] text-white selection:bg-purple-500/30 font-sans">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-[#0A0F1C]/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <Image
                            src="/logo-icon.png"
                            alt="SekürAI"
                            width={36}
                            height={36}
                            className="w-9 h-9"
                        />
                        <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500 tracking-tight">
                            SekürAI
                        </span>
                    </Link>
                    <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <Link href="/about" className="hover:text-white transition-colors">About</Link>
                    </div>
                </div>
            </nav>

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Terms of Service</h1>
                    <p className="text-gray-500 mb-12">Last updated: January 3, 2026</p>

                    <div className="space-y-12 text-gray-300">
                        {/* Section 1 */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                <span className="text-purple-400">1.</span> Authorization Requirements
                            </h2>
                            <p className="mb-4 leading-relaxed">
                                You must have <span className="text-purple-400 font-semibold">explicit authorization</span> to perform security testing on any target system. This includes:
                            </p>
                            <ul className="list-none space-y-2 ml-4">
                                <li className="flex items-start gap-2">
                                    <span className="text-cyan-400 mt-1">→</span>
                                    Written permission from the domain owner
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-cyan-400 mt-1">→</span>
                                    Proof of ownership if testing your own systems
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-cyan-400 mt-1">→</span>
                                    Explicit contractual agreements for third-party testing
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-cyan-400 mt-1">→</span>
                                    Compliance with all applicable local, state, and federal laws
                                </li>
                            </ul>
                        </section>

                        {/* Section 2 */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                <span className="text-purple-400">2.</span> Prohibited Activities
                            </h2>
                            <p className="mb-4 leading-relaxed">
                                You may <span className="text-red-400 font-semibold">NOT</span> use SekurAI to:
                            </p>
                            <ul className="list-none space-y-2 ml-4">
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-1">✗</span>
                                    Test systems you do not own or have explicit permission to test
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-1">✗</span>
                                    Cause damage, disruption, or unauthorized access to systems
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-1">✗</span>
                                    Violate computer fraud laws (CFAA, Computer Misuse Act, etc.)
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-1">✗</span>
                                    Breach any third-party terms of service
                                </li>
                            </ul>
                        </section>

                        {/* Section 3 */}
                        <section className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                <span className="text-purple-400">3.</span> Liability Disclaimer
                            </h2>
                            <p className="mb-4 leading-relaxed">
                                SekurAI provides security testing services <span className="font-semibold">"AS IS"</span> without warranties of any kind. We are <span className="text-red-400 font-semibold">NOT LIABLE</span> for:
                            </p>
                            <ul className="list-none space-y-2 ml-4 text-gray-400">
                                <li>• Any damages, data loss, or service disruption caused by testing</li>
                                <li>• Unauthorized testing of third-party systems</li>
                                <li>• Legal consequences arising from unauthorized security testing</li>
                                <li>• False positives, false negatives, or incomplete vulnerability detection</li>
                                <li>• Financial losses, business interruption, or reputational harm</li>
                            </ul>
                            <p className="mt-4 text-sm text-gray-500 leading-relaxed">
                                You accept full responsibility and assume all risks associated with using our platform. By using SekurAI, you indemnify and hold harmless SekurAI, its officers, employees, and affiliates from any claims, damages, or liabilities arising from your use of the service.
                            </p>
                        </section>

                        {/* Section 4 */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                <span className="text-purple-400">4.</span> Testing Impacts
                            </h2>
                            <p className="mb-4 leading-relaxed">Security testing may cause:</p>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                    <h3 className="font-semibold text-yellow-400 mb-2">Test/Garbage Data</h3>
                                    <p className="text-sm text-gray-400">Our agents may create test accounts, POST data, or generate database entries</p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                    <h3 className="font-semibold text-yellow-400 mb-2">Performance Degradation</h3>
                                    <p className="text-sm text-gray-400">High request volumes may slow down your application temporarily</p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                    <h3 className="font-semibold text-yellow-400 mb-2">Security Alerts</h3>
                                    <p className="text-sm text-gray-400">Automated testing may trigger WAFs, IDSs, or security monitoring systems</p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                    <h3 className="font-semibold text-yellow-400 mb-2">Log Noise</h3>
                                    <p className="text-sm text-gray-400">Testing generates significant log volume</p>
                                </div>
                            </div>
                        </section>

                        {/* Section 5 */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                <span className="text-purple-400">5.</span> Legal Compliance
                            </h2>
                            <p className="mb-4 leading-relaxed">Unauthorized security testing may violate:</p>
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10 space-y-3">
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-semibold text-cyan-400 w-32">United States</span>
                                    <span className="text-gray-400">Computer Fraud and Abuse Act (CFAA), 18 U.S.C. § 1030</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-semibold text-cyan-400 w-32">United Kingdom</span>
                                    <span className="text-gray-400">Computer Misuse Act 1990</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-semibold text-cyan-400 w-32">European Union</span>
                                    <span className="text-gray-400">GDPR, Network and Information Systems Directive</span>
                                </div>
                            </div>
                            <p className="mt-4 text-sm text-gray-500">
                                You are solely responsible for ensuring compliance with all applicable laws and regulations.
                            </p>
                        </section>

                        {/* Section 6 */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                <span className="text-purple-400">6.</span> Data and Privacy
                            </h2>
                            <p className="leading-relaxed text-gray-400">
                                We collect and store mission data, findings, and authentication tokens for the purpose of providing security testing services. Your data is encrypted at rest and in transit. We do not share your data with third parties except as required by law.
                            </p>
                        </section>

                        {/* Section 7 */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                <span className="text-purple-400">7.</span> Termination
                            </h2>
                            <p className="leading-relaxed text-gray-400">
                                We reserve the right to terminate or suspend your account at any time, without notice, for violations of these Terms of Service, including but not limited to unauthorized testing or illegal activities.
                            </p>
                        </section>

                        {/* Section 8 */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                <span className="text-purple-400">8.</span> Contact
                            </h2>
                            <p className="leading-relaxed text-gray-400">
                                For questions about these Terms of Service, please contact us at: <a href="mailto:legal@sekurai.ai" className="text-purple-400 hover:underline">legal@sekurai.ai</a>
                            </p>
                        </section>

                        {/* Agreement Notice */}
                        <div className="mt-16 p-6 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-2xl border border-purple-500/20 text-center">
                            <p className="text-gray-300 leading-relaxed">
                                By using SekurAI and confirming authorization before each mission, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
