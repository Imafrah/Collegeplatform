import CollegeListing from "@/components/CollegeListing";
import { normalizeCollege } from "@/lib/colleges";
import { prisma } from "@/lib/prisma";
import type { College } from "@/types";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function getParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function CollegesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const q = getParam(params.q).trim();
  const state = getParam(params.state).trim();
  const type = getParam(params.type).trim();
  const currentPage = Math.max(Number(getParam(params.page) || "1"), 1);
  const selectedIds = Array.isArray(params.ids) ? params.ids : params.ids ? [params.ids] : [];
  const limit = 12;

  const where = {
    AND: [
      q ? { name: { contains: q, mode: "insensitive" as const } } : {},
      state ? { state } : {},
      type ? { type } : {},
    ],
  };

  const [colleges, total] = await Promise.all([
    prisma.college.findMany({
      where,
      orderBy: { rating: "desc" },
      skip: (currentPage - 1) * limit,
      take: limit,
    }),
    prisma.college.count({ where }),
  ]);

  return (
    <CollegeListing
      colleges={colleges.map((college) => normalizeCollege(college) as College)}
      total={total}
      pages={Math.ceil(total / limit)}
      currentPage={currentPage}
      q={q}
      state={state}
      type={type}
      selectedIds={selectedIds}
    />
  );
}
