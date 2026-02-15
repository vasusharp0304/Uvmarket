'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';

interface Message {
    id: string;
    message: string;
    sender: string;
    createdAt: string;
}

export default function Chatbot() {
    const { data: session } = useSession();
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            fetchMessages();
        }
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const res = await fetch('/api/chat');
            if (res.ok) {
                const data = await res.json();
                setMessages(data.messages || []);
            }
        } catch { }
    };

    const sendMessage = async () => {
        if (!input.trim() || loading) return;
        const text = input.trim();
        setInput('');
        setLoading(true);

        // Optimistic update
        const tempId = `temp-${Date.now()}`;
        setMessages(prev => [...prev, { id: tempId, message: text, sender: 'user', createdAt: new Date().toISOString() }]);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text }),
            });
            const data = await res.json();
            setMessages(prev => {
                const filtered = prev.filter(m => m.id !== tempId);
                return [...filtered, data.userMessage, data.botReply];
            });
        } catch {
            setMessages(prev => prev.filter(m => m.id !== tempId));
        } finally {
            setLoading(false);
        }
    };

    if (!mounted || !session) return null;

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center hover:scale-105 active:scale-95"
                id="chatbot-toggle"
            >
                {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 z-50 w-[360px] max-h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-full">
                            <Bot size={18} />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">UV Support Bot</h3>
                            <p className="text-xs text-purple-100">Ask anything about our services</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[320px] min-h-[200px] bg-gray-50/50">
                        {messages.length === 0 && (
                            <div className="text-center text-gray-400 text-sm py-8">
                                <Bot size={32} className="mx-auto mb-2 text-gray-300" />
                                <p>Say hello to get started! 👋</p>
                            </div>
                        )}
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${msg.sender === 'user'
                                    ? 'bg-purple-600 text-white rounded-br-sm'
                                    : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-bl-sm'
                                    }`}>
                                    {msg.message}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white text-gray-400 shadow-sm border border-gray-100 px-4 py-2 rounded-xl rounded-bl-sm text-sm flex items-center gap-2">
                                    <Loader2 size={14} className="animate-spin" /> Typing...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t border-gray-100 bg-white">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder="Type your message..."
                                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!input.trim() || loading}
                                className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-40"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
