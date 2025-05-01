"use client";

import { ReturnButton } from "@/components/ReturnButton";
import { useSearchParams } from "next/navigation";
import Mazesp from "./mazesp";

export default function Mazesppage() {
  const searchParams = useSearchParams();
  const difficulty = searchParams.get("difficulty");

  console.log(difficulty);

  return (
    <main>
      <ReturnButton />
      <Mazesp difficulty={difficulty ?? "easy"} />
    </main>
  );
}
