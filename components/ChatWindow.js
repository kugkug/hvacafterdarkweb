import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { MOCK_CATEGORIES, MOCK_ROOMS, OTHER_USERS } from '../constants';
import { checkContentSafety } from '../services/geminiService';
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
const getSeniorityRank = (count) => {
    if (count >= 500)
        return {
            title: 'Master Specialist',
            color: 'text-purple-400',
            border: 'border-purple-500/50'
        };
    if (count >= 150)
        return {
            title: 'Senior Technician',
            color: 'text-cyan-400',
            border: 'border-cyan-500/50'
        };
    if (count >= 50)
        return {
            title: 'Journeyman',
            color: 'text-emerald-400',
            border: 'border-emerald-500/50'
        };
    return {
        title: 'Apprentice',
        color: 'text-slate-400',
        border: 'border-slate-500/50'
    };
};
export const ChatWindow = ({ user, onModAction }) => {
    const [activeRoomId, setActiveRoomId] = useState(MOCK_ROOMS[0].id);
    const [rooms, setRooms] = useState(MOCK_ROOMS);
    const [categories, setCategories] = useState(MOCK_CATEGORIES);
    const [messages, setMessages] = useState([
        {
            id: 'm1',
            userId: 'u2',
            username: 'CompressorKing',
            content: 'Is it just me or are the new TXVs failing more often?',
            timestamp: new Date(Date.now() - 3600000),
            isEdited: false,
            isDeleted: false,
            history: [],
            thumbsUps: ['u3', 'u1']
        },
        {
            id: 'm2',
            userId: 'u3',
            username: 'VoltageViking',
            content: 'Check the superheat. Usually, it is a flow issue, not the valve itself.',
            timestamp: new Date(Date.now() - 1800000),
            isEdited: false,
            isDeleted: false,
            history: [],
            thumbsUps: ['u1']
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [replyTo, setReplyTo] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [isCheckingSafety, setIsCheckingSafety] = useState(false);
    const scrollRef = useRef(null);
    const activeRoom = rooms.find((r) => r.id === activeRoomId);
    useEffect(() => {
        if (scrollRef.current)
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, activeRoomId]);
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputText.trim() || isCheckingSafety)
            return;
        setIsCheckingSafety(true);
        const safety = await checkContentSafety(inputText);
        setIsCheckingSafety(false);
        if (!safety.safe) {
            alert(`Safety Override: ${safety.reason}`);
            return;
        }
        if (editingMessageId) {
            const msgToEdit = messages.find((m) => m.id === editingMessageId);
            if (msgToEdit && msgToEdit.userId !== user.id && onModAction) {
                onModAction('MESSAGE_EDIT', msgToEdit.id, `Message by ${msgToEdit.username}`, `Content changed`);
            }
            setMessages((prev) => prev.map((m) => {
                if (m.id === editingMessageId) {
                    const newHistory = [
                        ...(m.history || []),
                        { content: m.content, editedAt: new Date() }
                    ];
                    return {
                        ...m,
                        content: inputText,
                        isEdited: true,
                        editedAt: new Date(),
                        history: newHistory
                    };
                }
                return m;
            }));
            setEditingMessageId(null);
        }
        else {
            const newMessage = {
                id: Date.now().toString(),
                userId: user.id,
                username: user.username,
                content: inputText,
                timestamp: new Date(),
                isEdited: false,
                isDeleted: false,
                replyToId: replyTo?.id,
                history: [],
                thumbsUps: []
            };
            setMessages([...messages, newMessage]);
        }
        setInputText('');
        setReplyTo(null);
    };
    const canModify = (msg) => {
        if (user.role === 'ADMIN' || user.role === 'MODERATOR')
            return true;
        if (msg.userId !== user.id)
            return false;
        const minutesSince = (Date.now() - new Date(msg.timestamp).getTime()) / 60000;
        return minutesSince <= 15;
    };
    const handleThumbUp = (msgId) => {
        setMessages((prev) => prev.map((m) => {
            if (m.id === msgId &&
                !m.thumbsUps.includes(user.id) &&
                m.userId !== user.id) {
                return { ...m, thumbsUps: [...m.thumbsUps, user.id] };
            }
            return m;
        }));
    };
    const handlePurgeMessage = (msg) => {
        setMessages(messages.map((m) => m.id === msg.id ? { ...m, isDeleted: true } : m));
        if (onModAction) {
            onModAction('MESSAGE_DELETE', msg.id, `Message by ${msg.username}`, `Purged`);
        }
    };
    const handleRequestRoom = () => {
        const name = prompt('Enter Frequency Name:');
        if (!name)
            return;
        const newRoom = {
            id: Date.now().toString(),
            categoryId: categories[0].id,
            name,
            description: 'Member Node',
            isPending: user.role !== 'TRUSTED' &&
                user.role !== 'ADMIN' &&
                user.role !== 'MODERATOR',
            createdBy: user.id
        };
        setRooms([...rooms, newRoom]);
        if (newRoom.isPending)
            alert('Frequency request transmitted to ADMIN.');
    };
    const getAuthorStats = (authorId) => {
        if (authorId === user.id)
            return user;
        return (OTHER_USERS.find((u) => u.id === authorId) || { thumbsUpCount: 0 });
    };
    const filteredCategories = categories.filter((c) => !c.isPending || user.role === 'ADMIN' || user.role === 'MODERATOR');
    return (_jsxs("div", { className: 'flex h-[82vh] glass-panel rounded-3xl border border-white/5 shadow-2xl bg-slate-950/40 overflow-hidden', children: [_jsxs("div", { className: 'flex-1 flex flex-col min-w-0', children: [_jsxs("div", { className: 'p-5 border-b border-white/5 bg-slate-950/60 flex justify-between items-center', children: [_jsxs("div", { children: [_jsxs("h2", { className: 'text-base font-syne font-bold text-slate-100 uppercase tracking-tighter', children: ["# ", activeRoom?.name] }), _jsx("p", { className: 'text-[9px] text-slate-600 font-space uppercase tracking-[0.2em] mt-0.5', children: activeRoom?.description })] }), _jsx("div", { className: 'flex items-center space-x-4', children: (user.role === 'ADMIN' ||
                                    user.role === 'MODERATOR') && (_jsx("span", { className: 'text-[8px] text-amber-500/80 font-space uppercase tracking-[0.2em] bg-amber-500/5 px-3 py-1 rounded border border-amber-500/20', children: "MOD OVERRIDE" })) })] }), _jsx("div", { ref: scrollRef, className: 'flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide', children: messages.map((msg) => {
                            const author = getAuthorStats(msg.userId);
                            const rank = getSeniorityRank(author.thumbsUpCount || 0);
                            return (_jsxs("div", { className: 'group relative animate-in fade-in duration-500', children: [_jsxs("div", { className: 'flex items-center space-x-3 mb-1', children: [_jsxs("span", { className: 'font-bold text-xs text-cyan-400', children: ["@", msg.username] }), _jsx("span", { className: `text-[8px] px-2 py-0.5 rounded border ${rank.border} ${rank.color} font-space uppercase tracking-wider bg-slate-950/80`, children: rank.title }), _jsxs("span", { className: 'text-[9px] text-slate-700 uppercase font-space tracking-tight', children: [formatTime(msg.timestamp), " \u00B7", ' ', formatDate(msg.timestamp)] }), msg.isEdited && (_jsx("span", { className: 'text-[8px] text-slate-700 italic font-space', children: "(edited)" }))] }), _jsx("div", { className: `p-4 rounded-2xl border transition-all duration-300 ${msg.userId === user.id
                                            ? 'bg-cyan-500/5 border-cyan-500/10'
                                            : 'bg-slate-900/60 border-white/5'} max-w-[80%] relative`, children: msg.isDeleted ? (_jsx("p", { className: 'text-slate-700 italic text-xs font-light', children: "Content purged by system protocol." })) : (_jsx("p", { className: 'text-slate-300 text-[14px] leading-relaxed font-light', children: msg.content })) }), !msg.isDeleted && (_jsxs("div", { className: 'flex items-center mt-2 space-x-4 opacity-0 group-hover:opacity-100 transition-all', children: [_jsx("button", { onClick: () => setReplyTo(msg), className: 'text-[9px] text-slate-600 hover:text-cyan-400 uppercase font-space tracking-widest font-bold', children: "REPLY" }), _jsxs("button", { onClick: () => handleThumbUp(msg.id), className: `text-[9px] uppercase font-space tracking-widest flex items-center space-x-1 ${msg.thumbsUps.includes(user.id)
                                                    ? 'text-cyan-400'
                                                    : 'text-slate-600 hover:text-emerald-400'}`, children: [_jsx("span", { className: 'font-bold', children: "HELPFUL" }), _jsxs("span", { className: 'text-emerald-500 font-bold opacity-80', children: ["\uD83D\uDC4D ", msg.thumbsUps.length || ''] })] }), canModify(msg) && (_jsx("button", { onClick: () => {
                                                    setInputText(msg.content);
                                                    setEditingMessageId(msg.id);
                                                }, className: 'text-[9px] text-amber-500/60 hover:text-amber-500 uppercase font-space tracking-widest font-bold', children: "EDIT" })), (user.role === 'ADMIN' ||
                                                user.role === 'MODERATOR') && (_jsx("button", { onClick: () => handlePurgeMessage(msg), className: 'text-[9px] text-red-500/60 hover:text-red-500 uppercase font-space tracking-widest font-bold', children: "PURGE" }))] }))] }, msg.id));
                        }) }), _jsxs("div", { className: 'p-6 border-t border-white/5 bg-slate-950/80', children: [replyTo && (_jsxs("div", { className: 'flex items-center justify-between mb-3 p-2 bg-slate-900 rounded-lg border border-white/5', children: [_jsxs("span", { className: 'text-[10px] text-slate-600', children: ["Replying to", ' ', _jsxs("span", { className: 'text-cyan-600 font-bold', children: ["@", replyTo.username] })] }), _jsx("button", { onClick: () => setReplyTo(null), className: 'text-slate-700 hover:text-white transition-colors text-xs', children: "\u2715" })] })), _jsxs("form", { onSubmit: handleSendMessage, className: 'relative', children: [_jsx("input", { value: inputText, onChange: (e) => setInputText(e.target.value), placeholder: isCheckingSafety
                                            ? 'ANALYZING UPLINK...'
                                            : 'TRANSMIT TRANSMISSION...', disabled: isCheckingSafety, className: 'w-full bg-slate-900/40 border border-white/5 rounded-xl px-6 py-4 text-xs focus:outline-none focus:border-cyan-500/20 transition-all text-slate-200 placeholder:text-slate-800 font-light' }), _jsx("button", { type: 'submit', className: 'absolute right-6 top-1/2 -translate-y-1/2 text-cyan-700 font-space text-[10px] font-bold tracking-widest hover:text-cyan-500 uppercase', children: "SEND" })] })] })] }), _jsxs("div", { className: 'w-64 border-l border-white/5 bg-slate-950/60 flex flex-col', children: [_jsx("div", { className: 'p-6', children: _jsx("input", { type: 'text', placeholder: 'SEARCH NODES...', value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: 'w-full bg-slate-900/50 border border-white/5 rounded-lg py-3 px-4 text-[9px] font-space tracking-widest focus:outline-none focus:border-cyan-500/20 transition-all uppercase placeholder:text-slate-800' }) }), _jsx("div", { className: 'flex-1 overflow-y-auto px-6 space-y-6 scrollbar-hide pb-6', children: filteredCategories.map((cat) => (_jsxs("div", { className: 'space-y-2', children: [_jsx("h4", { className: 'text-[9px] font-space text-slate-700 uppercase tracking-[0.3em] font-bold', children: cat.name }), _jsx("div", { className: 'space-y-1', children: rooms
                                        .filter((r) => r.categoryId === cat.id &&
                                        (!r.isPending ||
                                            user.role === 'ADMIN'))
                                        .map((r) => (_jsx("button", { onClick: () => setActiveRoomId(r.id), className: `w-full text-left py-2 px-3 rounded-lg text-[11px] transition-all duration-300 flex items-center justify-between ${activeRoomId === r.id
                                            ? 'bg-cyan-500/5 text-cyan-400 border border-cyan-500/10'
                                            : 'text-slate-600 hover:text-slate-400'}`, children: _jsxs("span", { children: ["# ", r.name] }) }, r.id))) })] }, cat.id))) }), _jsx("div", { className: 'p-6 border-t border-white/5 bg-slate-950/60', children: _jsx("button", { onClick: handleRequestRoom, className: 'w-full py-4 bg-slate-900/40 border border-white/5 rounded-xl text-[9px] font-space font-bold text-slate-700 hover:text-cyan-500 transition-all uppercase tracking-[0.2em]', children: "+ NEW NODE" }) })] })] }));
};
