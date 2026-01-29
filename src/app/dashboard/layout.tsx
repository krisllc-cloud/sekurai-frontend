import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    return (
        <div className="min-h-screen bg-[#fafbfc]">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-56 bg-[#0f172a] p-5 flex flex-col">
                {/* Logo */}
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">S</span>
                    </div>
                    <div>
                        <span className="text-white text-lg font-bold">SekurAI</span>
                        <p className="text-gray-500 text-xs">SECURITY PLATFORM</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-1 flex-1">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Dashboard
                    </Link>

                    <Link
                        href="/dashboard/missions"
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Missions
                    </Link>

                    <Link
                        href="/dashboard/findings"
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Findings
                    </Link>

                    <Link
                        href="/dashboard/reports"
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Reports
                    </Link>
                </nav>

                {/* User section at bottom */}
                <div className="mt-auto">
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-800/50">
                        <UserButton afterSignOutUrl="/" />
                        <div className="text-sm">
                            <p className="text-gray-300">Account</p>
                            <p className="text-gray-500 text-xs">Pro Plan</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <main className="ml-56 min-h-screen">
                {children}
            </main>
        </div>
    );
}
