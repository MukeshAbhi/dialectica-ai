"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const HomePage: React.FC = () => {
    const [roomName, setRoomName] = useState("");
    const router = useRouter();

    const handleJoinRoom = () => {
        const trimmedRoomName = roomName.trim();
        if (trimmedRoomName) {
            // Navigate to the debate room
            router.push(`/debate/${encodeURIComponent(trimmedRoomName)}`);
        }
    };

    const handleCreateRandomRoom = () => {
        // Generate a random room ID
        const randomId = Math.random().toString(36).substring(2, 8);
        router.push(`/debate/${randomId}`);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-neutral-900 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">
                        DebateRoom AI
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        Join or create a debate room to get started
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <input
                            type="text"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
                            placeholder="Enter room name..."
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        onClick={handleJoinRoom}
                        disabled={!roomName.trim()}
                        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                    >
                        Join Room
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-neutral-600" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                                Or
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleCreateRandomRoom}
                        className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                        Create Random Room
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
