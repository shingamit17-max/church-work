import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { Resource } from "@/models/Resource";
import NextLink from "next/link";
import { redirect } from "next/navigation";

export default async function ResourcesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  await dbConnect();

  // Fetch all resources for MVP
  const resources = await Resource.find().sort({ createdAt: -1 }).populate("uploadedBy", "name role");

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Resource Library</h1>
        {session.user.role === "mentor" && (
          <NextLink href="/resources/new" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium">
            + Share Resource
          </NextLink>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.length === 0 ? (
          <div className="col-span-full p-12 border border-white/10 rounded-xl bg-white/5 text-center text-white/50">
            No resources have been shared yet.
          </div>
        ) : (
          resources.map((res) => (
            <div key={res.id} className="p-6 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex flex-col">
              <div className="mb-4">
                <span className="text-xs uppercase px-2 py-1 bg-white/10 rounded-full text-white/60 mb-2 inline-block">
                  {res.type}
                </span>
                <h3 className="font-semibold text-lg line-clamp-2">{res.title}</h3>
              </div>
              <p className="text-sm text-white/60 flex-1 mb-6 line-clamp-3">
                {res.description}
              </p>
              
              <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-xs text-white/40">By {(res.uploadedBy as any)?.name || "Unknown"}</span>
                <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-sm text-teal-400 hover:underline">
                  View Resource ↗
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
