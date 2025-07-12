"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

type Entry = {
  date: string;
  responses: string[];
};

export default function Dashboard() {
  const [user, setUser] = useState<any | null>(undefined); // ✅ 초기값: undefined
  const [entries, setEntries] = useState<Entry[]>([]);
  const router = useRouter();

  // Firebase 인증 상태 확인
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u ?? null);
    });
    return () => unsubscribe();
  }, []);

  // 인증 상태가 결정된 후에만 fetch 또는 리다이렉트
  useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged(async (u) => {
    if (!u) {
      router.push("/login");
    } else {
      setUser(u);
      const res = await fetch(`http://localhost:8000/api/get-entries?uid=${u.uid}`);
      const data = await res.json();
      console.log("🔥 entries API 결과:", data);  // ✅ 콘솔에 출력해보기
      setEntries(Array.isArray(data) ? data : []); // 배열이 아닐 경우 빈 배열 처리
    }
  });

  return () => unsubscribe();
}, [router]);


  if (user === undefined) {
    return <div className="p-4">로그인 상태 확인 중...</div>;
  }

  if (user === null) {
    return null; // 로그인 중이거나 푸시 중
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">📒 내 회고 목록</h1>
      {entries.length === 0 ? (
        <p>아직 회고를 작성하지 않았습니다.</p>
      ) : (
        <ul className="space-y-6">
          {entries.map((entry, i) => (
            <li key={i} className="p-4 border rounded shadow-sm">
              <p className="text-sm text-gray-500">{entry.date}</p>
              {entry.responses.map((ans, j) => (
                <p key={j} className="mt-2">- {ans}</p>
              ))}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
