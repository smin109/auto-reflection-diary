// pages/write.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../lib/firebase";

const defaultQuestions = [
  "오늘 기억에 남는 일은?",
  "오늘 잘한 것은 무엇인가?",
  "내일 개선하고 싶은 부분은?"
];

export default function WritePage() {
  const [answers, setAnswers] = useState(["", "", ""]);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (!u) router.push("/login");
      else setUser(u);
    });
    return () => unsubscribe();
  }, [router]);

  const handleChange = (idx, value) => {
    const newAnswers = [...answers];
    newAnswers[idx] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/submit-entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          date: new Date().toISOString().split("T")[0],
          responses: answers
        })
      });

      if (res.ok) {
        alert("회고가 저장되었습니다!");
        router.push("/dashboard");
      } else {
        throw new Error("저장 실패");
      }
    } catch (err) {
      alert("에러 발생: " + err.message);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">오늘의 회고</h1>
      {defaultQuestions.map((q, i) => (
        <div key={i} className="mb-4">
          <p className="mb-2 font-medium">{q}</p>
          <textarea
            className="w-full p-2 border rounded resize-none"
            rows={3}
            value={answers[i]}
            onChange={(e) => handleChange(i, e.target.value)}
          />
        </div>
      ))}
      <button
        className="bg-blue-500 text-white px-6 py-2 rounded shadow mt-4"
        onClick={handleSubmit}
      >
        저장하기
      </button>
    </div>
  );
}

