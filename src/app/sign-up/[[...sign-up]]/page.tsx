import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <div className="min-h-screen flex items-center justify-center gradient-dark">
            <SignUp
                appearance={{
                    elements: {
                        rootBox: "mx-auto",
                        card: "bg-[#0f172a] border border-gray-800",
                        headerTitle: "text-white",
                        headerSubtitle: "text-gray-400",
                        socialButtonsBlockButton: "bg-[#1e293b] border-gray-700 text-white hover:bg-[#2d3a4f]",
                        formFieldLabel: "text-gray-300",
                        formFieldInput: "bg-[#1e293b] border-gray-700 text-white",
                        footerActionLink: "text-blue-400 hover:text-blue-300",
                        formButtonPrimary: "bg-blue-500 hover:bg-blue-600",
                    }
                }}
            />
        </div>
    );
}
