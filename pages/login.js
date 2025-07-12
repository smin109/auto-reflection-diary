import { auth, provider, sighInWithPopup } from "../lib/firebase";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function LoginPage() {
    const [user, setUser] = useState(null);
    const router = useRouter();

    const loginWithGoogle = async() => {
        try {
            cosnt result = await sighInWithPopup(auth, provider);
            setUser(result.user);
            router.push("/dashboard");
        } catch (err) {
            alert("로그인 실패: " + err.message);
        }
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) setUser(user);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold mb-4">자동 회고 일기 - 로그인</h1>
            <button onclick={loginWithGoogle}
             className="bg-blue-500 text-white px-6 py-2 rounded shadow"
            >
             Google로 로그인하기
            </button>
        </div>
    );
}
