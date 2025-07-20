"use client";

import React, { useState } from "react";

const ChatPage: React.FC = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [messageInput, setMessageInput] = useState("");
    const [roomInput, setRoomInput] = useState("");

    const handleSend = () => {
        if (messageInput.trim()) {
            setMessages([...messages, messageInput]);
            setMessageInput("");
            // integration here............................
        }
    };

    function handleJoinRoom(): void {
        if (roomInput.trim()) {
            setMessages([...messages, `Joined room: ${roomInput}`]);
            setRoomInput("");
        }
    }
    return (
        <div className="max-w-xl mx-auto p-6">
            <h2 className="text-2xl font-semibold mb-4">DebateRoom AI</h2>
            <div className="border border-gray-300 rounded-lg p-4 min-h-[300px] mb-4 bg-gray-50">
                {messages.length === 0 ? (
                    <div className="text-gray-400">No messages yet.</div>
                ) : (
                    messages.map((msg, idx) => (
                        <div key={idx} className="mb-2">
                            {msg}
                        </div>
                    ))
                )}
            </div>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={messageInput}
                    onChange={e => setMessageInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="Type your message..."
                    className="flex-1 px-2 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleSend}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    Send
                </button>
            </div>

            <div className="flex gap-2 mt-4">
                <input
                    type="text"
                    value={roomInput}
                    onChange={e => setRoomInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleJoinRoom()}
                    placeholder="Enter a room name..."
                    className="flex-1 px-2 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleJoinRoom}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    Join
                </button>
            </div>

        </div>
    );
};

export default ChatPage;
