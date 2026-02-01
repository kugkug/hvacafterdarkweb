import React from 'react';
import { ModLogEntry } from '../types';

interface ModLogProps {
    logs: ModLogEntry[];
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

const getActionStyles = (action: ModLogEntry['action']) => {
    switch (action) {
        case 'MESSAGE_DELETE':
            return 'text-red-400 bg-red-500/10 border-red-500/20';
        case 'USER_BAN':
            return 'text-red-500 bg-red-950/40 border-red-500/40';
        case 'POST_APPROVE':
            return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
        case 'MESSAGE_EDIT':
            return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
        default:
            return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
};

export const ModLog: React.FC<ModLogProps> = ({ logs }) => {
    return (
        <div className='glass-panel rounded-3xl border border-amber-500/10 overflow-hidden bg-slate-950/40 animate-in fade-in duration-700'>
            <div className='p-10 border-b border-amber-500/10 flex justify-between items-center bg-slate-950/40'>
                <div>
                    <h2 className='text-3xl font-syne font-bold text-amber-500 uppercase tracking-tighter'>
                        Moderation Archive
                    </h2>
                    <p className='text-[10px] text-slate-600 font-space uppercase tracking-[0.25em] mt-1.5 font-bold'>
                        Immutable sequence of administrative interventions
                    </p>
                </div>
                <div className='px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5'>
                    <span className='text-[10px] font-space text-amber-500/80 font-bold uppercase tracking-widest'>
                        System Monitor Active
                    </span>
                </div>
            </div>
            <div className='overflow-x-auto'>
                <table className='w-full text-left'>
                    <thead>
                        <tr className='border-b border-slate-900 bg-slate-900/40 text-[10px] font-space text-slate-500 uppercase tracking-[0.15em] font-bold'>
                            <th className='px-10 py-5'>Timestamp</th>
                            <th className='px-10 py-5'>Moderator</th>
                            <th className='px-10 py-5'>Action</th>
                            <th className='px-10 py-5'>Target</th>
                            <th className='px-10 py-5'>Details</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-slate-900/50'>
                        {logs
                            .slice()
                            .reverse()
                            .map((log) => (
                                <tr
                                    key={log.id}
                                    className='hover:bg-slate-900/40 transition-all duration-300'
                                >
                                    <td className='px-10 py-6'>
                                        <div className='text-xs text-slate-200 font-space font-bold tracking-tight'>
                                            {formatTime(log.timestamp)}
                                        </div>
                                        <div className='text-[10px] text-slate-600 font-space mt-0.5 tracking-tight'>
                                            {formatDate(log.timestamp)}
                                        </div>
                                    </td>
                                    <td className='px-10 py-6'>
                                        <span className='text-xs font-bold text-cyan-400 font-space'>
                                            @{log.moderatorUsername}
                                        </span>
                                    </td>
                                    <td className='px-10 py-6'>
                                        <span
                                            className={`text-[9px] px-3 py-1 rounded-full border font-space font-bold uppercase tracking-wider ${getActionStyles(
                                                log.action
                                            )}`}
                                        >
                                            {log.action.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className='px-10 py-6 text-xs text-slate-400 font-medium italic'>
                                        {log.targetName}
                                    </td>
                                    <td className='px-10 py-6 text-[12px] text-slate-500 leading-relaxed font-light max-w-xs'>
                                        {log.details || '—'}
                                    </td>
                                </tr>
                            ))}
                        {logs.length === 0 && (
                            <tr>
                                <td
                                    colSpan={5}
                                    className='px-10 py-32 text-center'
                                >
                                    <p className='text-slate-800 font-space font-bold text-[11px] tracking-[0.5em] uppercase'>
                                        No logs detected in local storage
                                    </p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
