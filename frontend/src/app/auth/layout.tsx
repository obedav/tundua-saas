import type { Metadata } from "next";

export const metadata: Metadata = {
  // absolute bypasses the root layout's "%s | Tundua" template, preventing
  // the double-suffix "Sign In | Tundua | Tundua" that default caused.
  title: {
    absolute: "Sign In | Tundua",
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
