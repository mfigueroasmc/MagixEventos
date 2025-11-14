
import React, { useState, useRef, useEffect } from 'react';
import ChatIcon from './icons/ChatIcon';
import CloseIcon from './icons/CloseIcon';
import { getChatbotResponse } from '../services/geminiService';
import type { ChatMessage } from '../types';

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 1, text: "Hello! I'm AV Pro Assistant. How can I help you check on events or inventory today?", sender: 'bot' }
    ]);
    const [userInput, setUserInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim()) return;

        const newUserMessage: ChatMessage = { id: Date.now(), text: userInput, sender: 'user' };
        const loadingMessage: ChatMessage = { id: Date.now() + 1, text: '', sender: 'bot', isLoading: true };

        setMessages(prev => [...prev, newUserMessage, loadingMessage]);
        setUserInput('');

        try {
            const response = await getChatbotResponse(userInput);
            const newBotMessage: ChatMessage = { id: Date.now() + 2, text: response, sender: 'bot' };
            setMessages(prev => [...prev.slice(0, -1), newBotMessage]);
        } catch (error) {
            const errorMessage: ChatMessage = { id: Date.now() + 2, text: "Sorry, I couldn't get a response. Please try again.", sender: 'bot' };
            setMessages(prev => [...prev.slice(0, -1), errorMessage]);
        }
    };

    return (
        <>
            <div className="fixed bottom-6 right-6 z-40">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-4 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-transform transform hover:scale-110"
                >
                    {isOpen ? <CloseIcon className="h-6 w-6" /> : <ChatIcon className="h-6 w-6" />}
                </button>
            </div>
            
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-96 h-[32rem] bg-white dark:bg-gray-800 rounded-lg shadow-2xl z-40 flex flex-col">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="font-bold text-lg">AV Pro Assistant</h3>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                                <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-primary-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
                                    {msg.isLoading ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></div>
                                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
                                        </div>
                                    ) : (
                                        <p className="text-sm" dangerouslySetInnerHTML={{__html: msg.text.replace(/\n/g, '<br />')}}/>
                                    )}
                                </div>
                            </div>
                        ))}
                         <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Ask me anything..."
                            className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </form>
                </div>
            )}
        </>
    );
};

export default Chatbot;
