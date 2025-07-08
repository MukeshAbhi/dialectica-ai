'use client';

import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

export default function HomePage() {
    const [inputText, setInputText] = useState('');
    const [charCount, setCharCount] = useState(0);
    const maxChars = 1000;

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        if (text.length <= maxChars) {
            setInputText(text);
            setCharCount(text.length);
        }
    };

    const handleClear = () => {
        setInputText('');
        setCharCount(0);
    };

    const handleSubmit = () => {
        if (inputText.trim()) {
            console.log('Submitted text:', inputText);
            // Add your submission logic here
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        DebateRoom AI
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Share your thoughts and engage in meaningful discussions
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="mb-6">
                        <label htmlFor="main-textarea" className="block text-lg font-semibold text-gray-700 mb-3">
                            What's on your mind?
                        </label>

                        <Textarea
                            id="main-textarea"
                            value={inputText}
                            onChange={handleTextChange}
                            placeholder="Share your thoughts, start a debate, or ask a question..."
                            className="w-full h-48 resize-none border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 rounded-md p-3"
                        />

                        <div className="flex justify-between items-center mt-3">
                            <span className={`text-sm ${charCount > maxChars * 0.9 ? 'text-red-500' : 'text-gray-500'}`}>
                                {charCount}/{maxChars} characters
                            </span>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleClear}
                                    disabled={!inputText}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Clear
                                </button>

                                <button
                                    onClick={handleSubmit}
                                    disabled={!inputText.trim()}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>

                    {inputText && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold text-gray-700 mb-2">Preview:</h3>
                            <p className="text-gray-600 whitespace-pre-wrap">{inputText}</p>
                        </div>
                    )}
                </div>

                <div className="mt-8 text-center">
                    <p className="text-gray-600">
                        Ready to dive deeper?
                        <span className="text-blue-600 font-medium ml-1">Join a debate room</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
