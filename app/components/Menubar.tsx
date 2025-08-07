"use client";

import Link from "next/link";
import ThemeSwitch from "@/components/ThemeSwitch";

export default function Menubar() {
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
      <Link className="font-bold" href="/">
        曾伟骏
      </Link>
      <div className="flex items-center space-x-6">
        <Link href="/blog">archives</Link>
        <Link href="/me">me</Link>
        <Link href="https://10pm.substack.com/">newsletter</Link>
        <Link href="/contact">contact</Link>
        <Link href="/search">🔎</Link>
        <ThemeSwitch />
      </div>
    </div>
  );
}
