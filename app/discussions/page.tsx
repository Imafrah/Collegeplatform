import Link from "next/link";
import { getServerSession } from "next-auth";
import DeleteDiscussionButton from "@/components/DeleteDiscussionButton";
import QuestionForm from "@/components/QuestionForm";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DiscussionsPage() {
  const session = await getServerSession(authOptions);
  const questions = await prisma.question
    .findMany({
      include: {
        user: { select: { name: true } },
        _count: { select: { answers: true } },
      },
      orderBy: { createdAt: "desc" },
    })
    .catch(() => []);

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[1fr_360px] lg:px-8">
      <section>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Q&A Discussions</h1>
          <p className="mt-1 text-slate-600">Ask questions and share answers about colleges, admissions, and comparisons.</p>
        </div>

        {questions.length ? (
          <div className="space-y-3">
            {questions.map((question) => (
              <article
                key={question.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-200 hover:bg-blue-50/30"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <Link href={`/discussions/${question.id}`} className="block">
                      <h2 className="font-semibold text-slate-900">{question.title}</h2>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{question.body}</p>
                    </Link>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                      {question._count.answers} answers
                    </span>
                    {question.userId === session?.user?.id ? (
                      <DeleteDiscussionButton endpoint={`/api/discussions/${question.id}`} />
                    ) : null}
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  Asked by {question.user.name ?? "Student"} on {question.createdAt.toLocaleDateString("en-IN")}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">No discussions yet</h2>
            <p className="mt-2 text-slate-600">Start the first college discussion.</p>
          </div>
        )}
      </section>

      <aside>
        <QuestionForm />
      </aside>
    </div>
  );
}
