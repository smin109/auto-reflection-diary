"use client";

import { useEffect, useState } from "react";
import { auth, provider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [user, setUser] = useState<any | null>(undefined); // 초기: undefined
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u ?? null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      router.push("/dashboard"); // 로그인되어 있으면 자동 이동
    }
  }, [user, router]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      alert("로그인에 실패했습니다.");
      console.error(err);
    }
  };

  if (user === undefined) return <div className="p-4">로그인 상태 확인 중...</div>;
  if (user) return null; // 이미 로그인된 경우 화면 안 보이게 처리

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Auto Reflection Diary</h1>
      <p className="mb-6 text-gray-600">Google로 로그인해서 시작하세요.</p>
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
      >
        Google 로그인
      </button>
    </main>
  );
}
