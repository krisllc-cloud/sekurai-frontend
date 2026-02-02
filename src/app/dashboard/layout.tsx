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
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-6 z-50">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-10">
                    <img
                        src="/logo-icon.png"
                        alt="SekürAI"
                        className="w-10 h-10 object-contain"
                    />
                    <div>
                        <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-cyan-500 tracking-tight">
                            SekürAI
                        </span>
                        <span className="block text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Security Platform</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-1">
                    <NavItem href="/dashboard" icon="dashboard" label="Dashboard" />
                    <NavItem href="/dashboard/missions" icon="missions" label="Missions" />
                    <NavItem href="/dashboard/findings" icon="findings" label="Findings" />
                    <NavItem href="/dashboard/reports" icon="reports" label="Reports" />
                </nav>

                {/* User section at bottom */}
                <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all cursor-pointer">
                        <UserButton afterSignOutUrl="/" />
                        <div className="flex-1">
                            <p className="text-sm text-gray-700 font-medium">Account</p>
                            <p className="text-xs text-gray-500">Pro Plan</p>
                        </div>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <main className="ml-64 p-8 min-h-screen">
                {children}
            </main>
        </div>
    );
}

// Navigation Item Component
function NavItem({ href, icon, label }: { href: string; icon: string; label: string }) {
    const icons: Record<string, React.ReactNode> = {
        dashboard: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
        ),
        missions: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
        ),
        findings: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
        reports: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
    };

    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition group"
        >
            <span className="transition-colors group-hover:text-blue-500">
                {icons[icon]}
            </span>
            <span className="font-medium">{label}</span>
        </Link>
    );
}
