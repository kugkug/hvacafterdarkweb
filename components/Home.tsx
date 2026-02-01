import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { User, Post, Role, PrivateMessage, ModLogEntry } from '../types';
import Main from './Main';
import { NeonButton } from './NeonButton';
import { ChatWindow } from './ChatWindow';
import { PrivateMessages } from './PrivateMessages';
import { ModLog } from './ModLog';
import { checkContentSafety } from '../services/geminiService';
import Registration from './Registration';
import Signin from './Signin';

import {
    MOCK_USER,
    MOCK_MEMES,
    MOCK_FINDS,
    ADMIN_EMAIL,
    MOCK_PMS,
    MOCK_MOD_LOGS
} from '../constants';

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

const Home = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [showAuth, setShowAuth] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [view, setView] = useState<
        | 'HOME'
        | 'CHAT'
        | 'MEMES'
        | 'FINDS'
        | 'PROFILE'
        | 'MOD'
        | 'MESSAGES'
        | 'MOD_LOGS'
    >('HOME');
    const [memes, setMemes] = useState<Post[]>(
        MOCK_MEMES.map((m) => ({ ...m, isApproved: true }))
    );
    const [finds, setFinds] = useState<Post[]>(
        MOCK_FINDS.map((f) => ({ ...f, isApproved: true }))
    );
    const [uploading, setUploading] = useState(false);
    const [pms] = useState<PrivateMessage[]>(MOCK_PMS);
    const [modLogs, setModLogs] = useState<ModLogEntry[]>(MOCK_MOD_LOGS);

    const handleLogin = () => {
        setCurrentUser(MOCK_USER);
        setShowAuth(false);
        setShowRegister(false);
    };
    const handleLogout = () => {
        setCurrentUser(null);
        setView('HOME');
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

    const handleUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
        type: 'MEME' | 'FIND'
    ) => {
        const file = e.target.files?.[0];
        if (!file || !currentUser) return;
        setUploading(true);

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64 = reader.result as string;
            const safety = await checkContentSafety('New post upload', base64);

            if (!safety.safe) {
                alert('Upload rejected: ' + safety.reason);
                setUploading(false);
                return;
            }

            const newPost: Post = {
                id: Date.now().toString(),
                userId: currentUser.id,
                username: currentUser.username,
                type,
                imageUrl: base64,
                caption: 'Member Upload',
                timestamp: new Date(),
                likes: 0,
                isApproved:
                    currentUser.role === 'TRUSTED' ||
                    currentUser.role === 'ADMIN'
            };

            if (type === 'MEME') setMemes([newPost, ...memes]);
            else setFinds([newPost, ...finds]);

            setUploading(false);
            alert(
                newPost.isApproved
                    ? 'Posted!'
                    : 'Post sent for moderator approval.'
            );
        };
        reader.readAsDataURL(file);
    };

    const unreadPMs = currentUser
        ? pms.filter((m) => m.receiverId === currentUser.id && !m.isRead).length
        : 0;

    return (
        <div className='min-h-screen bg-[#020617] text-slate-200 selection:bg-cyan-500/40 relative'>
            <div className='fixed inset-0 pointer-events-none z-50 scanlines opacity-[0.03]'></div>
            {/* <Navbar /> */}
            <div className='fixed inset-0 overflow-hidden pointer-events-none z-0'>
                <div className='absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-cyan-900/5 blur-[180px] rounded-full animate-pulse' />
                <div className='absolute bottom-[-15%] right-[-5%] w-[50%] h-[50%] bg-purple-900/5 blur-[180px] rounded-full animate-pulse delay-1000' />
            </div>

            <Main
                currentUser={currentUser}
                view={view}
                setView={setView}
                setShowAuth={setShowAuth}
                memes={memes}
                setMemes={setMemes}
                handleUpload={handleUpload}
            />

            {showAuth && (
                <Signin
                    onClose={() => setShowAuth(false)}
                    onClick={() => setShowRegister(true)}
                />
            )}

            {showRegister && (
                <Registration
                    onClose={() => setShowRegister(false)}
                    onCancel={() => {
                        setShowRegister(false);
                        setShowAuth(true);
                    }}
                />
            )}
        </div>
    );
};

export default Home;
