import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AuthButtonServer from "@/app/auth-button-server";
import { redirect } from "next/navigation";
import NewTweet from "@/app/new-tweet";
import Tweets from "@/app/tweets";

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }
  const { data } = await supabase
    .from("tweets")
    .select("*, author: profiles(*), likes(*)");

  const tweets =
    data?.map((tweet) => ({
      ...tweet,
      author: Array.isArray(tweet.author) ? tweet.author[0] : tweet.author,
      user_has_liked_tweet: !!tweet.likes.find(
        (like) => like.user_id === session.user.id,
      ),
      likes: tweet.likes.length,
    })) ?? [];

  return (
    <>
      <AuthButtonServer />
      <NewTweet />
      <Tweets tweets={tweets} />
    </>
  );
}
