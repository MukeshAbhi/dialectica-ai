'use client';

import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

interface Message {
    id: string;
    user: string;
    content: string;
    timestamp: Date;
    isCurrentUser: boolean;
}

export default function HomePage() {
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            user: 'Alice',
            content: 'Hey everyone! What do you think about the impact of AI on society?',
            timestamp: new Date(Date.now() - 300000),
            isCurrentUser: false
        },
        {
            id: '2',
            user: 'Bob',
            content: 'I think AI has great potential, but we need to be careful about job displacement.',
            timestamp: new Date(Date.now() - 240000),
            isCurrentUser: false
        },
        {
            id: '3',
            user: 'You',
            content: 'That\'s a valid concern. But AI could also create new opportunities we haven\'t thought of yet.',
            timestamp: new Date(Date.now() - 180000),
            isCurrentUser: true
        }
    ]);
    const [currentUser] = useState('You');
    const [roomName] = useState('AI & Society Discussion');
    const [onlineUsers] = useState(['Alice', 'Bob', 'Charlie', 'You']);

    const handleSendMessage = () => {
        if (inputText.trim()) {
            const newMessage: Message = {
                id: Date.now().toString(),
                user: currentUser,
                content: inputText.trim(),
                timestamp: new Date(),
                isCurrentUser: true
            };
            setMessages(prev => [...prev, newMessage]);
            setInputText('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                {/* Room Header */}
                <div className="p-4 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-gray-800">{roomName}</h1>
                    <p className="text-sm text-gray-500">{onlineUsers.length} members online</p>
                </div>

                {/* Online Users */}
                <div className="flex-1 p-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Online Now</h3>
                    <div className="space-y-2">
                        {onlineUsers.map((user, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className={`text-sm ${user === currentUser ? 'font-semibold text-blue-600' : 'text-gray-700'}`}>
                                    {user}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Room Actions */}
                <div className="p-4 border-t border-gray-200">
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
                        Invite Friends
                    </button>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="bg-white border-b border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">General Discussion</h2>
                            <p className="text-sm text-gray-500">Share your thoughts and debate respectfully</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                                Settings
                            </button>
                            <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors">
                                Leave Room
                            </button>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                        <div key={message.id} className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                message.isCurrentUser
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white border border-gray-200 text-gray-800'
                            }`}>
                                {!message.isCurrentUser && (
                                    <div className="text-xs font-semibold mb-1 text-blue-600">
                                        {message.user}
                                    </div>
                                )}
                                <div className="text-sm">{message.content}</div>
                                <div className={`text-xs mt-1 ${
                                    message.isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                                }`}>
                                    {formatTime(message.timestamp)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Message Input */}
                <div className="bg-white border-t border-gray-200 p-4">
                    <div className="flex gap-3">
                        <Textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
                            className="flex-1 min-h-[44px] max-h-32 resize-none border border-gray-300 rounded-md p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputText.trim()}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium self-end"
                        >
                            Send
                        </button>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                        {inputText.length}/500 characters
                    </div>
                </div>
            </div>
        </div>
    );
}
