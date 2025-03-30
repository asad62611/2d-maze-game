"use client";

import { useEffect, useRef, useState } from "react";

const generateMaze = (rows, cols) => {
  const maze = Array(rows)
    .fill()
    .map(() => Array(cols).fill(1));

  const stack = [];
  const directions = [
    [0, -2],
    [0, 2],
    [-2, 0],
    [2, 0]
  ];

  const isValid = (x, y) => x > 0 && x < rows - 1 && y > 0 && y < cols - 1;

  const carvePath = (x, y) => {
    maze[x][y] = 0;
    stack.push([x, y]);

    while (stack.length > 0) {
      const [cx, cy] = stack[stack.length - 1];
      const shuffledDirs = directions.sort(() => Math.random() - 0.5);
      let moved = false;

      for (let [dx, dy] of shuffledDirs) {
        const nx = cx + dx;
        const ny = cy + dy;
        if (isValid(nx, ny) && maze[nx][ny] === 1) {
          maze[cx + dx / 2][cy + dy / 2] = 0;
          maze[nx][ny] = 0;
          stack.push([nx, ny]);
          moved = true;
          break;
        }
      }
      if (!moved) stack.pop();
    }
  };

  carvePath(1, 1);

  let exitX = 0,
    exitY = cols - 1;
  for (let i = rows - 2; i >= 0; i--) {
    if (maze[i][cols - 2] === 0) {
      maze[i][cols - 1] = 0;
      exitX = i;
      exitY = cols - 1;
      break;
    }
  }

  let finishX = 0,
    finishY = 0;
  let finishPlaced = false;
  while (!finishPlaced) {
    const fx = Math.floor(Math.random() * (rows - 2)) + 1;
    const fy = Math.floor(Math.random() * (cols - 2)) + 1;
    if (maze[fx][fy] === 0) {
      maze[fx][fy] = 2;
      finishX = fx;
      finishY = fy;
      finishPlaced = true;
    }
  }

  return { maze, exitX, exitY, finishX, finishY };
};

