"use client";
import Likes from "@/app/likes";
import { experimental_useOptimistic as useOptimistic } from "react";

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

  return optimisticTweets.map((tweet) => (
    <div key={tweet.id}>
      <p>{tweet.author.username}</p>
      <p>{tweet.title}</p>
      <Likes tweet={tweet} addOptimisticTweet={addOptimisticTweets} />
    </div>
  ));
}
