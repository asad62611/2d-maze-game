"use client";

import { ReturnButtonSP } from "@/components/ReturnButton";
import { useSearchParams } from "next/navigation";
import Mazesp from "./mazesp";

export default function Mazesppage() {
  const searchParams = useSearchParams();
  const difficulty = searchParams.get("difficulty");

  console.log(difficulty);

  return (
    <main>
      <ReturnButtonSP/>
      <Mazesp difficulty={difficulty ?? "easy"} />
    </main>
  );
}
