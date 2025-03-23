import Head from "next/head";

export default function Home() {
  return (
    <div className="relative flex items-center justify-center w-dvw h-dvh">
      <Head>
        <title>2D Maze Game</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="absolute inset-0 w-dvw h-dvh bg-[url('/background.avif')] bg-repeat bg-center z-0">
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full z-10">
        <h1 className="text-5xl font-bold text-center mb-8">2D Maze Game</h1>
        <form className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Enter your name"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-md transition duration-300"
          >
            Play
          </button>
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-md transition duration-300"
          >
            Create Private Room
          </button>
          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 rounded-md transition duration-300"
          >
            How to Play
          </button>
          <button
            type="submit"
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 rounded-md transition duration-300"
          >
            Settings
          </button>
        </form>
      </div>
    </div>
  );
}
