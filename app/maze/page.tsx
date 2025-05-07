"use client";

import { useSearchParams } from "next/navigation";
import { Maze } from "./maze";

export default function Mazepage() {
  const searchParams = useSearchParams();
  const difficulty = searchParams.get("difficulty");

  return (
    <main>
      <Maze difficulty={difficulty ?? "easy"} />
    </main>
  );
}
