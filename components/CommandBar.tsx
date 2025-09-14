import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';

interface AIAssistantProps {
    chatHistory: ChatMessage[];
    onSubmit: (command: string) => void;
    isLoading: boolean;
    error: string | null;
}

const LoadingSpinner: React.FC = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const AIAvatar: React.FC = () => (
    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex-shrink-0 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L11 12l4.293 4.293a1 1 0 01-1.414 1.414L10 13.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 12 4.293 7.707a1 1 0 011.414-1.414L10 10.586l4.293-4.293a1 1 0 011.414 0z" /></svg>
    </div>
);


const AIAssistant: React.FC<AIAssistantProps> = ({ chatHistory, onSubmit, isLoading, error }) => {
    const [inputValue, setInputValue] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(inputValue);
        setInputValue('');
    };

    return (
        <div className="flex flex-col h-full">
            <h3 className="text-lg font-semibold text-gray-100 mb-4 text-center">AI Assistant</h3>
            <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                {chatHistory.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                        {msg.sender === 'ai' && <AIAvatar />}
                        <div className={`max-w-xs md:max-w-sm rounded-lg px-4 py-2 ${msg.sender === 'ai' ? 'bg-gray-700 text-gray-200' : 'bg-blue-600 text-white'}`}>
                            <p className="text-sm">{msg.text}</p>
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>
            <div className="mt-4">
                 {error && <div className="text-red-400 text-sm mb-2 text-center">{error}</div>}
                <form onSubmit={handleSubmit} className="relative flex">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        disabled={isLoading}
                        placeholder={isLoading ? "Thinking..." : "Message your AI..."}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-2 pl-4 pr-24 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                        aria-label="AI Command Input"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !inputValue.trim()}
                        className="absolute right-1 top-1/2 -translate-y-1/2 bg-blue-600 text-white font-semibold py-1.5 px-3 rounded-md hover:bg-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors flex items-center justify-center w-20"
                    >
                        {isLoading ? <LoadingSpinner /> : 'Send'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AIAssistant;