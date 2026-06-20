"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type StudyLog = {
  id: string;
  title: string;
  minutes: number;
  memo: string | null;
  studied_at: string;
  created_at: string;
};

export default function Home() {
  const [logs, setLogs] = useState<StudyLog[]>([]);
  const [title, setTitle] = useState("");
  const [minutes, setMinutes] = useState("");
  const [memo, setMemo] = useState("");
  const [studiedAt, setStudiedAt] = useState("");
  const [loading, setLoading] = useState(false);

  const totalMinutes = logs.reduce((sum, log) => {
    return sum + log.minutes;
  }, 0);

  const fetchLogs = async () => {
    const { data, error } = await supabase
      .from("study_logs")
      .select("*")
      .order("studied_at", { ascending: false });

    if (error) {
      console.error(error);
      alert("データの取得に失敗しました");
      return;
    }

    setLogs(data ?? []);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    const { error } = await supabase.from("study_logs").insert({
      title: title,
      minutes: Number(minutes),
      memo: memo,
      studied_at: studiedAt,
    });

    setLoading(false);

    if (error) {
      console.error(error);
      alert("保存に失敗しました");
      return;
    }

    setTitle("");
    setMinutes("");
    setMemo("");
    setStudiedAt("");

    fetchLogs();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("study_logs").delete().eq("id", id);

    if (error) {
      console.error(error);
      alert("削除に失敗しました");
      return;
    }

    fetchLogs();
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold text-gray-900">StudyLog</h1>

        <p className="mt-4 text-gray-600">
          日々の学習内容と学習時間を記録するアプリです。
        </p>

        <p className="mt-2 text-sm text-gray-500">
          Next.js / TypeScript / Supabase を使って作成しています。
        </p>

        <div className="mt-8 rounded-lg bg-blue-50 p-4">
          <p className="text-sm text-gray-600">合計学習時間</p>
          <p className="text-2xl font-bold text-gray-900">
            {totalMinutes} 分
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4 rounded-lg border p-4"
        >
          <h2 className="text-xl font-semibold text-gray-900">記録を追加</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              学習内容
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded border p-2"
              placeholder="例：Reactの基礎"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              学習時間 分
            </label>
            <input
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              className="mt-1 w-full rounded border p-2"
              placeholder="例：90"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              学習日
            </label>
            <input
              type="date"
              value={studiedAt}
              onChange={(e) => setStudiedAt(e.target.value)}
              className="mt-1 w-full rounded border p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              メモ
            </label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="mt-1 w-full rounded border p-2"
              placeholder="例：useStateを練習した"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded bg-black px-4 py-2 text-white disabled:bg-gray-400"
          >
            {loading ? "保存中..." : "追加する"}
          </button>
        </form>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">学習記録</h2>

          {logs.length === 0 ? (
            <p className="mt-4 text-gray-600">まだ記録がありません。</p>
          ) : (
            <div className="mt-4 space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">{log.title}</h3>
                    <span className="text-sm text-gray-500">
                      {log.studied_at}
                    </span>
                  </div>

                  <p className="mt-2 text-gray-700">{log.minutes} 分</p>
                  <p className="mt-2 text-gray-600">{log.memo}</p>

                  <button
                    onClick={() => handleDelete(log.id)}
                    className="mt-4 rounded bg-red-600 px-3 py-1 text-sm text-white"
                  >
                    削除
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}