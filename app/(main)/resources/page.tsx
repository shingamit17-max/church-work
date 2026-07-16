import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { Resource } from "@/models/Resource";
import NextLink from "next/link";
import { redirect } from "next/navigation";

const TYPE_META: Record<string, { icon: string; color: string; bg: string; border: string }> = {
  article:   { icon: "📄", color: "#78bfff", bg: "rgba(120,191,255,0.08)", border: "rgba(120,191,255,0.15)" },
  video:     { icon: "🎬", color: "#fb7185", bg: "rgba(251,113,133,0.08)", border: "rgba(251,113,133,0.15)" },
  template:  { icon: "🗂️", color: "#fbbf24", bg: "rgba(251,191,36,0.08)",  border: "rgba(251,191,36,0.15)"  },
  course:    { icon: "🎓", color: "#a78bfa", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.15)" },
  tool:      { icon: "🔧", color: "#4ade80", bg: "rgba(74,222,128,0.08)",  border: "rgba(74,222,128,0.15)"  },
  default:   { icon: "🔗", color: "#a8a29e", bg: "rgba(168,162,158,0.08)", border: "rgba(168,162,158,0.15)" },
};

export default async function ResourcesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  await dbConnect();
  const resources = await Resource.find()
    .sort({ createdAt: -1 })
    .populate("uploadedBy", "name role");

  const grouped = resources.reduce<Record<string, typeof resources>>((acc, r) => {
    const key = r.type || "other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <p className="text-sm mb-1" style={{ color: "#57534e" }}>Learning</p>
          <h1 className="text-3xl font-semibold" style={{ letterSpacing: "-0.03em", color: "#fafaf9" }}>
            Resource Library
          </h1>
          <p className="text-sm mt-1" style={{ color: "#78716c" }}>
            Curated articles, templates, and tools from our mentor community.
          </p>
        </div>
        {session.user.role === "mentor" && (
          <NextLink
            href="/resources/new"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0"
            style={{
              background: "linear-gradient(135deg,#f59e0b,#d97706)",
              color: "#0c0a09",
              boxShadow: "0 4px 16px rgba(245,158,11,0.25)",
            }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M12 5v14M5 12h14"/>
            </svg>
            Share a Resource
          </NextLink>
        )}
      </div>

      {/* Stats bar */}
      <div className="flex gap-3 flex-wrap">
        {Object.entries(grouped).map(([type, items]) => {
          const meta = TYPE_META[type] || TYPE_META.default;
          return (
            <div
              key={type}
              className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: meta.bg, border: `1px solid ${meta.border}` }}
            >
              <span>{meta.icon}</span>
              <span className="text-xs font-medium capitalize" style={{ color: meta.color }}>{type}</span>
              <span className="text-xs px-1.5 py-0.5 rounded-md" style={{ background: "rgba(0,0,0,0.3)", color: "#57534e" }}>
                {items.length}
              </span>
            </div>
          );
        })}
      </div>

      {resources.length === 0 ? (
        <div className="p-16 rounded-2xl text-center" style={{ background: "rgba(41,37,36,0.5)", border: "1px dashed rgba(255,255,255,0.08)" }}>
          <div className="text-5xl mb-4">📚</div>
          <h3 className="font-semibold mb-2" style={{ color: "#fafaf9" }}>No resources yet</h3>
          <p className="text-sm" style={{ color: "#57534e" }}>Mentors will share articles, templates, and tools here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {resources.map((res) => {
            const meta = TYPE_META[res.type] || TYPE_META.default;
            return (
              <div
                key={res.id}
                className="p-6 rounded-2xl flex flex-col gap-4 relative overflow-hidden transition-all"
                style={{ background: "rgba(41,37,36,0.7)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                {/* Ambient orb */}
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none" style={{ background: meta.bg, filter: "blur(20px)", transform: "translate(30%,-30%)" }} />

                {/* Type badge */}
                <div className="flex items-center gap-2 relative z-10">
                  <span
                    className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium capitalize"
                    style={{ background: meta.bg, border: `1px solid ${meta.border}`, color: meta.color }}
                  >
                    {meta.icon} {res.type}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 relative z-10">
                  <h3 className="font-semibold text-sm leading-snug mb-2 line-clamp-2" style={{ color: "#fafaf9" }}>{res.title}</h3>
                  <p className="text-xs leading-relaxed line-clamp-3" style={{ color: "#78716c" }}>{res.description}</p>
                </div>

                {/* Footer */}
                <div className="pt-3 flex justify-between items-center relative z-10" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold" style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)", color: "#0c0a09" }}>
                      {(((res.uploadedBy as { name?: string })?.name?.[0]) || "?").toUpperCase()}
                    </div>
                    <span className="text-[11px]" style={{ color: "#57534e" }}>{(res.uploadedBy as { name?: string })?.name || "Unknown"}</span>
                  </div>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-medium transition-all"
                    style={{ color: meta.color }}
                  >
                    Open ↗
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
