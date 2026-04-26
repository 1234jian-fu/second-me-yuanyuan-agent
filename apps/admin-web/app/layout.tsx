import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import type { PropsWithChildren } from "react";
import { DesktopShell } from "@/components/shell/DesktopShell";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Second Me / 数字分身 Agent",
  description: "个人数字分身系统的电脑端中枢",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="zh-CN">
      <body className={manrope.variable}>
        <DesktopShell>{children}</DesktopShell>
      </body>
    </html>
  );
}