export const Maze = () => {
  const canvasRef = useRef(null);
  const rows = 51;
  const cols = 51;
  const size = Math.max(10, Math.min(40, 600 / Math.max(rows, cols))); // Dynamiczna skala na podstawie rozmiaru labiryntu
  const [mazeData] = useState(() => generateMaze(rows, cols));
  const { maze, exitX, exitY, finishX, finishY } = mazeData;

  const [players, setPlayers] = useState([
    { id: "blue", x: exitX, y: exitY + 1, time: 0, gameOver: false },
    { id: "red", x: exitX - 1, y: exitY + 1, time: 0, gameOver: false }
  ]);

  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [countdown, setCountdown] = useState(3); // Odliczanie od 3 sekund
  const [gameStarted, setGameStarted] = useState(false); // Stan gry, aby kontrolować, kiedy gra się zaczyna

  // Logika odliczania
  useEffect(() => {
    if (countdown > 0) {
      const countdownInterval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(countdownInterval);
    } else {
      // Rozpocznij grę po zakończeniu odliczania
      setStartTime(performance.now());
      setTimerActive(true);
      setGameStarted(true); // Zaznacz, że gra się zaczęła
    }
  }, [countdown]);

  // Logika timera
  useEffect(() => {
    if (startTime === null || players.every(player => player.gameOver)) return;

    const interval = setInterval(() => {
      const currentTime = performance.now();
      const timeElapsed = (currentTime - startTime) / 1000; // Przekształcenie na sekundy
      setElapsedTime(timeElapsed);
      setPlayers(prevPlayers =>
        prevPlayers.map(player =>
          player.gameOver ? player : { ...player, time: timeElapsed }
        )
      );
    }, 10);

    return () => clearInterval(interval);
  }, [startTime, players]);

  // Obsługa ruchu
  const handleKeyDown = e => {
    if (!gameStarted) return; // Zapobiegaj ruchowi przed rozpoczęciem gry

    setPlayers(prevPlayers =>
      prevPlayers.map(player => {
        let { x, y } = player;

        //if (player.gameOver) return player; // Zatrzymaj gracza, jeśli gra się skończyła

        if (player.id === "blue") {
          // Ruch gracza 1 (niebieski) za pomocą strzałek
          if (e.key === "ArrowUp" && maze[x - 1]?.[y] !== 1) x--;
          if (e.key === "ArrowDown" && maze[x + 1]?.[y] !== 1) x++;
          if (e.key === "ArrowLeft" && maze[x]?.[y - 1] !== 1) y--;
          if (e.key === "ArrowRight" && maze[x]?.[y + 1] !== 1) y++;
        } else if (player.id === "red") {
          // Ruch gracza 2 (czerwony) za pomocą klawiszy WSAD
          if (e.key === "w" && maze[x - 1]?.[y] !== 1) x--;
          if (e.key === "s" && maze[x + 1]?.[y] !== 1) x++;
          if (e.key === "a" && maze[x]?.[y - 1] !== 1) y--;
          if (e.key === "d" && maze[x]?.[y + 1] !== 1) y++;
        }

        // Sprawdzenie, czy gracz dotarł do mety
        if (x === finishX && y === finishY && !player.gameOver) {
          player.gameOver = true;
        }

        return { ...player, x, y };
      })
    );
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameStarted]);

  // Rysowanie labiryntu i graczy
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = cols * size + 40;
    canvas.height = rows * size + 40;

    const centerX = (canvas.width - cols * size) / 2;
    const centerY = (canvas.height - rows * size) / 2;

    const drawMaze = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.translate(centerX, centerY);
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          ctx.fillStyle =
            maze[i][j] === 1 ? "black" : maze[i][j] === 2 ? "green" : "white";
          ctx.fillRect(j * size, i * size, size, size);
        }
      }

      players.forEach(player => {
        ctx.fillStyle = player.id === "blue" ? "blue" : "red";
        ctx.fillRect(player.y * size, player.x * size, size, size);
      });

      ctx.translate(-centerX, -centerY);
    };

    drawMaze();
  }, [players]);

  return (
    <div className="relative flex justify-center items-center overflow-hidden w-dvw h-dvh text-white">
      <div className="absolute top-16 left-0 right-0 flex justify-center items-center">
        {/* Wyświetlanie timera */}
        <div className="text-3xl font-semibold tabular-nums text-center">
          {countdown > 0
            ? `Zaczynamy za ${countdown}...`
            : `Czas gry: ${Math.floor(elapsedTime / 60)
                .toString()
                .padStart(2, "0")}:${Math.floor(elapsedTime % 60)
                .toString()
                .padStart(2, "0")}.${Math.floor((elapsedTime % 1) * 1000)
                .toString()
                .padStart(3, "0")}`}
        </div>
      </div>

      <canvas ref={canvasRef} className="bg-white rounded-lg" />
      <div className="absolute top-32 right-10">
        {/* Wyświetlanie czasów graczy */}
        <div>
          <h3>
            Blue:{" "}
            {players[0].gameOver
              ? `${Math.floor(players[0].time / 60)
                  .toString()
                  .padStart(2, "0")}:${Math.floor(players[0].time % 60)
                  .toString()
                  .padStart(2, "0")}.${Math.floor((players[0].time % 1) * 1000)
                  .toString()
                  .padStart(3, "0")}`
              : "-"}
          </h3>

          <h3>
            Red:{" "}
            {players[1].gameOver
              ? `${Math.floor(players[1].time / 60) // <-- poprawione
                  .toString()
                  .padStart(2, "0")}:${Math.floor(players[1].time % 60)
                  .toString()
                  .padStart(2, "0")}.${Math.floor((players[1].time % 1) * 1000)
                  .toString()
                  .padStart(3, "0")}`
              : "-"}
          </h3>
        </div>
      </div>
    </div>
  );
};
