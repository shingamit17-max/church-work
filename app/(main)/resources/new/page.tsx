"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewResourcePage() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    
    try {
      const res = await fetch("/api/resources/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        router.push("/resources");
      } else {
        alert("Failed to create resource");
      }
    } catch (e) {
      console.error(e);
      alert("Error sharing resource");
    }
    setIsPending(false);
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Share a Resource</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white/5 p-6 rounded-xl border border-white/10">
        <div>
          <label className="block text-sm mb-1">Title</label>
          <input name="title" required className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">Description</label>
          <textarea name="description" required rows={3} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 resize-none" />
        </div>
        <div>
          <label className="block text-sm mb-1">URL (Link to resource)</label>
          <input name="url" type="url" required className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">Type</label>
          <select name="type" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2">
            <option value="article">Article / Guide</option>
            <option value="video">Video</option>
            <option value="template">Template (Resume/Cover Letter)</option>
            <option value="book">Book</option>
            <option value="other">Other</option>
          </select>
        </div>
        <button type="submit" disabled={isPending} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium disabled:opacity-50">
          {isPending ? "Sharing..." : "Share Resource"}
        </button>
      </form>
    </div>
  );
}
