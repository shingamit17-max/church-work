import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { Resource } from "@/models/Resource";
import NextLink from "next/link";
import { redirect } from "next/navigation";

const TYPE_META: Record<string, { icon: string; bgClass: string; textColor: string }> = {
  article:   { icon: "📄", bgClass: "bg-blue-400 text-black border-2 border-neo-border shadow-[2px_2px_0px_var(--neo-border)]", textColor: "text-blue-500" },
  video:     { icon: "🎬", bgClass: "bg-rose-400 text-black border-2 border-neo-border shadow-[2px_2px_0px_var(--neo-border)]", textColor: "text-rose-500" },
  template:  { icon: "🗂️", bgClass: "bg-amber-400 text-black border-2 border-neo-border shadow-[2px_2px_0px_var(--neo-border)]", textColor: "text-amber-500" },
  course:    { icon: "🎓", bgClass: "bg-purple-400 text-black border-2 border-neo-border shadow-[2px_2px_0px_var(--neo-border)]", textColor: "text-purple-500" },
  tool:      { icon: "🔧", bgClass: "bg-green-400 text-black border-2 border-neo-border shadow-[2px_2px_0px_var(--neo-border)]", textColor: "text-green-500" },
  default:   { icon: "🔗", bgClass: "bg-stone-300 text-black border-2 border-neo-border shadow-[2px_2px_0px_var(--neo-border)]", textColor: "text-foreground" },
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
          <p className="text-sm mb-1 text-muted-foreground font-bold uppercase tracking-wider">Learning</p>
          <h1 className="text-4xl font-black text-foreground mb-2">
            Resource Library
          </h1>
          <p className="text-muted-foreground font-medium">
            Curated articles, templates, and tools from our mentor community.
          </p>
        </div>
        {(session.user.role === "mentor" || session.user.role === "admin") && (
          <NextLink
            href="/resources/new"
            className="btn-amber shrink-0"
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
              className={`flex items-center gap-2 px-3 py-2 ${meta.bgClass}`}
            >
              <span>{meta.icon}</span>
              <span className="text-xs font-black capitalize">{type}</span>
              <span className="text-xs px-1.5 py-0.5 border-2 border-neo-border bg-white text-black font-black">
                {items.length}
              </span>
            </div>
          );
        })}
      </div>

      {resources.length === 0 ? (
        <div className="p-16 neobrutal-box text-center">
          <div className="text-5xl mb-4">📚</div>
          <h3 className="text-2xl font-black mb-2 text-foreground">No resources yet</h3>
          <p className="text-muted-foreground font-medium">Mentors will share articles, templates, and tools here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {resources.map((res) => {
            const meta = TYPE_META[res.type] || TYPE_META.default;
            return (
              <div
                key={res.id}
                className="p-6 neobrutal-box flex flex-col gap-4 relative transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_var(--neo-border)] bg-background group"
              >
                {/* Type badge */}
                <div className="flex items-center gap-2">
                  <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 font-black capitalize ${meta.bgClass}`}>
                    {meta.icon} {res.type}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 mt-2">
                  <h3 className="text-xl font-black mb-2 line-clamp-2 text-foreground">{res.title}</h3>
                  <p className="text-sm font-medium leading-relaxed line-clamp-3 text-muted-foreground">{res.description}</p>
                </div>

                {/* Footer */}
                <div className="pt-4 mt-2 flex justify-between items-center border-t-2 border-neo-border">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center text-xs font-black bg-accent text-background border-2 border-neo-border">
                      {(((res.uploadedBy as { name?: string })?.name?.[0]) || "?").toUpperCase()}
                    </div>
                    <span className="text-sm font-bold text-foreground">{(res.uploadedBy as { name?: string })?.name || "Unknown"}</span>
                  </div>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-1 text-xs font-black transition-all ${meta.textColor} group-hover:underline`}
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
