"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { isToday } from "@/utils/isTodayEntry"; // ✅ 유틸 함수 import

type Entry = {
  date: string;
  responses: string[];
};

export default function Dashboard() {
  const [user, setUser] = useState<any | null>(undefined);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedResponses, setEditedResponses] = useState<string[]>([]);
  const router = useRouter();

  // 인증 상태 확인
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u ?? null);
    });
    return () => unsubscribe();
  }, []);

  // 로그인 확인 후 entry 가져오기
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      if (!u) {
        router.push("/login");
      } else {
        setUser(u);
        const res = await fetch(`http://localhost:8000/api/get-entries?uid=${u.uid}`);
        const data = await res.json();
        setEntries(Array.isArray(data) ? data : []);
      }
    });

    return () => unsubscribe();
  }, [router]);

  // 오늘 회고가 있는지 여부
  const hasTodayEntry = entries.some((e) => isToday(e.date));

  // 저장 핸들러
  const handleSave = async (entryDate: string) => {
    if (!user) return;
    try {
      const res = await fetch("http://localhost:8000/api/update-entry", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          date: entryDate,
          responses: editedResponses,
        }),
      });

      if (!res.ok) throw new Error("수정 실패");

      const updated = [...entries];
      updated[editingIndex!] = { ...updated[editingIndex!], responses: editedResponses };
      setEntries(updated);
      setEditingIndex(null);
    } catch (err) {
      console.error("❌ 저장 실패:", err);
      alert("수정에 실패했습니다.");
    }
  };

  if (user === undefined) {
    return <div className="p-4">로그인 상태 확인 중...</div>;
  }

  if (user === null) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📒 내 회고 목록</h1>

      {/* ✅ 오늘 회고가 없을 때 작성하러 가기 버튼 */}
      {!hasTodayEntry && (
        <div className="mb-4">
          <button
            onClick={() => router.push("/write")}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            ✍️ 오늘 회고 작성하러 가기
          </button>
        </div>
      )}

      {entries.length === 0 ? (
        <p>아직 회고를 작성하지 않았습니다.</p>
      ) : (
        <ul className="space-y-6">
          {entries.map((entry, i) => (
            <li key={i} className="p-4 border rounded shadow-sm">
              <p className="text-sm text-gray-500">{entry.date}</p>

              {editingIndex === i ? (
                <div>
                  {editedResponses.map((r, j) => (
                    <textarea
                      key={j}
                      value={r}
                      onChange={(e) => {
                        const newResponses = [...editedResponses];
                        newResponses[j] = e.target.value;
                        setEditedResponses(newResponses);
                      }}
                      className="w-full p-2 border mt-2"
                    />
                  ))}
                  <div className="mt-2 space-x-2">
                    <button
                      onClick={() => handleSave(entry.date)}
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      저장
                    </button>
                    <button
                      onClick={() => setEditingIndex(null)}
                      className="px-3 py-1 bg-gray-300 rounded"
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {entry.responses.map((ans, j) => (
                    <p key={j} className="mt-2">- {ans}</p>
                  ))}
                  <button
                    onClick={() => {
                      setEditingIndex(i);
                      setEditedResponses([...entry.responses]);
                    }}
                    className="text-sm text-blue-500 mt-2"
                  >
                    ✏️ 수정
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
