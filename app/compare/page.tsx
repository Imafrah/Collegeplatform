import Link from "next/link";
import { getServerSession } from "next-auth";
import ComparePageClient from "@/components/ComparePageClient";
import { authOptions } from "@/lib/auth";
import { normalizeCollege } from "@/lib/colleges";
import { prisma } from "@/lib/prisma";
import type { College } from "@/types";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ComparePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const ids = Array.isArray(params.ids) ? params.ids : params.ids ? [params.ids] : [];

  if (!ids.length) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Select colleges to compare</h1>
        <p className="mt-2 text-slate-600">Choose 2 to 3 colleges from the listing page.</p>
        <Link href="/colleges" className="mt-5 rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white">
          Browse colleges
        </Link>
      </div>
    );
  }

  if (ids.length < 2 || ids.length > 3) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-bold text-red-500">Invalid comparison</h1>
        <p className="mt-2 text-slate-600">Please select 2 to 3 colleges.</p>
        <Link href="/colleges" className="mt-5 rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white">
          Back to colleges
        </Link>
      </div>
    );
  }

  const colleges = await prisma.college.findMany({ where: { id: { in: ids } } });
  const ordered = ids
    .map((id) => colleges.find((college) => college.id === id))
    .filter((college): college is NonNullable<typeof college> => Boolean(college))
    .map((college) => normalizeCollege(college) as College);

  const session = await getServerSession(authOptions);
  const key = [...new Set(ids)].sort().join(",");
  const saved = session?.user?.id
    ? Boolean(
        await prisma.savedComparison.findUnique({
          where: { userId_key: { userId: session.user.id, key } },
        }),
      )
    : false;

  return <ComparePageClient colleges={ordered} initialSaved={saved} />;
}
