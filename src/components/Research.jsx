
import React, { useState } from 'react';
import axios from 'axios';
import { MessageSquare, Send, Bot, User } from 'lucide-react';

const Research = () => {
    const [query, setQuery] = useState('');
    const [chatHistory, setChatHistory] = useState([
        { role: 'system', content: 'Hello! I am your AI Research Assistant. Ask me anything about alloy properties, recovery rates, or historical data.' }
    ]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        const newHistory = [...chatHistory, { role: 'user', content: query }];
        setChatHistory(newHistory);
        setQuery('');
        setLoading(true);

        try {
            const res = await axios.post('http://localhost:5000/api/research/query', { query });

            // Combine chunks into a single response
            const answer = res.data.results.map(r => r.content).join('\n\n---\n\n');

            setChatHistory([...newHistory, { role: 'system', content: answer || "I couldn't find relevant information in the knowledge base." }]);
        } catch (err) {
            setChatHistory([...newHistory, { role: 'system', content: "Error connecting to Research Engine." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
            <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
                    <MessageSquare className="w-8 h-8" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-steel-900">Research Assistant</h2>
                    <p className="text-steel-500">Query the knowledge base using RAG technology</p>
                </div>
            </div>

            <div className="flex-1 glass-panel p-6 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
                    {chatHistory.map((msg, idx) => (
                        <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-steel-200' : 'bg-accent-blue text-white'}`}>
                                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                            </div>
                            <div className={`p-4 rounded-2xl max-w-[80%] ${msg.role === 'user'
                                    ? 'bg-steel-100 text-steel-800 rounded-tr-none'
                                    : 'bg-blue-50 text-steel-800 rounded-tl-none border border-blue-100'
                                }`}>
                                <p className="whitespace-pre-line text-sm">{msg.content}</p>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-accent-blue text-white flex items-center justify-center shrink-0">
                                <Bot className="w-5 h-5" />
                            </div>
                            <div className="p-4 bg-blue-50 rounded-2xl rounded-tl-none border border-blue-100">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75" />
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSearch} className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ask about Chromium recovery, pricing trends, or inventory specs..."
                        className="w-full pl-6 pr-14 py-4 rounded-xl border border-steel-200 focus:outline-none focus:ring-2 focus:ring-accent-blue/50 shadow-sm"
                    />
                    <button
                        type="submit"
                        disabled={!query.trim() || loading}
                        className="absolute right-2 top-2 p-2 bg-accent-blue text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Research;
