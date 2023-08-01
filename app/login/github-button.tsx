"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";

export default function GithubButton() {
  const supabase = createClientComponentClient<Database>();
  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  };

  return (
    <button className="hover:bg-gray-800 p-8 rounded-xl" onClick={handleSignIn}>
      <Image
        src="/github-mark-white.png"
        alt="github logo"
        width={100}
        height={100}
      />
    </button>
  );
}
