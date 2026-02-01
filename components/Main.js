import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import NeonButton from './NeonButton';
import { ChatWindow } from './ChatWindow';
import { PrivateMessages } from './PrivateMessages';
import { ModLog } from './ModLog';
import { MOCK_FINDS, MOCK_MOD_LOGS } from '../constants';
import { Footer } from './Footer';
import { useAuth } from '../utilities/auth';
const Main = ({ currentUser, view, setView, setShowAuth, memes, setMemes, handleUpload }) => {
    const auth = useAuth();
    const [modLogs, setModLogs] = useState(MOCK_MOD_LOGS);
    const [uploading, setUploading] = useState(false);
    const [finds, setFinds] = useState(MOCK_FINDS.map((f) => ({ ...f, isApproved: true })));
    const addModLog = (action, targetId, targetName, details) => {
        if (!currentUser)
            return;
        const newLog = {
            id: Date.now().toString(),
            timestamp: new Date(),
            moderatorId: currentUser.id,
            moderatorUsername: currentUser.username,
            action,
            targetId,
            targetName,
            details
        };
        setModLogs((prev) => [...prev, newLog]);
    };
    const getSeniorityRank = (count) => {
        if (count >= 500)
            return {
                title: 'Master Specialist',
                color: 'text-purple-400',
                border: 'border-purple-500/30',
                bg: 'bg-purple-500/5',
                glow: 'shadow-[0_0_15px_rgba(168,85,247,0.3)]'
            };
        if (count >= 150)
            return {
                title: 'Senior Technician',
                color: 'text-cyan-400',
                border: 'border-cyan-500/30',
                bg: 'bg-cyan-500/5',
                glow: 'shadow-[0_0_15px_rgba(6,182,212,0.3)]'
            };
        if (count >= 50)
            return {
                title: 'Journeyman',
                color: 'text-emerald-400',
                border: 'border-emerald-500/30',
                bg: 'bg-emerald-500/5',
                glow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]'
            };
        return {
            title: 'Apprentice',
            color: 'text-slate-400',
            border: 'border-slate-500/30',
            bg: 'bg-slate-500/5',
            glow: ''
        };
    };
    const handleLogout = () => {
        setView('HOME');
    };
    return (_jsxs("main", { className: 'relative z-10 max-w-[1400px] mx-auto p-6 md:p-12', children: [view === 'HOME' && (_jsxs("div", { className: 'space-y-40', children: [_jsxs("div", { className: 'text-center py-20 space-y-10 animate-in fade-in slide-in-from-bottom-12 duration-1000', children: [_jsx("div", { className: 'flex justify-center', children: _jsx("div", { className: 'px-5 py-1.5 bg-slate-900/60 border border-cyan-500/10 rounded-full text-[10px] font-space text-cyan-500 tracking-[0.6em] uppercase font-bold backdrop-blur-md', children: "Secure Operational Node" }) }), _jsxs("h2", { className: 'text-4xl md:text-6xl font-syne font-extrabold leading-[1.2] tracking-tighter uppercase', children: ["SHIFT ENDS.", _jsx("br", {}), _jsx("span", { className: 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 animate-gradient-x neon-text-blue', children: "DARK TERMINAL OPEN." })] }), _jsx("p", { className: 'text-slate-500 max-w-lg mx-auto italic text-lg font-light leading-relaxed', children: "The exclusive midnight lounge for the HVAC elite. Field findings, technician humor, and unmoderated shop talk." }), _jsxs("div", { className: 'flex flex-col sm:flex-row justify-center gap-6 pt-8', children: [_jsx(NeonButton, { onClick: () => currentUser
                                            ? setView('CHAT')
                                            : setShowAuth(true), className: 'px-12 py-5 text-sm shadow-[0_0_30px_rgba(0,210,255,0.1)]', children: "ENTER CHAT" }), !auth.user && (_jsx("button", { onClick: () => setShowAuth(true), className: 'px-12 py-5 text-sm font-space font-bold border border-slate-900 rounded-lg hover:border-slate-700 transition-all text-slate-600 hover:text-slate-200 uppercase tracking-widest bg-slate-950/40', children: "SIGN IN" }))] })] }), _jsxs("div", { className: 'grid grid-cols-1 lg:grid-cols-2 gap-24', children: [_jsxs("section", { className: 'space-y-10', children: [_jsxs("div", { className: 'flex justify-between items-end border-b border-white/5 pb-6', children: [_jsxs("div", { children: [_jsx("h3", { className: 'text-xl font-syne font-bold text-slate-100 uppercase tracking-tighter', children: "Meme Stream" }), _jsx("p", { className: 'text-[9px] text-slate-600 font-space uppercase tracking-[0.4em] mt-1.5 font-bold', children: "Technician Satire" })] }), _jsx("button", { onClick: () => currentUser
                                                    ? setView('MEMES')
                                                    : setShowAuth(true), className: 'text-[10px] font-space font-bold text-cyan-600 hover:text-cyan-400 transition-all uppercase tracking-[0.25em]', children: "VIEW ALL" })] }), _jsx("div", { className: 'grid grid-cols-3 gap-6', children: memes.slice(0, 3).map((m) => (_jsxs("div", { className: 'group relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/5 hover:border-cyan-500/20 transition-all duration-1000 bg-slate-950/50', children: [_jsx("img", { src: m.imageUrl, alt: m.caption, className: 'w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 opacity-40 group-hover:opacity-100' }), !currentUser && (_jsx("div", { className: 'absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-4', children: _jsx("span", { className: 'text-[8px] font-space font-bold text-slate-600 tracking-[0.4em] uppercase', children: "ENCRYPTED" }) }))] }, m.id))) })] }), _jsxs("section", { className: 'space-y-10', children: [_jsxs("div", { className: 'flex justify-between items-end border-b border-white/5 pb-6', children: [_jsxs("div", { children: [_jsx("h3", { className: 'text-xl font-syne font-bold text-slate-100 uppercase tracking-tighter', children: "Field Artifacts" }), _jsx("p", { className: 'text-[9px] text-slate-600 font-space uppercase tracking-[0.4em] mt-1.5 font-bold', children: "Trade Madness" })] }), _jsx("button", { onClick: () => currentUser
                                                    ? setView('FINDS')
                                                    : setShowAuth(true), className: 'text-[10px] font-space font-bold text-purple-600 hover:text-purple-400 transition-all uppercase tracking-[0.25em]', children: "FILES \u2192" })] }), _jsx("div", { className: 'grid grid-cols-3 gap-6', children: finds.slice(0, 3).map((f) => (_jsxs("div", { className: 'group relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/5 hover:border-purple-500/20 transition-all duration-1000 bg-slate-950/50', children: [_jsx("img", { src: f.imageUrl, alt: f.caption, className: 'w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 opacity-40 group-hover:opacity-100' }), !currentUser && (_jsx("div", { className: 'absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-4', children: _jsx("span", { className: 'text-[8px] font-space font-bold text-slate-600 tracking-[0.4em] uppercase', children: "LOCKED" }) }))] }, f.id))) })] })] }), _jsx(Footer, {})] })), view === 'CHAT' && currentUser && (_jsx(ChatWindow, { user: currentUser, onModAction: addModLog })), view === 'MESSAGES' && currentUser && (_jsx(PrivateMessages, { currentUser: currentUser })), view === 'MOD_LOGS' && currentUser && _jsx(ModLog, { logs: modLogs }), (view === 'MEMES' || view === 'FINDS') && currentUser && (_jsxs("div", { className: 'space-y-12 animate-in fade-in duration-700', children: [_jsxs("div", { className: 'flex justify-between items-center border-b border-white/5 pb-8', children: [_jsxs("div", { className: 'space-y-1', children: [_jsx("h2", { className: 'text-3xl font-syne font-bold text-slate-100 tracking-tighter uppercase', children: view === 'MEMES'
                                            ? 'The Meme Lab'
                                            : 'Mechanical Finds' }), _jsx("p", { className: 'text-[9px] font-space text-slate-600 uppercase tracking-[0.4em] font-bold', children: view === 'MEMES'
                                            ? 'Systematic Humor Transmissions'
                                            : 'Evidence of Installation Madness' })] }), _jsxs("label", { className: `cursor-pointer ${view === 'MEMES'
                                    ? 'bg-cyan-600 hover:bg-cyan-500'
                                    : 'bg-purple-600 hover:bg-purple-500'} px-6 py-3 rounded-xl font-space font-bold text-[10px] transition-all shadow-xl uppercase tracking-widest text-white`, children: [uploading ? 'UPLOADING...' : `SUBMIT DATA`, _jsx("input", { type: 'file', hidden: true, accept: 'image/*', onChange: (e) => handleUpload(e, view === 'MEMES' ? 'MEME' : 'FIND'), disabled: uploading })] })] }), _jsx("div", { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10', children: (view === 'MEMES' ? memes : finds)
                            .filter((p) => p.isApproved || currentUser.role === 'ADMIN')
                            .map((p) => (_jsxs("div", { className: `glass-panel p-4 rounded-[2rem] border-white/5 group overflow-hidden relative transition-all duration-700 hover:border-${view === 'MEMES' ? 'cyan' : 'purple'}-500/20`, children: [_jsx("img", { src: p.imageUrl, className: 'w-full h-64 object-cover rounded-2xl mb-4 group-hover:scale-105 transition-transform duration-1000 opacity-60 group-hover:opacity-100' }), !p.isApproved && (_jsx("div", { className: 'absolute top-8 left-8 bg-amber-500 text-black text-[9px] px-3 py-1 rounded-full font-space font-bold uppercase tracking-widest', children: "Awaiting MOD" })), _jsxs("p", { className: 'text-sm text-slate-400 mb-4 px-2 italic font-light', children: ["\"", p.caption, "\""] }), _jsxs("div", { className: 'flex justify-between items-center text-[9px] font-space font-bold text-slate-600 px-2 uppercase tracking-widest pt-3 border-t border-white/5', children: [_jsxs("span", { className: 'hover:text-cyan-400 transition-colors cursor-pointer', children: ["@", p.username] }), _jsxs("span", { className: 'text-emerald-500/80', children: ["\uD83D\uDC4D ", p.likes] })] })] }, p.id))) })] })), view === 'MOD' &&
                currentUser &&
                (currentUser.role === 'ADMIN' ||
                    currentUser.role === 'MODERATOR') && (_jsxs("div", { className: 'space-y-12 animate-in slide-in-from-top-6 duration-700', children: [_jsxs("div", { className: 'flex justify-between items-end border-b border-amber-500/10 pb-6', children: [_jsxs("div", { className: 'space-y-1', children: [_jsx("h2", { className: 'text-2xl font-syne font-bold text-amber-500 uppercase tracking-tighter', children: "Admin Terminal" }), _jsx("p", { className: 'text-[9px] font-space text-slate-600 uppercase tracking-[0.3em] font-bold', children: "Node Integrity Control" })] }), _jsx("button", { onClick: () => setView('MOD_LOGS'), className: 'text-[10px] font-space font-bold text-slate-600 hover:text-amber-400 uppercase tracking-widest bg-amber-500/5 border border-amber-500/10 px-5 py-2.5 rounded transition-all', children: "System Logs" })] }), _jsx("div", { className: 'grid grid-cols-1 md:grid-cols-2 gap-12', children: _jsxs("div", { className: 'glass-panel p-8 rounded-[2rem] border-amber-500/10', children: [_jsx("h3", { className: 'font-space font-bold text-[10px] text-slate-500 uppercase mb-6 tracking-[0.3em] border-b border-white/5 pb-4', children: "Awaiting Verification" }), _jsx("div", { className: 'space-y-4', children: [...memes, ...finds]
                                        .filter((m) => !m.isApproved)
                                        .map((m) => (_jsxs("div", { className: 'flex items-center justify-between p-4 bg-slate-900/20 rounded-2xl border border-white/5', children: [_jsxs("div", { className: 'flex items-center space-x-4', children: [_jsx("img", { src: m.imageUrl, className: 'w-12 h-12 rounded object-cover' }), _jsxs("div", { className: 'flex flex-col', children: [_jsxs("span", { className: 'text-xs text-slate-300 font-bold', children: ["@", m.username] }), _jsx("span", { className: 'text-[9px] text-slate-600 uppercase font-space font-bold', children: m.type })] })] }), _jsxs("div", { className: 'flex space-x-3', children: [_jsx("button", { onClick: () => {
                                                            if (m.type ===
                                                                'MEME')
                                                                setMemes(memes.map((x) => x.id ===
                                                                    m.id
                                                                    ? {
                                                                        ...x,
                                                                        isApproved: true
                                                                    }
                                                                    : x));
                                                            else
                                                                setFinds(finds.map((x) => x.id ===
                                                                    m.id
                                                                    ? {
                                                                        ...x,
                                                                        isApproved: true
                                                                    }
                                                                    : x));
                                                            addModLog('POST_APPROVE', m.id, `${m.type} by ${m.username}`, 'Manual approval');
                                                        }, className: 'text-[10px] text-emerald-500 font-bold font-space uppercase', children: "ACCEPT" }), _jsx("button", { onClick: () => {
                                                            if (m.type ===
                                                                'MEME')
                                                                setMemes(memes.filter((x) => x.id !==
                                                                    m.id));
                                                            else
                                                                setFinds(finds.filter((x) => x.id !==
                                                                    m.id));
                                                            addModLog('POST_REJECT', m.id, `${m.type} by ${m.username}`, 'Purged');
                                                        }, className: 'text-[10px] text-red-500 font-bold font-space uppercase', children: "PURGE" })] })] }, m.id))) })] }) })] })), view === 'PROFILE' && currentUser && (_jsx("div", { className: 'max-w-xl mx-auto py-12 animate-in zoom-in-95 duration-700', children: _jsx("div", { className: 'glass-panel p-10 rounded-[2.5rem] border-white/5 relative overflow-hidden', children: _jsxs("div", { className: 'flex flex-col items-center space-y-8', children: [_jsxs("div", { className: 'relative', children: [_jsx("div", { className: 'w-28 h-28 rounded-2xl bg-slate-950 border border-cyan-500/20 p-1', children: _jsx("img", { src: `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.username}`, className: 'w-full h-full object-cover rounded-xl' }) }), _jsx("div", { className: 'absolute -bottom-2 -right-2 bg-slate-950 border border-cyan-500/30 px-4 py-1 rounded-full shadow-2xl', children: _jsx("span", { className: 'text-[10px] font-space text-cyan-400 font-bold tracking-[0.25em] uppercase', children: currentUser.role }) })] }), _jsxs("div", { className: 'text-center space-y-1.5', children: [_jsx("h2", { className: 'text-3xl font-syne font-extrabold text-slate-100 uppercase tracking-tighter', children: currentUser.username }), _jsx("p", { className: 'text-purple-500 font-space font-bold text-[9px] tracking-[0.5em] uppercase', children: currentUser.title || 'OPERATIVE' })] }), _jsxs("div", { className: 'w-full space-y-5', children: [_jsxs("div", { className: `p-6 rounded-[1.5rem] border ${getSeniorityRank(currentUser.thumbsUpCount).border} ${getSeniorityRank(currentUser.thumbsUpCount).bg} flex items-center justify-between`, children: [_jsxs("div", { className: 'space-y-1', children: [_jsx("p", { className: 'text-[10px] text-slate-600 font-space font-bold uppercase tracking-[0.4em]', children: "Rank" }), _jsx("h3", { className: `text-lg font-bold font-syne ${getSeniorityRank(currentUser.thumbsUpCount).color} uppercase`, children: getSeniorityRank(currentUser.thumbsUpCount).title })] }), _jsxs("div", { className: 'text-right', children: [_jsxs("p", { className: 'text-3xl font-bold font-space text-emerald-500', children: ["\uD83D\uDC4D ", currentUser.thumbsUpCount] }), _jsx("p", { className: 'text-[8px] text-slate-700 font-space font-bold uppercase mt-1 tracking-widest', children: "Shop Cred" })] })] }), _jsxs("div", { className: 'grid grid-cols-2 gap-5 w-full', children: [_jsxs("div", { className: 'p-5 bg-slate-950/60 rounded-2xl text-center border border-white/5', children: [_jsx("p", { className: 'text-[9px] text-slate-600 font-space font-bold mb-1 uppercase tracking-[0.3em]', children: "Industry Age" }), _jsxs("p", { className: 'text-slate-200 text-xl font-bold font-syne', children: [currentUser.yearsInIndustry, "Y"] })] }), _jsxs("div", { className: 'p-5 bg-slate-950/60 rounded-2xl text-center border border-white/5', children: [_jsx("p", { className: 'text-[9px] text-slate-600 font-space font-bold mb-1 uppercase tracking-[0.3em]', children: "Status" }), _jsx("p", { className: `text-xl font-bold font-syne ${currentUser.role === 'ADMIN'
                                                            ? 'text-purple-400'
                                                            : 'text-slate-300'}`, children: "ACTIVE" })] })] })] }), _jsxs("div", { className: 'w-full p-8 border-t border-white/5 flex flex-wrap justify-center gap-8', children: [_jsx("button", { className: 'text-[10px] font-space font-bold text-slate-600 hover:text-white transition-colors uppercase tracking-[0.25em]', children: "EDIT" }), _jsx("button", { className: 'text-[10px] font-space font-bold text-slate-600 hover:text-white transition-colors uppercase tracking-[0.25em]', children: "KEYS" }), _jsx("button", { onClick: handleLogout, className: 'text-[10px] font-space font-bold text-red-500/40 hover:text-red-500 transition-colors uppercase tracking-[0.25em]', children: "LOGOUT" })] })] }) }) }))] }));
};
export default Main;
