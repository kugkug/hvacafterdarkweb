import React, { useState, useEffect, useRef } from 'react';
import { User, PrivateMessage } from '../types';
import { OTHER_USERS, MOCK_PMS } from '../constants';

interface PrivateMessagesProps {
    currentUser: User;
}

const formatTime = (date: Date) =>
    date
        .toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })
        .toLowerCase();
const formatDate = (date: Date) =>
    `${date.getMonth() + 1}/${date.getDate()}/${date
        .getFullYear()
        .toString()
        .slice(-2)}`;

export const PrivateMessages: React.FC<PrivateMessagesProps> = ({
    currentUser
}) => {
    const [conversations] = useState<User[]>(OTHER_USERS);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(
        conversations[0]?.id || null
    );
    const [messages, setMessages] = useState<PrivateMessage[]>(MOCK_PMS);
    const [inputText, setInputText] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current)
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, selectedUserId]);

    const selectedUser = conversations.find((u) => u.id === selectedUserId);
    const filteredMessages = messages
        .filter(
            (m) =>
                (m.senderId === currentUser.id &&
                    m.receiverId === selectedUserId) ||
                (m.senderId === selectedUserId &&
                    m.receiverId === currentUser.id)
        )
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || !selectedUserId) return;

        const newMessage: PrivateMessage = {
            id: Date.now().toString(),
            senderId: currentUser.id,
            receiverId: selectedUserId,
            content: inputText,
            timestamp: new Date(),
            isRead: false
        };

        setMessages([...messages, newMessage]);
        setInputText('');
    };

    return (
        <div className='flex h-[80vh] glass-panel rounded-3xl border border-cyan-500/10 overflow-hidden bg-slate-950/40 animate-in fade-in duration-700'>
            {/* Conversation List */}
            <div className='w-80 border-r border-cyan-500/5 bg-slate-950/60 flex flex-col'>
                <div className='p-8 border-b border-cyan-500/5 bg-slate-950/40'>
                    <h2 className='text-xl font-syne font-bold text-cyan-400 uppercase tracking-tighter'>
                        Transmissions
                    </h2>
                </div>
                <div className='flex-1 overflow-y-auto p-4 space-y-2.5 scrollbar-hide'>
                    {conversations.map((user) => {
                        const unreadCount = messages.filter(
                            (m) =>
                                m.senderId === user.id &&
                                m.receiverId === currentUser.id &&
                                !m.isRead
                        ).length;

                        return (
                            <button
                                key={user.id}
                                onClick={() => setSelectedUserId(user.id)}
                                className={`w-full flex items-center p-4 rounded-2xl transition-all duration-300 border ${
                                    selectedUserId === user.id
                                        ? 'bg-cyan-500/10 border-cyan-500/20 shadow-[0_0_20px_rgba(0,210,255,0.05)]'
                                        : 'border-transparent hover:bg-slate-900/40'
                                }`}
                            >
                                <div className='w-10 h-10 rounded-xl bg-slate-800 mr-4 overflow-hidden flex-shrink-0 border border-slate-700'>
                                    <img
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                                        alt={user.username}
                                    />
                                </div>
                                <div className='flex-1 text-left min-w-0'>
                                    <div className='flex justify-between items-center mb-0.5'>
                                        <span className='text-sm font-bold text-slate-200 truncate font-space tracking-tight'>
                                            @{user.username}
                                        </span>
                                        {unreadCount > 0 && (
                                            <span className='w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_8px_#06b6d4]'></span>
                                        )}
                                    </div>
                                    <p className='text-[10px] text-slate-500 font-space uppercase tracking-widest truncate'>
                                        {user.title || 'OPERATIVE'}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Chat Area */}
            <div className='flex-1 flex flex-col min-w-0 bg-slate-950/20'>
                {selectedUser ? (
                    <>
                        <div className='p-6 border-b border-cyan-500/5 bg-slate-950/40 flex items-center justify-between'>
                            <div className='flex items-center space-x-4'>
                                <div className='w-10 h-10 rounded-xl bg-slate-800 overflow-hidden border border-slate-700'>
                                    <img
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.username}`}
                                        alt={selectedUser.username}
                                    />
                                </div>
                                <div>
                                    <h3 className='text-base font-syne font-bold text-slate-200 uppercase'>
                                        Secure Link: {selectedUser.username}
                                    </h3>
                                    <div className='flex items-center space-x-2'>
                                        <span className='w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse'></span>
                                        <span className='text-[10px] font-space text-emerald-500 uppercase tracking-widest'>
                                            Active Connection
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            ref={scrollRef}
                            className='flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide'
                        >
                            {filteredMessages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${
                                        msg.senderId === currentUser.id
                                            ? 'justify-end'
                                            : 'justify-start'
                                    }`}
                                >
                                    <div
                                        className={`max-w-[70%] space-y-1.5 ${
                                            msg.senderId === currentUser.id
                                                ? 'text-right'
                                                : 'text-left'
                                        }`}
                                    >
                                        <div className='flex items-center space-x-2 mb-1 justify-inherit'>
                                            {msg.senderId !==
                                                currentUser.id && (
                                                <span className='text-[10px] font-space text-cyan-400 font-bold uppercase tracking-wider'>
                                                    @{selectedUser.username}
                                                </span>
                                            )}
                                            <span className='text-[9px] font-space text-slate-600 uppercase tracking-tighter'>
                                                {formatTime(msg.timestamp)}
                                            </span>
                                        </div>
                                        <div
                                            className={`p-4 rounded-2xl border transition-all duration-300 ${
                                                msg.senderId === currentUser.id
                                                    ? 'bg-cyan-500/5 border-cyan-500/20 text-slate-200'
                                                    : 'bg-slate-900 border-slate-800 text-slate-300'
                                            }`}
                                        >
                                            <p className='text-sm font-light leading-relaxed'>
                                                {msg.content}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className='p-8 border-t border-cyan-500/5 bg-slate-950/60'>
                            <form
                                onSubmit={handleSendMessage}
                                className='relative'
                            >
                                <input
                                    value={inputText}
                                    onChange={(e) =>
                                        setInputText(e.target.value)
                                    }
                                    placeholder='ENCRYPTED TRANSMISSION...'
                                    className='w-full bg-slate-900/40 border border-slate-800 rounded-2xl px-8 py-5 text-sm focus:outline-none focus:border-cyan-500/30 transition-all text-slate-200 placeholder:text-slate-700 font-light'
                                />
                                <button
                                    type='submit'
                                    className='absolute right-6 top-1/2 -translate-y-1/2 text-cyan-500 font-space text-[11px] font-bold tracking-widest hover:text-cyan-400 uppercase'
                                >
                                    SEND
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className='flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-30'>
                        <div className='w-16 h-16 rounded-3xl border-2 border-dashed border-slate-800 flex items-center justify-center'>
                            <span className='text-slate-600 text-2xl'>?</span>
                        </div>
                        <div>
                            <p className='text-xs font-space text-slate-500 uppercase tracking-[0.3em]'>
                                Select an operative to begin
                            </p>
                            <p className='text-[10px] font-space text-slate-700 uppercase mt-1 tracking-widest'>
                                Secure terminal standby
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
