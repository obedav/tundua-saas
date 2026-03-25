import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Tundua",
    default: "Sign In | Tundua",
  },
  description: "Sign in or create your Tundua account to start your study abroad application journey.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
