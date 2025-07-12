"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

const questions = [
  "오늘 기억에 남는 일은?",
  "오늘 잘한 것은 무엇인가요?",
  "내일 개선하고 싶은 점은?",
];

export default function WritePage() {
  const [user, setUser] = useState<any | null>(undefined); // 초기: undefined
  const [answers, setAnswers] = useState(["", "", ""]);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u ?? null);
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (idx: number, value: string) => {
    const copy = [...answers];
    copy[idx] = value;
    setAnswers(copy);
  };

  const handleSubmit = async () => {
    if (!user) return;

    const dateStr = new Date().toISOString().split("T")[0];
    setSubmitting(true);

    try {
      const res = await fetch("http://localhost:8000/api/submit-entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          date: dateStr,
          responses: answers,
        }),
      });

      if (res.status === 409) {
        alert("오늘 회고는 이미 작성하셨습니다.");
      } else if (res.ok) {
        alert("회고가 저장되었습니다!");
        router.push("/dashboard");
      } else {
        throw new Error("서버 오류");
      }
    } catch (err: any) {
      alert("에러: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ 로그인 상태 확인 중
  if (user === undefined) return <p className="p-4">로그인 상태 확인 중...</p>;

  // ✅ 비로그인 상태 → 로그인 페이지로 이동
  if (user === null) {
    router.push("/login");
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">오늘의 회고</h1>
      {questions.map((q, i) => (
        <div key={i} className="mb-4">
          <label className="font-medium">{q}</label>
          <textarea
            className="w-full mt-2 p-2 border rounded"
            rows={3}
            value={answers[i]}
            onChange={(e) => handleChange(i, e.target.value)}
          />
        </div>
      ))}
      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 mt-4 disabled:opacity-50"
      >
        {submitting ? "저장 중..." : "저장하기"}
      </button>
    </div>
  );
}
