"use client"
import { useSession, signIn, signOut } from "next-auth/react";
import Calendar from "./components/Calendar";

export default function Home() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <button onClick={() => signIn("google")}>
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div>
      <button className="border-2 border-[#0A3323] rounded-sm bg-[#0A3323] text-[#839958]" onClick={() => signOut()} >Sign Out</button>
      <Calendar />
    </div>
  );
}