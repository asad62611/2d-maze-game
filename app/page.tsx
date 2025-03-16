import { Maze } from "./maze";

export default function Home() {
  return (
    <main>
      <div className="flex flex-col gap-y-20 justify-center items-center h-dvh">
        <h1 className="text-5xl font-bold">Strona główna</h1>
        <Maze />
      </div>
    </main>
  );
}
