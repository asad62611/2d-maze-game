"use client";

import Head from "next/head";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "easy"
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const params = new URLSearchParams({
      difficulty
    });

    router.push(`/maze?${params.toString()}`);
  };

  return (
    <>
      <div className="relative flex items-center justify-center w-dvw h-dvh">
        <Head>
          <title>2D Maze Game</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="bg-white p-10 rounded-lg max-w-md w-full flex flex-col gap-y-8 z-10">
          <h1 className="text-5xl font-bold text-center">2D Maze Game</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
            <div className="flex items-center gap-x-4">
              <input
                type="text"
                placeholder="Enter your name"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-black"
              />
              <select
                value={difficulty}
                onChange={e =>
                  setDifficulty(e.target.value as "easy" | "medium" | "hard")
                }
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-black bg-white"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md transition duration-300"
            >
              Play
            </button>
          </form>
          <div>
            <a
              href="/maze"
              className="block text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition duration-300"
            >
              Create Private Room
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
