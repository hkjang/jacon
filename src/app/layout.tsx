import type { Metadata } from "next";
import { AuthProvider } from "@/components/features/auth/auth-context";
import { ProjectProvider } from "@/hooks/use-project-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jacon - 운영 플랫폼",
  description: "Docker & Kubernetes 통합 관리 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <AuthProvider>
          <ProjectProvider>
            {children}
          </ProjectProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
