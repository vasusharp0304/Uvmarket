'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { LoadingSpinner } from '@/components/Loading';
import {
    MessageCircle, Search, Send, User, Clock, AlertCircle,
    CheckCircle, Mail, Phone, ChevronLeft, X, Bot, Shield
} from 'lucide-react';

interface ChatUser {
    id: string;
    name: string;
    email: string;
    photoUrl: string | null;
    subscriptionStatus: string;
    isActive: boolean;
    lastMessage: {
        id: string;
        message: string;
        sender: string;
        needsAdminReview: boolean;
        adminReplied: boolean;
        createdAt: string;
    } | null;
    totalMessages: number;
    needsReviewCount: number;
    unreadCount: number;
}

interface ChatMessage {
    id: string;
    message: string;
    sender: string;
    needsAdminReview: boolean;
    adminReplied: boolean;
    createdAt: string;
}

interface UserDetails {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    photoUrl: string | null;
    subscriptionStatus: string;
    isActive: boolean;
    createdAt: string;
}

export default function AdminChats() {
    const [users, setUsers] = useState<ChatUser[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<ChatUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [replyText, setReplyText] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const fetchUsers = useCallback(async () => {
        try {
            const res = await fetch('/api/admin/chats');
            const data = await res.json();
            setUsers(data.users || []);
            setFilteredUsers(data.users || []);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to load chat users');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    useEffect(() => {
        if (searchQuery.trim()) {
            const filtered = users.filter(u =>
                u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(users);
        }
    }, [searchQuery, users]);

    const fetchUserMessages = async (userId: string) => {
        try {
            const res = await fetch(`/api/admin/chats/${userId}`);
            const data = await res.json();
            setUserDetails(data.user);
            setMessages(data.messages || []);
        } catch (err) {
            console.error('Error fetching messages:', err);
            setError('Failed to load messages');
        }
    };

    useEffect(() => {
        if (selectedUser) {
            fetchUserMessages(selectedUser.id);
        }
    }, [selectedUser]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSelectUser = (user: ChatUser) => {
        setSelectedUser(user);
        setError('');
        setSuccess('');
        setReplyText('');
    };

    const handleBackToList = () => {
        setSelectedUser(null);
        setUserDetails(null);
        setMessages([]);
        fetchUsers(); // Refresh to update unread counts
    };

    const handleSendReply = async () => {
        if (!selectedUser || !replyText.trim() || sending) return;

        setSending(true);
        setError('');

        try {
            const res = await fetch(`/api/admin/chats/${selectedUser.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: replyText.trim() }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to send reply');
            }

            const data = await res.json();
            setMessages(prev => [...prev, data.message]);
            setReplyText('');
            setSuccess('Reply sent successfully!');
            setTimeout(() => setSuccess(''), 3000);

            // Update user's unread count in the list
            setUsers(prev => prev.map(u =>
                u.id === selectedUser.id
                    ? { ...u, needsReviewCount: 0, unreadCount: 0 }
                    : u
            ));
        } catch (err: any) {
            setError(err.message || 'Failed to send reply');
        } finally {
            setSending(false);
        }
    };

    const handleMarkAsReviewed = async () => {
        if (!selectedUser) return;

        try {
            const res = await fetch(`/api/admin/chats/${selectedUser.id}`, {
                method: 'PATCH',
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to mark as reviewed');
            }

            setSuccess('Marked as reviewed!');
            setTimeout(() => setSuccess(''), 3000);

            // Update messages locally
            setMessages(prev => prev.map(m =>
                m.needsAdminReview ? { ...m, adminReplied: true } : m
            ));

            // Update user's unread count in the list
            setUsers(prev => prev.map(u =>
                u.id === selectedUser.id
                    ? { ...u, needsReviewCount: 0, unreadCount: 0 }
                    : u
            ));
        } catch (err: any) {
            setError(err.message || 'Failed to mark as reviewed');
        }
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        }
    };

    if (loading) return <LoadingSpinner />;

    // Chat Detail View
    if (selectedUser) {
        return (
            <div className="h-[calc(100vh-140px)] flex flex-col">
                {/* Header */}
                <div className="flex items-center gap-4 mb-4">
                    <button
                        onClick={handleBackToList}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ChevronLeft size={20} className="text-gray-600" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold overflow-hidden border border-indigo-200">
                            {selectedUser.photoUrl ? (
                                <img src={selectedUser.photoUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                                selectedUser.name.charAt(0)
                            )}
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-800">{selectedUser.name}</h2>
                            <p className="text-xs text-gray-500">{selectedUser.email}</p>
                        </div>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        {userDetails?.phone && (
                            <a
                                href={`tel:${userDetails.phone}`}
                                className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                title="Call"
                            >
                                <Phone size={18} />
                            </a>
                        )}
                        <a
                            href={`mailto:${selectedUser.email}`}
                            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Email"
                        >
                            <Mail size={18} />
                        </a>
                        {messages.some(m => m.needsAdminReview && !m.adminReplied) && (
                            <button
                                onClick={handleMarkAsReviewed}
                                className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Mark Reviewed
                            </button>
                        )}
                    </div>
                </div>

                {error && <div className="mb-3 p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>}
                {success && <div className="mb-3 p-3 rounded-lg bg-green-50 text-green-600 text-sm">{success}</div>}

                {/* Messages */}
                <div className="flex-1 bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <MessageCircle size={48} className="mb-3 opacity-30" />
                                <p>No messages yet</p>
                            </div>
                        ) : (
                            messages.map((msg, index) => {
                                const showDate = index === 0 ||
                                    formatDate(messages[index - 1].createdAt) !== formatDate(msg.createdAt);

                                return (
                                    <div key={msg.id}>
                                        {showDate && (
                                            <div className="flex justify-center my-4">
                                                <span className="text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                                                    {formatDate(msg.createdAt)}
                                                </span>
                                            </div>
                                        )}
                                        <div className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                                            <div className={`max-w-[75%] ${msg.sender === 'user' ? 'order-1' : 'order-2'}`}>
                                                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                                                    msg.sender === 'user'
                                                        ? 'bg-gray-100 text-gray-800 rounded-tl-sm'
                                                        : msg.sender === 'admin'
                                                            ? 'bg-indigo-600 text-white rounded-tr-sm'
                                                            : 'bg-purple-50 text-purple-900 border border-purple-100 rounded-tl-sm'
                                                }`}>
                                                    {msg.sender === 'bot' && (
                                                        <div className="flex items-center gap-1.5 mb-1.5 text-purple-600 font-medium text-xs">
                                                            <Bot size={12} />
                                                            <span>Bot</span>
                                                        </div>
                                                    )}
                                                    {msg.sender === 'admin' && (
                                                        <div className="flex items-center gap-1.5 mb-1.5 text-indigo-200 font-medium text-xs">
                                                            <Shield size={12} />
                                                            <span>Admin</span>
                                                        </div>
                                                    )}
                                                    <p>{msg.message}</p>
                                                    {msg.needsAdminReview && !msg.adminReplied && msg.sender === 'user' && (
                                                        <div className="mt-2 flex items-center gap-1.5 text-amber-600 text-xs font-medium">
                                                            <AlertCircle size={12} />
                                                            <span>Needs review</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className={`flex items-center gap-1 mt-1 text-xs text-gray-400 ${
                                                    msg.sender === 'user' ? 'justify-start' : 'justify-end'
                                                }`}>
                                                    <Clock size={10} />
                                                    <span>{formatTime(msg.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Reply Input */}
                    <div className="p-4 border-t border-gray-100 bg-gray-50">
                        <div className="flex items-end gap-3">
                            <textarea
                                ref={inputRef}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendReply();
                                    }
                                }}
                                placeholder="Type your reply... (Shift+Enter for new line)"
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none min-h-[50px] max-h-[150px] bg-white"
                                rows={1}
                                style={{ height: 'auto' }}
                                onInput={(e) => {
                                    const target = e.target as HTMLTextAreaElement;
                                    target.style.height = 'auto';
                                    target.style.height = Math.min(target.scrollHeight, 150) + 'px';
                                }}
                            />
                            <button
                                onClick={handleSendReply}
                                disabled={!replyText.trim() || sending}
                                className="px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                            >
                                {sending ? (
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Send size={18} />
                                )}
                                <span className="hidden sm:inline">Send</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // User List View
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Chat Management</h1>
                <div className="text-sm text-gray-500">
                    {users.filter(u => u.needsReviewCount > 0).length} conversations need attention
                </div>
            </div>

            {error && <div className="mb-4 p-4 rounded-lg bg-red-50 text-red-600">{error}</div>}
            {success && <div className="mb-4 p-4 rounded-lg bg-green-50 text-green-600">{success}</div>}

            {/* Search */}
            <div className="relative mb-6">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
            </div>

            {/* Users List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {filteredUsers.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        <MessageCircle size={48} className="mx-auto mb-3 opacity-30" />
                        <p className="text-lg font-medium mb-1">No chat conversations found</p>
                        <p className="text-sm">Users will appear here once they start chatting</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {filteredUsers.map((user) => (
                            <button
                                key={user.id}
                                onClick={() => handleSelectUser(user)}
                                className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left"
                            >
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold overflow-hidden border border-indigo-100">
                                        {user.photoUrl ? (
                                            <img src={user.photoUrl} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            user.name.charAt(0)
                                        )}
                                    </div>
                                    {user.needsReviewCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                            {user.needsReviewCount}
                                        </span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-gray-900 truncate">{user.name}</span>
                                        {!user.isActive && (
                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">Inactive</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                    {user.lastMessage && (
                                        <p className="text-sm text-gray-400 truncate mt-0.5">
                                            {user.lastMessage.sender === 'bot' && <Bot size={12} className="inline mr-1" />}
                                            {user.lastMessage.sender === 'admin' && <Shield size={12} className="inline mr-1" />}
                                            {user.lastMessage.message.substring(0, 60)}
                                            {user.lastMessage.message.length > 60 ? '...' : ''}
                                        </p>
                                    )}
                                </div>
                                <div className="text-right">
                                    {user.lastMessage && (
                                        <p className="text-xs text-gray-400 mb-1">
                                            {formatTime(user.lastMessage.createdAt)}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-end gap-2">
                                        {user.needsReviewCount > 0 && (
                                            <span className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 text-xs font-medium rounded-full">
                                                <AlertCircle size={12} />
                                                Needs Reply
                                            </span>
                                        )}
                                        {user.needsReviewCount === 0 && user.unreadCount === 0 && user.totalMessages > 0 && (
                                            <span className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-full">
                                                <CheckCircle size={12} />
                                                Replied
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
