'use client';

import React, { useState, useEffect} from 'react';
import { Textarea } from '@/components/ui/textarea';
import { socket } from '@/lib/socket';

interface Message {
    id: string;
    user: string;
    content: string;
    timestamp: Date;
    isCurrentUser: boolean;
    side: 'pro' | 'con';
}

interface DebateStats {
    totalArguments: number;
    proArguments: number;
    conArguments: number;
    timeRemaining: string;
}

export default function HomePage() {
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            user: 'Alice',
            content: 'I believe AI regulation is absolutely necessary. Without proper oversight, we risk creating systems that could harm society through biased decision-making, privacy violations, and job displacement without adequate protections for workers.',
            timestamp: new Date(Date.now() - 300000),
            isCurrentUser: false,
            side: 'pro'
        },
        {
            id: '2',
            user: 'You',
            content: 'While I understand the concerns, over-regulation could stifle innovation and prevent us from realizing AI\'s full potential to solve global challenges like climate change, disease, and poverty. We need balanced approaches, not restrictive regulations.',
            timestamp: new Date(Date.now() - 180000),
            isCurrentUser: true,
            side: 'con'
        }
    ]);
    const [currentUser] = useState('You');
    const [opponent] = useState('Alice');
    const [currentUserSide] = useState<'pro' | 'con'>('con');
    const [debateStats] = useState<DebateStats>({
        totalArguments: 2,
        proArguments: 1,
        conArguments: 1,
        timeRemaining: '12:34'
    });

    useEffect(() => {
        socket.emit("debate:join", { user: currentUser, debateId: "room1" });

        socket.on("chat:message", (msg: Message) => {
            setMessages(prev => [...prev, msg]);
        });

        return () => {
            socket.disconnect();
        };
    }, [currentUser]);

    const handleSendMessage = () => {
        if (inputText.trim()) {
            socket.emit("chat:message", {
                debateId: "room1",
                message: {
                    id: Date.now().toString(),
                    user: currentUser,
                    content: inputText.trim(),
                    timestamp: new Date(),
                    isCurrentUser: true,
                    side: currentUserSide
                }
            });
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
        <div className="h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex">
            {/* Left Sidebar - Debate Info */}
            <div className="w-75 bg-white/90 backdrop-blur-sm border-r border-gray-200 flex flex-col shadow-lg">
                {/* Debate Header */}
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">LIVE DEBATE</span>
                    </div>
                    <h1 className="text-lg font-bold">AI Ethics Debate</h1>
                    <p className="text-blue-100 text-sm mt-1">Round 1 of 3</p>
                </div>

                {/* Debate Topic */}
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Debate Topic
                    </h2>
                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                        <p className="text-sm text-gray-700 leading-relaxed">
                            "Should AI be heavily regulated to ensure ethical use in society?"
                        </p>
                    </div>
                </div>

                {/* Participants */}
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4">PARTICIPANTS</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                A
                            </div>
                            <div className="flex-1">
                                <div className="font-medium text-gray-800">{opponent}</div>
                                <div className="text-xs text-green-600 font-medium">PRO REGULATION</div>
                            </div>
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                Y
                            </div>
                            <div className="flex-1">
                                <div className="font-medium text-gray-800">{currentUser}</div>
                                <div className="text-xs text-red-600 font-medium">AGAINST REGULATION</div>
                            </div>
                            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        </div>
                    </div>
                </div>

                {/* Debate Stats */}
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4">DEBATE STATS</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Total Arguments</span>
                            <span className="font-bold text-gray-800">{debateStats.totalArguments}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-green-600">Pro Arguments</span>
                            <span className="font-bold text-green-600">{debateStats.proArguments}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-red-600">Con Arguments</span>
                            <span className="font-bold text-red-600">{debateStats.conArguments}</span>
                        </div>
                        <div className="pt-2 border-t border-gray-200">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Time Remaining</span>
                                <span className="font-mono font-bold text-orange-600">{debateStats.timeRemaining}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Debate Area */}
            <div className="flex-1 flex flex-col">
                {/* Debate Header */}
                <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Debate Arena</h2>
                            <p className="text-sm text-gray-600">Present your arguments clearly and respectfully</p>
                        </div>
                           {/* Action Buttons */}
                            <div className=" flex space-x-4 mt-auto">
                                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white  py-2 px-5 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium text-sm shadow-md">
                                    End
                                </button>
                                <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                                    Rules
                                </button>
                            </div>

                    </div>
                </div>

                {/* Debate Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-transparent to-gray-50/30">
                    {messages.map((message, index) => (
                        <div key={message.id} className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-2xl w-full ${message.isCurrentUser ? 'ml-12' : 'mr-12'}`}>
                                {/* Argument Header */}
                                <div className={`flex items-center gap-3 mb-2 ${message.isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                                        message.side === 'pro' ? 'bg-green-500' : 'bg-red-500'
                                    }`}>
                                        {message.user.charAt(0)}
                                    </div>
                                    <div className={`flex items-center gap-2 ${message.isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <span className="font-semibold text-gray-800">{message.user}</span>
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                            message.side === 'pro'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                        }`}>
                                            {message.side === 'pro' ? 'PRO' : 'CON'}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            Argument #{index + 1}
                                        </span>
                                    </div>
                                </div>

                                {/* Message Content */}
                                <div className={`relative ${
                                    message.isCurrentUser
                                        ? 'bg-gradient-to-br from-red-500 to-red-600 text-white'
                                        : 'bg-white border-2 border-green-200 text-gray-800'
                                } rounded-xl p-5 shadow-lg`}>
                                    {/* Message bubble arrow */}
                                    <div className={`absolute top-4 w-3 h-3 transform rotate-45 ${
                                        message.isCurrentUser
                                            ? 'bg-red-500 -right-1'
                                            : 'bg-white border-l-2 border-t-2 border-green-200 -left-1'
                                    }`}></div>

                                    <div className="text-sm leading-relaxed font-medium">
                                        {message.content}
                                    </div>

                                    <div className={`flex items-center justify-between mt-3 pt-3 border-t ${
                                        message.isCurrentUser
                                            ? 'border-red-400/30'
                                            : 'border-gray-200'
                                    }`}>
                                        <div className={`text-xs ${
                                            message.isCurrentUser
                                                ? 'text-red-100'
                                                : 'text-gray-500'
                                        }`}>
                                            {formatTime(message.timestamp)}
                                        </div>
                                        <div className="flex gap-2">
                                            <button className={`text-xs px-2 py-1 rounded transition-colors ${
                                                message.isCurrentUser
                                                    ? 'bg-red-400/20 text-white hover:bg-red-400/30'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}>
                                                Counter
                                            </button>
                                            <button className={`text-xs px-2 py-1 rounded transition-colors ${
                                                message.isCurrentUser
                                                    ? 'bg-red-400/20 text-white hover:bg-red-400/30'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}>
                                                Support
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {false && (
                        <div className="flex justify-start mr-12">
                            <div className="max-w-xs bg-white border-2 border-green-200 rounded-xl p-4 shadow-lg">
                                <div className="flex items-center gap-2 text-green-600">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                    </div>
                                    <span className="text-sm">{opponent} is crafting a response...</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Argument Input */}
                <div className="bg-white/90 backdrop-blur-sm border-t-2 border-gray-200 p-6 shadow-lg">
                    <div className="mb-4">
                        {/* <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                Your Argument (CON Position)
                            </h3>
                            <div className="flex items-center gap-3">
                                <button className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors">
                                    🤖 AI Assist
                                </button>
                                <button className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors">
                                    📊 Facts
                                </button>
                            </div>
                        </div> */}
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Present your argument against regulation... Be specific and provide reasoning."
                                className="min-h-[100px] max-h-40 resize-none border-2 border-gray-300 rounded-xl p-4 focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all text-sm leading-relaxed"
                            />
                            <div className="flex justify-between items-center mt-2">
                                <div className="text-xs text-gray-500">
                                    {inputText.length}/1000 characters
                                </div>
                                <div className="text-xs text-gray-500">
                                    Press Shift+Enter for new line
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputText.trim()}
                                className="px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-sm shadow-lg whitespace-nowrap"
                            >
                                Submit Argument
                            </button>
                            <button className="px-6 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors text-xs font-medium">
                                Save Draft
                            </button>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    {/* <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                        <button className="text-xs px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors">
                            🔄 Counter Last Argument
                        </button>
                        <button className="text-xs px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                            ✋ Request Clarification
                        </button>
                        <button className="text-xs px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                            📝 Summarize Position
                        </button>
                    </div> */}
                </div>
            </div>
        </div>
    );
}
