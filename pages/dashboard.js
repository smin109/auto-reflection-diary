// pages/dashboard.js
import { auth, signOut } from "../lib/firebase";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) router.push("/login");
      else setUser(user);
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <div className="p-8">
      <h1 className="text-2xl">환영합니다, {user?.displayName}</h1>
      <button
        onClick={() => signOut(auth)}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        로그아웃
      </button>
    </div>
  );
}

