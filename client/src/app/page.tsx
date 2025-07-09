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
        // {
        //     id: '1',
        //     user: 'Alice',
        //     content: 'I believe AI regulation is absolutely necessary. Without proper oversight, we risk creating systems that could harm society through biased decision-making, privacy violations, and job displacement without adequate protections for workers.',
        //     timestamp: new Date(Date.now() - 300000),
        //     isCurrentUser: false,
        //     side: 'pro'
        // },
        // {
        //     id: '2',
        //     user: 'You',
        //     content: 'While I understand the concerns, over-regulation could stifle innovation and prevent us from realizing AI\'s full potential to solve global challenges like climate change, disease, and poverty. We need balanced approaches, not restrictive regulations.',
        //     timestamp: new Date(Date.now() - 180000),
        //     isCurrentUser: true,
        //     side: 'con'
        // }
    ]);
    // => removing hardcoded messages


    const [currentUser] = useState('You');
    const [opponent, setOpponent] = useState('Waiting for opponent...');
    const [currentUserSide, setCurrentUserSide] = useState<'pro' | 'con'>('pro');
    const [currentRoomId, setCurrentRoomId] = useState('room1');
    const [currentUserId, setCurrentUserId] = useState('');
    const [debateStats, setDebateStats] = useState<DebateStats>({
        totalArguments: 0,
        proArguments: 0,
        conArguments: 0,
        timeRemaining: '15:00'
    });

    useEffect(() => {
        // Reset state when component mounts
        setMessages([]);
        setOpponent('Waiting for opponent...');
        setCurrentRoomId('room1');
        setCurrentUserId('');

        socket.emit("debate:join", { user: currentUser, debateId: "room" });

        // Handle incoming messages
        socket.on("chat:message", (msg: Message) => {
            setMessages(prev => [
                ...prev,
                {
                    ...msg,
                    timestamp: new Date(msg.timestamp),
                    isCurrentUser: false // Messages from other clients are not current user's
                }
            ]);
        });

        // Handle room and side assignment from server
        socket.on("debate:room-assigned", ({ roomId, side, userId }: {
            roomId: string;
            side: 'pro' | 'con';
            userId: string
        }) => {
            console.log(`Assigned to room: ${roomId}, side: ${side.toUpperCase()}, userId: ${userId}`);
            setCurrentRoomId(roomId);
            setCurrentUserSide(side);
            setCurrentUserId(userId);

            // Reset messages and opponent when joining new room
            setMessages([]);
            setOpponent('Waiting for opponent...');
        });

        // Handle participants updates
        socket.on("debate:participants-update", ({ participants }: {
            participants: Array<{ user: string; side: 'pro' | 'con'; socketId: string }>
        }) => {
            console.log('Participants updated:', participants);
            console.log('Current userId:', currentUserId);
            console.log('Current roomId:', currentRoomId);

            // Update opponent info - use setTimeout to ensure state is updated
            setTimeout(() => {
                if (currentUserId) {
                    const otherParticipant = participants.find(p => p.socketId !== currentUserId);
                    if (otherParticipant) {
                        console.log('Setting opponent to:', otherParticipant.user);
                        setOpponent(otherParticipant.user);
                    } else {
                        console.log('No opponent found, setting to waiting...');
                        setOpponent('Waiting for opponent...');
                    }
                } else {
                    console.log('CurrentUserId not set yet, deferring opponent update');
                }
            }, 50);

            // Update debate stats
            setDebateStats(prev => ({
                ...prev,
                totalArguments: messages.length,
                proArguments: messages.filter(m => m.side === 'pro').length,
                conArguments: messages.filter(m => m.side === 'con').length
            }));
        });

        // Handle room full (shouldn't happen with new logic, but keep for safety)
        socket.on("debate:room-full", () => {
            alert("All debate rooms are currently full. Please try again later.");
        });

        return () => {
            socket.off("chat:message");
            socket.off("debate:room-assigned");
            socket.off("debate:participants-update");
            socket.off("debate:room-full");
            socket.off("debate:get-participants");
            if (currentRoomId) {
                socket.emit("debate:leave", { user: currentUser, debateId: currentRoomId });
            }
        };
    }, [currentUser]); // Only depend on currentUser    // Separate effect to handle participant updates when currentUserId changes
    useEffect(() => {
        if (currentUserId && currentRoomId && currentRoomId !== 'room1') {
            // Only request participants if we're not in the default room
            const timeout = setTimeout(() => {
                socket.emit("debate:get-participants", { debateId: currentRoomId });
            }, 200);

            return () => clearTimeout(timeout);
        }
    }, [currentUserId, currentRoomId]);

    const handleSendMessage = () => {
        if (inputText.trim()) {
            const newMessage = {
                id: Date.now().toString(),
                user: currentUser,
                content: inputText.trim(),
                timestamp: new Date(),
                isCurrentUser: true,
                side: currentUserSide
            };

            // Add message locally first (for immediate UI feedback)
            setMessages(prev => [...prev, newMessage]);

            // Then emit to server (this will broadcast to other clients)
            socket.emit("chat:message", {
                debateId: currentRoomId,
                message: {
                    ...newMessage,
                    timestamp: newMessage.timestamp.toISOString(),
                    isCurrentUser: false // For other clients, this won't be their message
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
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">LIVE DEBATE</span>
                    </div>
                    <h1 className="text-lg font-bold">AI Ethics Debate</h1>
                    <p className="text-blue-100 text-sm mt-1">
                        {currentRoomId.toUpperCase()} • Round 1 of 3 • ID: {currentUserId.slice(-6)}
                    </p>
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
                        {/* Current User */}
                        <div className={`flex items-center gap-3 p-3 rounded-lg border ${
                            currentUserSide === 'pro'
                                ? 'bg-green-50 border-green-200'
                                : 'bg-red-50 border-red-200'
                        }`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                                currentUserSide === 'pro' ? 'bg-green-500' : 'bg-red-500'
                            }`}>
                                {currentUser.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <div className="font-medium text-gray-800">{currentUser}</div>
                                <div className={`text-xs font-medium ${
                                    currentUserSide === 'pro' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {currentUserSide === 'pro' ? 'PRO REGULATION' : 'AGAINST REGULATION'}
                                </div>
                            </div>
                            <div className={`w-2 h-2 rounded-full ${
                                currentUserSide === 'pro' ? 'bg-green-400' : 'bg-red-400'
                            }`}></div>
                        </div>

                        {/* Opponent */}
                        <div className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${
                            opponent === 'Waiting for opponent...'
                                ? 'bg-gray-50 border-gray-200'
                                : currentUserSide === 'pro'
                                    ? 'bg-red-50 border-red-200'
                                    : 'bg-green-50 border-green-200'
                        }`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm transition-all duration-300 ${
                                opponent === 'Waiting for opponent...'
                                    ? 'bg-gray-400'
                                    : currentUserSide === 'pro'
                                        ? 'bg-red-500'
                                        : 'bg-green-500'
                            }`}>
                                {opponent === 'Waiting for opponent...' ? '?' : opponent.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <div className="font-medium text-gray-800">
                                    {opponent === 'Waiting for opponent...' ? 'Opponent' : opponent}
                                </div>
                                <div className={`text-xs font-medium transition-all duration-300 ${
                                    opponent === 'Waiting for opponent...'
                                        ? 'text-gray-500'
                                        : currentUserSide === 'pro'
                                            ? 'text-red-600'
                                            : 'text-green-600'
                                }`}>
                                    {opponent === 'Waiting for opponent...'
                                        ? 'Waiting to join...'
                                        : currentUserSide === 'pro'
                                            ? 'AGAINST REGULATION'
                                            : 'PRO REGULATION'
                                    }
                                </div>
                            </div>
                            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                opponent === 'Waiting for opponent...'
                                    ? 'bg-gray-300 animate-pulse'
                                    : currentUserSide === 'pro'
                                        ? 'bg-red-400'
                                        : 'bg-green-400'
                            }`}></div>
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
                        <div key={message.id} className={`flex ${
                            message.side === currentUserSide ? 'justify-end' : 'justify-start'
                        }`}>
                            <div className={`max-w-2xl w-full ${
                                message.side === currentUserSide ? 'ml-12' : 'mr-12'
                            }`}>
                                {/* Argument Header */}
                                <div className={`flex items-center gap-3 mb-2 ${
                                    message.side === currentUserSide ? 'flex-row-reverse' : 'flex-row'
                                }`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                                        message.side === 'pro' ? 'bg-green-500' : 'bg-red-500'
                                    }`}>
                                        {message.user.charAt(0)}
                                    </div>
                                    <div className={`flex items-center gap-2 ${
                                        message.side === currentUserSide ? 'flex-row-reverse' : 'flex-row'
                                    }`}>
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
                                    message.side === currentUserSide
                                        ? message.side === 'pro'
                                            ? 'bg-gradient-to-br from-green-500 to-green-600 text-white'
                                            : 'bg-gradient-to-br from-red-500 to-red-600 text-white'
                                        : message.side === 'pro'
                                            ? 'bg-white border-2 border-green-200 text-gray-800'
                                            : 'bg-white border-2 border-red-200 text-gray-800'
                                } rounded-xl p-5 shadow-lg`}>
                                    {/* Message bubble arrow */}
                                    <div className={`absolute top-4 w-3 h-3 transform rotate-45 ${
                                        message.side === currentUserSide
                                            ? message.side === 'pro'
                                                ? 'bg-green-500 -right-1'
                                                : 'bg-red-500 -right-1'
                                            : message.side === 'pro'
                                                ? 'bg-white border-l-2 border-t-2 border-green-200 -left-1'
                                                : 'bg-white border-l-2 border-t-2 border-red-200 -left-1'
                                    }`}></div>

                                    <div className="text-sm leading-relaxed font-medium">
                                        {message.content}
                                    </div>

                                    <div className={`flex items-center justify-between mt-3 pt-3 border-t ${
                                        message.side === currentUserSide
                                            ? message.side === 'pro'
                                                ? 'border-green-400/30'
                                                : 'border-red-400/30'
                                            : 'border-gray-200'
                                    }`}>
                                        <div className={`text-xs ${
                                            message.side === currentUserSide
                                                ? message.side === 'pro'
                                                    ? 'text-green-100'
                                                    : 'text-red-100'
                                                : 'text-gray-500'
                                        }`}>
                                            {formatTime(message.timestamp)}
                                        </div>
                                        <div className="flex gap-2">
                                            <button className={`text-xs px-2 py-1 rounded transition-colors ${
                                                message.side === currentUserSide
                                                    ? message.side === 'pro'
                                                        ? 'bg-green-400/20 text-white hover:bg-green-400/30'
                                                        : 'bg-red-400/20 text-white hover:bg-red-400/30'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}>
                                                Counter
                                            </button>
                                            <button className={`text-xs px-2 py-1 rounded transition-colors ${
                                                message.side === currentUserSide
                                                    ? message.side === 'pro'
                                                        ? 'bg-green-400/20 text-white hover:bg-green-400/30'
                                                        : 'bg-red-400/20 text-white hover:bg-red-400/30'
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
                                placeholder={`Present your argument ${currentUserSide === 'pro' ? 'supporting' : 'against'} regulation... Be specific and provide reasoning.`}
                                className={`min-h-[100px] max-h-40 resize-none border-2 border-gray-300 rounded-xl p-4 transition-all text-sm leading-relaxed ${
                                    currentUserSide === 'pro'
                                        ? 'focus:border-green-500 focus:ring-4 focus:ring-green-100'
                                        : 'focus:border-red-500 focus:ring-4 focus:ring-red-100'
                                }`}
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
                                className={`px-6 py-4 text-white rounded-xl transition-all duration-200 font-semibold text-sm shadow-lg whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed ${
                                    currentUserSide === 'pro'
                                        ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                                        : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                                }`}
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
