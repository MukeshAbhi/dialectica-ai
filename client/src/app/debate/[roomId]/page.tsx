"use client";

import React, { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { IconHome, IconMessage, IconUsers, IconSettings, IconLogout } from "@tabler/icons-react";
import io from "socket.io-client";

interface ChatPageProps {}

const ChatPage: React.FC<ChatPageProps> = () => {
    const params = useParams();
    const router = useRouter();
    const roomId = params.roomId as string;

    const [messages, setMessages] = useState<string[]>([]);
    const [messageInput, setMessageInput] = useState("");
    const [isConnected, setIsConnected] = useState(false);

    const socketRef = useRef<SocketIOClient.Socket | null>(null);

    // Join room on mount:
    useEffect(() => {
        if (roomId) {
            socketRef.current = io("http://localhost:5003"); // env in production
            socketRef.current.emit("joinRoom", roomId);
            setIsConnected(true);

            return () => {
                if (socketRef.current) {
                    socketRef.current.disconnect();
                }
            };
        }
    }, [roomId]);


    // Reference to the end of messages for auto-scrolling
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const links = [
        {
            label: "Home",
            href: "/",
            icon: <IconHome className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Debates",
            href: "/debate",
            icon: <IconMessage className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Rooms",
            href: "/rooms",
            icon: <IconUsers className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Settings",
            href: "/settings",
            icon: <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Logout",
            href: "/logout",
            icon: <IconLogout className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
    ];

    // Functions to handle sending messages:
    const handleSend = () => {
        if (messageInput.trim() && roomId && socketRef.current && isConnected) {
            socketRef.current.emit("sendMessage", messageInput, roomId);
            setMessageInput("");
        }
    };

    const handleLeaveRoom = () => {
        router.push("/");
    };

    // Chat Message Listener:
    useEffect(() => {
      socketRef.current?.on("chat-message", (message: string) => {
          setMessages(prev => [...prev, message]);
      });

      return () => {
        socketRef.current?.off("chat-message");
      };
    }, []);

    // System Message Listener:
    useEffect(() => {
        const handleSystemMessage = (message: string) => {
            setMessages(prev => [...prev, message]);
        };
        socketRef.current?.on("system-message", handleSystemMessage);
        return () => {
            socketRef.current?.off("system-message", handleSystemMessage);
        };
    }, []);

    return (
        <div className="rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 max-w-screen mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden h-screen">
            <Sidebar>
                <SidebarBody className="justify-between gap-10">
                    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                        <div className="mt-8 flex flex-col gap-2">
                            {links.map((link, idx) => (
                                <SidebarLink key={idx} link={link} />
                            ))}
                        </div>
                    </div>
                    <div>
                        <SidebarLink
                            link={{
                                label: "Anant Kavuru",
                                href: "#",
                                icon: (
                                    <div className="h-7 w-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                        AK
                                    </div>
                                ),
                            }}
                        />
                    </div>
                </SidebarBody>
            </Sidebar>

            <div className="flex flex-1">
                <div className="p-6 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-6 flex-1 w-full h-full overflow-auto">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100">DebateRoom AI</h2>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Room: <span className="font-mono font-medium">{roomId}</span>
                                {isConnected ? (
                                    <span className="ml-2 text-green-600 dark:text-green-400">● Connected</span>
                                ) : (
                                    <span className="ml-2 text-red-600 dark:text-red-400">● Disconnected</span>
                                )}
                            </p>
                        </div>
                        <button
                            onClick={handleLeaveRoom}
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                        >
                            Leave Room
                        </button>
                    </div>

                    <div className="border border-gray-300 dark:border-neutral-600 rounded-lg p-4 h-[400px] bg-gray-50 dark:bg-neutral-800 flex-1 overflow-y-auto">
                        {messages.length === 0 ? (
                            <div className="text-gray-400 dark:text-neutral-500">No messages yet.</div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className="p-2 bg-white dark:bg-neutral-700 rounded text-neutral-700 dark:text-neutral-200 break-words">
                                        {msg}
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={messageInput}
                            onChange={e => setMessageInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                            placeholder="Type your message..."
                            className="flex-1 px-3 py-2 rounded border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!isConnected}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
