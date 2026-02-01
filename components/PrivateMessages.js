import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { OTHER_USERS, MOCK_PMS } from '../constants';
const formatTime = (date) => date
    .toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
})
    .toLowerCase();
const formatDate = (date) => `${date.getMonth() + 1}/${date.getDate()}/${date
    .getFullYear()
    .toString()
    .slice(-2)}`;
export const PrivateMessages = ({ currentUser }) => {
    const [conversations] = useState(OTHER_USERS);
    const [selectedUserId, setSelectedUserId] = useState(conversations[0]?.id || null);
    const [messages, setMessages] = useState(MOCK_PMS);
    const [inputText, setInputText] = useState('');
    const scrollRef = useRef(null);
    useEffect(() => {
        if (scrollRef.current)
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, selectedUserId]);
    const selectedUser = conversations.find((u) => u.id === selectedUserId);
    const filteredMessages = messages
        .filter((m) => (m.senderId === currentUser.id &&
        m.receiverId === selectedUserId) ||
        (m.senderId === selectedUserId &&
            m.receiverId === currentUser.id))
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputText.trim() || !selectedUserId)
            return;
        const newMessage = {
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
    return (_jsxs("div", { className: 'flex h-[80vh] glass-panel rounded-3xl border border-cyan-500/10 overflow-hidden bg-slate-950/40 animate-in fade-in duration-700', children: [_jsxs("div", { className: 'w-80 border-r border-cyan-500/5 bg-slate-950/60 flex flex-col', children: [_jsx("div", { className: 'p-8 border-b border-cyan-500/5 bg-slate-950/40', children: _jsx("h2", { className: 'text-xl font-syne font-bold text-cyan-400 uppercase tracking-tighter', children: "Transmissions" }) }), _jsx("div", { className: 'flex-1 overflow-y-auto p-4 space-y-2.5 scrollbar-hide', children: conversations.map((user) => {
                            const unreadCount = messages.filter((m) => m.senderId === user.id &&
                                m.receiverId === currentUser.id &&
                                !m.isRead).length;
                            return (_jsxs("button", { onClick: () => setSelectedUserId(user.id), className: `w-full flex items-center p-4 rounded-2xl transition-all duration-300 border ${selectedUserId === user.id
                                    ? 'bg-cyan-500/10 border-cyan-500/20 shadow-[0_0_20px_rgba(0,210,255,0.05)]'
                                    : 'border-transparent hover:bg-slate-900/40'}`, children: [_jsx("div", { className: 'w-10 h-10 rounded-xl bg-slate-800 mr-4 overflow-hidden flex-shrink-0 border border-slate-700', children: _jsx("img", { src: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`, alt: user.username }) }), _jsxs("div", { className: 'flex-1 text-left min-w-0', children: [_jsxs("div", { className: 'flex justify-between items-center mb-0.5', children: [_jsxs("span", { className: 'text-sm font-bold text-slate-200 truncate font-space tracking-tight', children: ["@", user.username] }), unreadCount > 0 && (_jsx("span", { className: 'w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_8px_#06b6d4]' }))] }), _jsx("p", { className: 'text-[10px] text-slate-500 font-space uppercase tracking-widest truncate', children: user.title || 'OPERATIVE' })] })] }, user.id));
                        }) })] }), _jsx("div", { className: 'flex-1 flex flex-col min-w-0 bg-slate-950/20', children: selectedUser ? (_jsxs(_Fragment, { children: [_jsx("div", { className: 'p-6 border-b border-cyan-500/5 bg-slate-950/40 flex items-center justify-between', children: _jsxs("div", { className: 'flex items-center space-x-4', children: [_jsx("div", { className: 'w-10 h-10 rounded-xl bg-slate-800 overflow-hidden border border-slate-700', children: _jsx("img", { src: `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.username}`, alt: selectedUser.username }) }), _jsxs("div", { children: [_jsxs("h3", { className: 'text-base font-syne font-bold text-slate-200 uppercase', children: ["Secure Link: ", selectedUser.username] }), _jsxs("div", { className: 'flex items-center space-x-2', children: [_jsx("span", { className: 'w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse' }), _jsx("span", { className: 'text-[10px] font-space text-emerald-500 uppercase tracking-widest', children: "Active Connection" })] })] })] }) }), _jsx("div", { ref: scrollRef, className: 'flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide', children: filteredMessages.map((msg) => (_jsx("div", { className: `flex ${msg.senderId === currentUser.id
                                    ? 'justify-end'
                                    : 'justify-start'}`, children: _jsxs("div", { className: `max-w-[70%] space-y-1.5 ${msg.senderId === currentUser.id
                                        ? 'text-right'
                                        : 'text-left'}`, children: [_jsxs("div", { className: 'flex items-center space-x-2 mb-1 justify-inherit', children: [msg.senderId !==
                                                    currentUser.id && (_jsxs("span", { className: 'text-[10px] font-space text-cyan-400 font-bold uppercase tracking-wider', children: ["@", selectedUser.username] })), _jsx("span", { className: 'text-[9px] font-space text-slate-600 uppercase tracking-tighter', children: formatTime(msg.timestamp) })] }), _jsx("div", { className: `p-4 rounded-2xl border transition-all duration-300 ${msg.senderId === currentUser.id
                                                ? 'bg-cyan-500/5 border-cyan-500/20 text-slate-200'
                                                : 'bg-slate-900 border-slate-800 text-slate-300'}`, children: _jsx("p", { className: 'text-sm font-light leading-relaxed', children: msg.content }) })] }) }, msg.id))) }), _jsx("div", { className: 'p-8 border-t border-cyan-500/5 bg-slate-950/60', children: _jsxs("form", { onSubmit: handleSendMessage, className: 'relative', children: [_jsx("input", { value: inputText, onChange: (e) => setInputText(e.target.value), placeholder: 'ENCRYPTED TRANSMISSION...', className: 'w-full bg-slate-900/40 border border-slate-800 rounded-2xl px-8 py-5 text-sm focus:outline-none focus:border-cyan-500/30 transition-all text-slate-200 placeholder:text-slate-700 font-light' }), _jsx("button", { type: 'submit', className: 'absolute right-6 top-1/2 -translate-y-1/2 text-cyan-500 font-space text-[11px] font-bold tracking-widest hover:text-cyan-400 uppercase', children: "SEND" })] }) })] })) : (_jsxs("div", { className: 'flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-30', children: [_jsx("div", { className: 'w-16 h-16 rounded-3xl border-2 border-dashed border-slate-800 flex items-center justify-center', children: _jsx("span", { className: 'text-slate-600 text-2xl', children: "?" }) }), _jsxs("div", { children: [_jsx("p", { className: 'text-xs font-space text-slate-500 uppercase tracking-[0.3em]', children: "Select an operative to begin" }), _jsx("p", { className: 'text-[10px] font-space text-slate-700 uppercase mt-1 tracking-widest', children: "Secure terminal standby" })] })] })) })] }));
};
