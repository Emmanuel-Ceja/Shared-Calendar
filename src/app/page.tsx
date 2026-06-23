"use client"
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import Calendar from "@/components/Calendar";

export default function Home() {
  const { data: session } = useSession();
  const [linkEmail, setLinkEmail] = useState("");

  async function linkUser() {
    const response = await fetch("/api/link-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ linkedEmail: linkEmail }),
    });

    if (response.ok) {
      alert(`Successfully linked with ${linkEmail}!`);
    } else {
      alert("Failed to link user.");
    }
  }

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
      <div style={{ padding: "10px", display: "flex", gap: "10px", alignItems: "center" }}>
        <button className="border-2 min-w-[75px] border-[#0A3323] rounded-sm bg-[#0A3323] text-[#839958]" onClick={() => signOut()}>Sign Out</button> 
        <input
          type="email"
          placeholder="Enter partner's email to link"
          value={linkEmail}
          onChange={(e) => setLinkEmail(e.target.value)}
        />
        <button className="border-2 border-[#0A3323] rounded-sm bg-[#0A3323] text-[#839958]" onClick={linkUser}>Link User</button>
      </div>
      <Calendar />
    </div>
  );
}