import Link from "next/link";
import { Maze } from "../maze";

export default function Mazepage() {
    return (
        <main>
            <Link
                href="/"
                className="absolute left-4 top-4 z-50 px-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-md transition duration-300"
            >
                Home
            </Link>
            <Maze />
        </main>

    )
}

