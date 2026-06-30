"use client"
import { useSession, signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import Calendar from "@/components/Calendar";
import MenuBar from "@/components/MenuBar";
import LinkModal from "@/components/LinkModal";

export default function Home() {
  const { data: session } = useSession();
  const [isLinked, setIsLinked] = useState(false);
  const [partnerEmail, setPartnerEmail] = useState("");
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  useEffect(() => {
    if (session) {
      checkLinkStatus();
    }
  }, [session]);

  async function checkLinkStatus() {
    const response = await fetch("/api/check-link");
    const data = await response.json();
    setIsLinked(data.linked ?? false);
    setPartnerEmail(data.partnerEmail ?? "");
  }

  async function linkUser(email: string) {
    const response = await fetch("/api/link-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ linkedEmail: email }),
    });

    if (response.ok) {
      alert(`Successfully linked with ${email}!`);
      checkLinkStatus();
    } else {
      alert("Failed to link user.");
    }
  }

  async function unlinkUser() {
    const response = await fetch("/api/unlink", {
      method: "POST",
    });

    if (response.ok) {
      alert("Unlinked.");
      checkLinkStatus();
    } else {
      alert("Failed to unlink.");
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
      <div style={{ padding: "10px", display: "flex", justifyContent: "flex-end" }}>
        <MenuBar
          isLinked={isLinked}
          onOpenLinkModal={() => setIsLinkModalOpen(true)}/>
      </div>
      <LinkModal
        isOpen={isLinkModalOpen}
        setIsOpen={setIsLinkModalOpen}
        isLinked={isLinked}
        partnerEmail={partnerEmail}
        onLink={linkUser}
        onUnlink={unlinkUser}/>
      <Calendar />
    </div>
  );
}