import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold text-slate-900">College not found</h1>
      <p className="mt-2 text-slate-600">The college you are looking for does not exist.</p>
      <Link href="/colleges" className="mt-5 rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white">
        Browse colleges
      </Link>
    </div>
  );
}

