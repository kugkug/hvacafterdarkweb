import React, { SetStateAction, useState } from 'react';
import NeonButton from './NeonButton';
import { ModLogEntry, Post, User } from '../types';
import { ChatWindow } from './ChatWindow';
import { PrivateMessages } from './PrivateMessages';
import { ModLog } from './ModLog';
import {
    ADMIN_EMAIL,
    MOCK_FINDS,
    MOCK_MOD_LOGS,
    MOCK_USER
} from '../constants';
import { Footer } from './Footer';
import { useAuth } from '../utilities/auth';

interface Props {
    view: string;
    setView: (
        view: SetStateAction<
            | 'HOME'
            | 'CHAT'
            | 'MEMES'
            | 'FINDS'
            | 'PROFILE'
            | 'MOD'
            | 'MESSAGES'
            | 'MOD_LOGS'
        >
    ) => void;
    setShowAuth: (show: boolean) => void;
    memes: Post[];
    setMemes: (memes: Post[]) => void;
    handleUpload: (
        e: React.ChangeEvent<HTMLInputElement>,
        type: 'MEME' | 'FIND'
    ) => void;
}

const Main = ({
    view,
    setView,
    setShowAuth,
    memes,
    setMemes,
    handleUpload
}: Props) => {
    const auth = useAuth();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [modLogs, setModLogs] = useState<ModLogEntry[]>(MOCK_MOD_LOGS);
    const [uploading, setUploading] = useState(false);
    const [finds, setFinds] = useState<Post[]>(
        MOCK_FINDS.map((f) => ({ ...f, isApproved: true }))
    );

    const handleLogin = () => {
        setCurrentUser(MOCK_USER);
        setShowAuth(false);
    };

    const addModLog = (
        action: ModLogEntry['action'],
        targetId: string,
        targetName: string,
        details: string
    ) => {
        if (!currentUser) return;
        const newLog: ModLogEntry = {
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

    const getSeniorityRank = (count: number) => {
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

    return (
        <main className='relative z-10 max-w-[1400px] mx-auto p-6 md:p-12'>
            {view === 'HOME' && (
                <div className='space-y-40'>
                    <div className='text-center py-20 space-y-10 animate-in fade-in slide-in-from-bottom-12 duration-1000'>
                        <div className='flex justify-center'>
                            <div className='px-5 py-1.5 bg-slate-900/60 border border-cyan-500/10 rounded-full text-[10px] font-space text-cyan-500 tracking-[0.6em] uppercase font-bold backdrop-blur-md'>
                                Secure Operational Node
                            </div>
                        </div>
                        <h2 className='text-4xl md:text-6xl font-syne font-extrabold leading-[1.2] tracking-tighter uppercase'>
                            SHIFT ENDS.
                            <br />
                            <span className='text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 animate-gradient-x neon-text-blue'>
                                DARK TERMINAL OPEN.
                            </span>
                        </h2>
                        <p className='text-slate-500 max-w-lg mx-auto italic text-lg font-light leading-relaxed'>
                            The exclusive midnight lounge for the HVAC elite.
                            Field findings, technician humor, and unmoderated
                            shop talk.
                        </p>
                        <div className='flex flex-col sm:flex-row justify-center gap-6 pt-8'>
                            <NeonButton
                                onClick={() =>
                                    auth.user
                                        ? setView('CHAT')
                                        : setShowAuth(true)
                                }
                                className='px-12 py-5 text-sm shadow-[0_0_30px_rgba(0,210,255,0.1)]'
                            >
                                ENTER CHAT
                            </NeonButton>
                            {!auth.user && (
                                <button
                                    onClick={() => setShowAuth(true)}
                                    className='px-12 py-5 text-sm font-space font-bold border border-slate-900 rounded-lg hover:border-slate-700 transition-all text-slate-600 hover:text-slate-200 uppercase tracking-widest bg-slate-950/40'
                                >
                                    SIGN IN
                                </button>
                            )}
                        </div>
                    </div>

                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-24'>
                        <section className='space-y-10'>
                            <div className='flex justify-between items-end border-b border-white/5 pb-6'>
                                <div>
                                    <h3 className='text-xl font-syne font-bold text-slate-100 uppercase tracking-tighter'>
                                        Meme Stream
                                    </h3>
                                    <p className='text-[9px] text-slate-600 font-space uppercase tracking-[0.4em] mt-1.5 font-bold'>
                                        Technician Satire
                                    </p>
                                </div>
                                <button
                                    onClick={() =>
                                        auth.user
                                            ? setView('MEMES')
                                            : setShowAuth(true)
                                    }
                                    className='text-[10px] font-space font-bold text-cyan-600 hover:text-cyan-400 transition-all uppercase tracking-[0.25em]'
                                >
                                    VIEW ALL
                                </button>
                            </div>
                            <div className='grid grid-cols-3 gap-6'>
                                {memes.slice(0, 3).map((m) => (
                                    <div
                                        key={m.id}
                                        className='group relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/5 hover:border-cyan-500/20 transition-all duration-1000 bg-slate-950/50'
                                    >
                                        <img
                                            src={m.imageUrl}
                                            alt={m.caption}
                                            className='w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 opacity-40 group-hover:opacity-100'
                                        />
                                        {!auth.user && (
                                            <div className='absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-4'>
                                                <span className='text-[8px] font-space font-bold text-slate-600 tracking-[0.4em] uppercase'>
                                                    ENCRYPTED
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className='space-y-10'>
                            <div className='flex justify-between items-end border-b border-white/5 pb-6'>
                                <div>
                                    <h3 className='text-xl font-syne font-bold text-slate-100 uppercase tracking-tighter'>
                                        Field Artifacts
                                    </h3>
                                    <p className='text-[9px] text-slate-600 font-space uppercase tracking-[0.4em] mt-1.5 font-bold'>
                                        Trade Madness
                                    </p>
                                </div>
                                <button
                                    onClick={() =>
                                        auth.user
                                            ? setView('FINDS')
                                            : setShowAuth(true)
                                    }
                                    className='text-[10px] font-space font-bold text-purple-600 hover:text-purple-400 transition-all uppercase tracking-[0.25em]'
                                >
                                    FILES →
                                </button>
                            </div>
                            <div className='grid grid-cols-3 gap-6'>
                                {finds.slice(0, 3).map((f) => (
                                    <div
                                        key={f.id}
                                        className='group relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/5 hover:border-purple-500/20 transition-all duration-1000 bg-slate-950/50'
                                    >
                                        <img
                                            src={f.imageUrl}
                                            alt={f.caption}
                                            className='w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 opacity-40 group-hover:opacity-100'
                                        />
                                        {!auth.user && (
                                            <div className='absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-4'>
                                                <span className='text-[8px] font-space font-bold text-slate-600 tracking-[0.4em] uppercase'>
                                                    LOCKED
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            )}

            {/* {view === 'CHAT' && auth.user && (
                <ChatWindow user={auth.user} onModAction={addModLog} />
            )} */}
            {/* {view === 'MESSAGES' && auth.user && (
                <PrivateMessages currentUser={auth.user} />
            )} */}
            {view === 'MOD_LOGS' && auth.user && <ModLog logs={modLogs} />}

            {(view === 'MEMES' || view === 'FINDS') && auth.user && (
                <div className='space-y-12 animate-in fade-in duration-700'>
                    <div className='flex justify-between items-center border-b border-white/5 pb-8'>
                        <div className='space-y-1'>
                            <h2 className='text-3xl font-syne font-bold text-slate-100 tracking-tighter uppercase'>
                                {view === 'MEMES'
                                    ? 'The Meme Lab'
                                    : 'Mechanical Finds'}
                            </h2>
                            <p className='text-[9px] font-space text-slate-600 uppercase tracking-[0.4em] font-bold'>
                                {view === 'MEMES'
                                    ? 'Systematic Humor Transmissions'
                                    : 'Evidence of Installation Madness'}
                            </p>
                        </div>
                        <label
                            className={`cursor-pointer ${
                                view === 'MEMES'
                                    ? 'bg-cyan-600 hover:bg-cyan-500'
                                    : 'bg-purple-600 hover:bg-purple-500'
                            } px-6 py-3 rounded-xl font-space font-bold text-[10px] transition-all shadow-xl uppercase tracking-widest text-white`}
                        >
                            {uploading ? 'UPLOADING...' : `SUBMIT DATA`}
                            <input
                                type='file'
                                hidden
                                accept='image/*'
                                onChange={(e) =>
                                    handleUpload(
                                        e,
                                        view === 'MEMES' ? 'MEME' : 'FIND'
                                    )
                                }
                                disabled={uploading}
                            />
                        </label>
                    </div>
                    {/* <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10'>
                        {(view === 'MEMES' ? memes : finds)
                            .filter(
                                (p) =>
                                    p.isApproved || currentUser.role === 'ADMIN'
                            )
                            .map((p) => (
                                <div
                                    key={p.id}
                                    className={`glass-panel p-4 rounded-[2rem] border-white/5 group overflow-hidden relative transition-all duration-700 hover:border-${
                                        view === 'MEMES' ? 'cyan' : 'purple'
                                    }-500/20`}
                                >
                                    <img
                                        src={p.imageUrl}
                                        className='w-full h-64 object-cover rounded-2xl mb-4 group-hover:scale-105 transition-transform duration-1000 opacity-60 group-hover:opacity-100'
                                    />
                                    {!p.isApproved && (
                                        <div className='absolute top-8 left-8 bg-amber-500 text-black text-[9px] px-3 py-1 rounded-full font-space font-bold uppercase tracking-widest'>
                                            Awaiting MOD
                                        </div>
                                    )}
                                    <p className='text-sm text-slate-400 mb-4 px-2 italic font-light'>
                                        "{p.caption}"
                                    </p>
                                    <div className='flex justify-between items-center text-[9px] font-space font-bold text-slate-600 px-2 uppercase tracking-widest pt-3 border-t border-white/5'>
                                        <span className='hover:text-cyan-400 transition-colors cursor-pointer'>
                                            @{p.username}
                                        </span>
                                        <span className='text-emerald-500/80'>
                                            👍 {p.likes}
                                        </span>
                                    </div>
                                </div>
                            ))}
                    </div> */}
                </div>
            )}

            {/* {view === 'MOD' &&
                currentUser &&
                (currentUser.role === 'ADMIN' ||
                    currentUser.role === 'MODERATOR') && (
                    <div className='space-y-12 animate-in slide-in-from-top-6 duration-700'>
                        <div className='flex justify-between items-end border-b border-amber-500/10 pb-6'>
                            <div className='space-y-1'>
                                <h2 className='text-2xl font-syne font-bold text-amber-500 uppercase tracking-tighter'>
                                    Admin Terminal
                                </h2>
                                <p className='text-[9px] font-space text-slate-600 uppercase tracking-[0.3em] font-bold'>
                                    Node Integrity Control
                                </p>
                            </div>
                            <button
                                onClick={() => setView('MOD_LOGS')}
                                className='text-[10px] font-space font-bold text-slate-600 hover:text-amber-400 uppercase tracking-widest bg-amber-500/5 border border-amber-500/10 px-5 py-2.5 rounded transition-all'
                            >
                                System Logs
                            </button>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
                            <div className='glass-panel p-8 rounded-[2rem] border-amber-500/10'>
                                <h3 className='font-space font-bold text-[10px] text-slate-500 uppercase mb-6 tracking-[0.3em] border-b border-white/5 pb-4'>
                                    Awaiting Verification
                                </h3>
                                <div className='space-y-4'>
                                    {[...memes, ...finds]
                                        .filter((m) => !m.isApproved)
                                        .map((m) => (
                                            <div
                                                key={m.id}
                                                className='flex items-center justify-between p-4 bg-slate-900/20 rounded-2xl border border-white/5'
                                            >
                                                <div className='flex items-center space-x-4'>
                                                    <img
                                                        src={m.imageUrl}
                                                        className='w-12 h-12 rounded object-cover'
                                                    />
                                                    <div className='flex flex-col'>
                                                        <span className='text-xs text-slate-300 font-bold'>
                                                            @{m.username}
                                                        </span>
                                                        <span className='text-[9px] text-slate-600 uppercase font-space font-bold'>
                                                            {m.type}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='flex space-x-3'>
                                                    <button
                                                        onClick={() => {
                                                            if (
                                                                m.type ===
                                                                'MEME'
                                                            )
                                                                setMemes(
                                                                    memes.map(
                                                                        (x) =>
                                                                            x.id ===
                                                                            m.id
                                                                                ? {
                                                                                      ...x,
                                                                                      isApproved: true
                                                                                  }
                                                                                : x
                                                                    )
                                                                );
                                                            else
                                                                setFinds(
                                                                    finds.map(
                                                                        (x) =>
                                                                            x.id ===
                                                                            m.id
                                                                                ? {
                                                                                      ...x,
                                                                                      isApproved: true
                                                                                  }
                                                                                : x
                                                                    )
                                                                );
                                                            addModLog(
                                                                'POST_APPROVE',
                                                                m.id,
                                                                `${m.type} by ${m.username}`,
                                                                'Manual approval'
                                                            );
                                                        }}
                                                        className='text-[10px] text-emerald-500 font-bold font-space uppercase'
                                                    >
                                                        ACCEPT
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (
                                                                m.type ===
                                                                'MEME'
                                                            )
                                                                setMemes(
                                                                    memes.filter(
                                                                        (x) =>
                                                                            x.id !==
                                                                            m.id
                                                                    )
                                                                );
                                                            else
                                                                setFinds(
                                                                    finds.filter(
                                                                        (x) =>
                                                                            x.id !==
                                                                            m.id
                                                                    )
                                                                );
                                                            addModLog(
                                                                'POST_REJECT',
                                                                m.id,
                                                                `${m.type} by ${m.username}`,
                                                                'Purged'
                                                            );
                                                        }}
                                                        className='text-[10px] text-red-500 font-bold font-space uppercase'
                                                    >
                                                        PURGE
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )} */}

            {/* {view === 'PROFILE' && currentUser && (
                <div className='max-w-xl mx-auto py-12 animate-in zoom-in-95 duration-700'>
                    <div className='glass-panel p-10 rounded-[2.5rem] border-white/5 relative overflow-hidden'>
                        <div className='flex flex-col items-center space-y-8'>
                            <div className='relative'>
                                <div className='w-28 h-28 rounded-2xl bg-slate-950 border border-cyan-500/20 p-1'>
                                    <img
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.username}`}
                                        className='w-full h-full object-cover rounded-xl'
                                    />
                                </div>
                                <div className='absolute -bottom-2 -right-2 bg-slate-950 border border-cyan-500/30 px-4 py-1 rounded-full shadow-2xl'>
                                    <span className='text-[10px] font-space text-cyan-400 font-bold tracking-[0.25em] uppercase'>
                                        {currentUser.role}
                                    </span>
                                </div>
                            </div>
                            <div className='text-center space-y-1.5'>
                                <h2 className='text-3xl font-syne font-extrabold text-slate-100 uppercase tracking-tighter'>
                                    {currentUser.username}
                                </h2>
                                <p className='text-purple-500 font-space font-bold text-[9px] tracking-[0.5em] uppercase'>
                                    {currentUser.title || 'OPERATIVE'}
                                </p>
                            </div>

                            <div className='w-full space-y-5'>
                                <div
                                    className={`p-6 rounded-[1.5rem] border ${
                                        getSeniorityRank(
                                            currentUser.thumbsUpCount
                                        ).border
                                    } ${
                                        getSeniorityRank(
                                            currentUser.thumbsUpCount
                                        ).bg
                                    } flex items-center justify-between`}
                                >
                                    <div className='space-y-1'>
                                        <p className='text-[10px] text-slate-600 font-space font-bold uppercase tracking-[0.4em]'>
                                            Rank
                                        </p>
                                        <h3
                                            className={`text-lg font-bold font-syne ${
                                                getSeniorityRank(
                                                    currentUser.thumbsUpCount
                                                ).color
                                            } uppercase`}
                                        >
                                            {
                                                getSeniorityRank(
                                                    currentUser.thumbsUpCount
                                                ).title
                                            }
                                        </h3>
                                    </div>
                                    <div className='text-right'>
                                        <p className='text-3xl font-bold font-space text-emerald-500'>
                                            👍 {currentUser.thumbsUpCount}
                                        </p>
                                        <p className='text-[8px] text-slate-700 font-space font-bold uppercase mt-1 tracking-widest'>
                                            Shop Cred
                                        </p>
                                    </div>
                                </div>

                                <div className='grid grid-cols-2 gap-5 w-full'>
                                    <div className='p-5 bg-slate-950/60 rounded-2xl text-center border border-white/5'>
                                        <p className='text-[9px] text-slate-600 font-space font-bold mb-1 uppercase tracking-[0.3em]'>
                                            Industry Age
                                        </p>
                                        <p className='text-slate-200 text-xl font-bold font-syne'>
                                            {currentUser.yearsInIndustry}Y
                                        </p>
                                    </div>
                                    <div className='p-5 bg-slate-950/60 rounded-2xl text-center border border-white/5'>
                                        <p className='text-[9px] text-slate-600 font-space font-bold mb-1 uppercase tracking-[0.3em]'>
                                            Status
                                        </p>
                                        <p
                                            className={`text-xl font-bold font-syne ${
                                                currentUser.role === 'ADMIN'
                                                    ? 'text-purple-400'
                                                    : 'text-slate-300'
                                            }`}
                                        >
                                            ACTIVE
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className='w-full p-8 border-t border-white/5 flex flex-wrap justify-center gap-8'>
                                <button className='text-[10px] font-space font-bold text-slate-600 hover:text-white transition-colors uppercase tracking-[0.25em]'>
                                    EDIT
                                </button>
                                <button className='text-[10px] font-space font-bold text-slate-600 hover:text-white transition-colors uppercase tracking-[0.25em]'>
                                    KEYS
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className='text-[10px] font-space font-bold text-red-500/40 hover:text-red-500 transition-colors uppercase tracking-[0.25em]'
                                >
                                    LOGOUT
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )} */}
        </main>
    );
};

export default Main;
