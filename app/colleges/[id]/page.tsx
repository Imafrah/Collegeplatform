import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import SaveButton from "@/components/SaveButton";
import { formatFees, normalizeCollege } from "@/lib/colleges";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { College } from "@/types";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function CollegeDetailPage({ params }: Props) {
  const { id } = await params;
  const [collegeRecord, session] = await Promise.all([
    prisma.college.findUnique({ where: { id } }),
    getServerSession(authOptions),
  ]);

  if (!collegeRecord) {
    notFound();
  }

  const college = normalizeCollege(collegeRecord) as College;
  const saved = session?.user?.id
    ? Boolean(
        await prisma.savedCollege.findUnique({
          where: { userId_collegeId: { userId: session.user.id, collegeId: id } },
        }),
      )
    : false;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{college.name}</h1>
            <p className="mt-2 text-slate-600">
              {college.location}, {college.state} · {college.type} · {college.rating.toFixed(1)} / 5
            </p>
          </div>
          <SaveButton collegeId={college.id} initialSaved={saved} />
        </div>
      </div>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Overview</h2>
        <p className="mt-3 leading-7 text-slate-700">{college.overview}</p>
      </section>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Courses</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {college.courses.map((course) => (
            <span key={course} className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600">
              {course}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Placements</h2>
          <dl className="mt-4 space-y-3 text-slate-700">
            <div className="flex justify-between gap-4">
              <dt>Average package</dt>
              <dd className="font-semibold text-emerald-500">₹{college.placements.avgPackage} LPA</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Highest package</dt>
              <dd className="font-semibold text-emerald-500">₹{college.placements.highestPackage} LPA</dd>
            </div>
          </dl>
          <p className="mt-4 text-sm text-slate-600">
            Top recruiters: {college.placements.topRecruiters.join(", ")}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Fees</h2>
          <p className="mt-4 text-3xl font-bold text-slate-900">{formatFees(college.fees)}</p>
          <p className="mt-2 text-sm text-slate-600">Approximate annual fee.</p>
        </div>
      </section>
    </div>
  );
}
