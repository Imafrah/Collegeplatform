"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/colleges", label: "Colleges" },
  { href: "/compare", label: "Compare" },
  { href: "/discussions", label: "Q&A" },
  { href: "/saved", label: "Saved" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-bold text-slate-900">
          College Discovery
        </Link>

        <div className="hidden items-center gap-1 sm:flex">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${
                  active
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {status === "authenticated" && session.user ? (
            <>
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name ?? "User"}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
                  {session.user.name?.charAt(0) ?? "U"}
                </div>
              )}
              <span className="hidden max-w-32 truncate text-sm font-medium text-slate-700 md:block">
                {session.user.name}
              </span>
              <button
                type="button"
                onClick={() => signOut()}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => signIn("google")}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Sign in with Google
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
