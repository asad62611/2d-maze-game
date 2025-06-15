"use client";
import { useEffect, useState, useRef } from "react";

export const Chat = ({ socket, myId, players, chatEnabled, roomId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

useEffect(() => {
  if (!socket) return;

  const handleMessage = (msg) => {
    setMessages((prev) => [...prev, msg]);
  };

  socket.off("chatMessage", handleMessage); // <- na wszelki wypadek
  socket.on("chatMessage", handleMessage);
  console.log("📡 Zarejestrowano chatMessage");

  return () => {
    socket.off("chatMessage", handleMessage);
    console.log("🧹 Odlaczono chatMessage");
  };
}, [socket]);


  // Przewijanie do dołu po nowej wiadomości
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Wysyłanie wiadomości
  const sendMessage = () => {
    if (!input.trim()) return;

    const nick = players[myId]?.nick || "Anonim";
    const msg = {
      roomId: roomId,
      nick,
      message: input.trim(),
    };

    socket.emit("chatMessage", msg);
    setInput("");
  };

  if (!chatEnabled) return null;

  return (
    <div className="absolute bottom-4 left-4 bg-white/90 text-black rounded-md shadow-md w-80 max-h-60 flex flex-col z-50">
      <div className="p-2 overflow-y-auto flex-1 text-sm">
        {messages.map((msg, i) => (
          <div key={`${msg.nick}-${i}`}>
            <strong>{msg.nick}:</strong> {msg.message}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex border-t border-gray-300">
        <input
          className="flex-1 px-2 py-1 text-sm bg-white border-none outline-none rounded-bl-md"
          placeholder="Napisz wiadomość..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="px-3 text-sm bg-green-600 text-white rounded-br-md hover:bg-green-700"
        >
          Wyślij
        </button>
      </div>
    </div>
  );
};
