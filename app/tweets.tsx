"use client";
import Likes from "@/app/likes";
import { experimental_useOptimistic as useOptimistic, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function Tweets({ tweets }: { tweets: TweetWithAuthor[] }) {
  const [optimisticTweets, addOptimisticTweets] = useOptimistic<
    TweetWithAuthor[],
    TweetWithAuthor
  >(tweets, (currentOptimisticTweets, newTweet) => {
    const newOptimisticTweets = [...currentOptimisticTweets];
    const index = newOptimisticTweets.findIndex(
      (tweet) => tweet.id === newTweet.id,
    );
    newOptimisticTweets[index] = newTweet;
    return newOptimisticTweets;
  });

  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  useEffect(() => {
    const channel = supabase
      .channel("realtime tweets")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tweets",
        },
        (payload) => {
          router.refresh();
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  return optimisticTweets.map((tweet) => (
    <div key={tweet.id}>
      <p>{tweet.author.username}</p>
      <p>{tweet.title}</p>
      <Likes tweet={tweet} addOptimisticTweet={addOptimisticTweets} />
    </div>
  ));
}
