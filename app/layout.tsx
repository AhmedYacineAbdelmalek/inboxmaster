import type { Metadata } from "next";
import "./globals.css";
import { WorkspaceProvider } from "@/lib/workspace-context";

export const metadata: Metadata = {
  title: "InboxMaster - Unified Social Inbox",
  description: "Multi-tenant unified social inbox for managing conversations across channels",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <WorkspaceProvider>
          {children}
        </WorkspaceProvider>
      </body>
    </html>
  );
}
