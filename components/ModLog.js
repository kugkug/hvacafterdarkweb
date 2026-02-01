import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
const getActionStyles = (action) => {
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
export const ModLog = ({ logs }) => {
    return (_jsxs("div", { className: 'glass-panel rounded-3xl border border-amber-500/10 overflow-hidden bg-slate-950/40 animate-in fade-in duration-700', children: [_jsxs("div", { className: 'p-10 border-b border-amber-500/10 flex justify-between items-center bg-slate-950/40', children: [_jsxs("div", { children: [_jsx("h2", { className: 'text-3xl font-syne font-bold text-amber-500 uppercase tracking-tighter', children: "Moderation Archive" }), _jsx("p", { className: 'text-[10px] text-slate-600 font-space uppercase tracking-[0.25em] mt-1.5 font-bold', children: "Immutable sequence of administrative interventions" })] }), _jsx("div", { className: 'px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5', children: _jsx("span", { className: 'text-[10px] font-space text-amber-500/80 font-bold uppercase tracking-widest', children: "System Monitor Active" }) })] }), _jsx("div", { className: 'overflow-x-auto', children: _jsxs("table", { className: 'w-full text-left', children: [_jsx("thead", { children: _jsxs("tr", { className: 'border-b border-slate-900 bg-slate-900/40 text-[10px] font-space text-slate-500 uppercase tracking-[0.15em] font-bold', children: [_jsx("th", { className: 'px-10 py-5', children: "Timestamp" }), _jsx("th", { className: 'px-10 py-5', children: "Moderator" }), _jsx("th", { className: 'px-10 py-5', children: "Action" }), _jsx("th", { className: 'px-10 py-5', children: "Target" }), _jsx("th", { className: 'px-10 py-5', children: "Details" })] }) }), _jsxs("tbody", { className: 'divide-y divide-slate-900/50', children: [logs
                                    .slice()
                                    .reverse()
                                    .map((log) => (_jsxs("tr", { className: 'hover:bg-slate-900/40 transition-all duration-300', children: [_jsxs("td", { className: 'px-10 py-6', children: [_jsx("div", { className: 'text-xs text-slate-200 font-space font-bold tracking-tight', children: formatTime(log.timestamp) }), _jsx("div", { className: 'text-[10px] text-slate-600 font-space mt-0.5 tracking-tight', children: formatDate(log.timestamp) })] }), _jsx("td", { className: 'px-10 py-6', children: _jsxs("span", { className: 'text-xs font-bold text-cyan-400 font-space', children: ["@", log.moderatorUsername] }) }), _jsx("td", { className: 'px-10 py-6', children: _jsx("span", { className: `text-[9px] px-3 py-1 rounded-full border font-space font-bold uppercase tracking-wider ${getActionStyles(log.action)}`, children: log.action.replace(/_/g, ' ') }) }), _jsx("td", { className: 'px-10 py-6 text-xs text-slate-400 font-medium italic', children: log.targetName }), _jsx("td", { className: 'px-10 py-6 text-[12px] text-slate-500 leading-relaxed font-light max-w-xs', children: log.details || '—' })] }, log.id))), logs.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: 'px-10 py-32 text-center', children: _jsx("p", { className: 'text-slate-800 font-space font-bold text-[11px] tracking-[0.5em] uppercase', children: "No logs detected in local storage" }) }) }))] })] }) })] }));
};
