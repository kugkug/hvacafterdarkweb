import { useRef, useState, useCallback } from 'react';
import axios from 'axios';
import { SimpleButton } from './SimpleButton';
import usePost from '../custom_hooks/usePost';

interface InviteUserModalProps {
    onClose: () => void;
    token: string | null;
    conversationId: string | null;
}

const InviteUserModal = ({
    onClose,
    token,
    conversationId
}: InviteUserModalProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searching, setSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [invitingId, setInvitingId] = useState<string | number | null>(null);
    const [inviteError, setInviteError] = useState<string | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const runSearch = useCallback(
        (q: string) => {
            if (!q.trim()) {
                setSearchResults([]);
                setSearchError(null);
                return;
            }
            setSearching(true);
            setSearchError(null);
            const apiUrl =
                import.meta.env.VITE_API_URL +
                `/user/search?q=${encodeURIComponent(q.trim())}`;
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            axios
                .get(apiUrl, { headers })
                .then((res) => {
                    const data = res.data;
                    const list = Array.isArray(data)
                        ? data
                        : (data?.data ?? data?.users ?? []);
                    setSearchResults(Array.isArray(list) ? list : []);
                })
                .catch((err) => {
                    setSearchError(
                        err.response?.data?.message || 'Search failed'
                    );
                    setSearchResults([]);
                })
                .finally(() => setSearching(false));
        },
        [token]
    );

    const handleKeyUp = useCallback(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => runSearch(searchQuery), 320);
    }, [searchQuery, runSearch]);

    const {
        postData,
        loading: invitingLoading,
        error: invitingError
    } = usePost(`/conversations/${conversationId}/invite`);

    const handleInvite = useCallback(
        async (userId: string | number) => {
            console.log(userId);
            if (!conversationId || !token) return;
            setInviteError(null);
            setInvitingId(userId);
            const invitingResponse = await postData({
                user_ids: [userId]
            });

            if (invitingResponse?.status) {
                setSearchResults((prev) =>
                    prev.filter(
                        (u: any) => (u.id ?? u.email ?? u.name) !== userId
                    )
                );
            } else {
                setInviteError(invitingError || 'Failed to invite user');
            }
            setInvitingId(null);
        },
        [conversationId, token]
    );

    // const handleInvite = useCallback(
    //     async (userId: string | number) => {
    //         if (!conversationId || !token) return;
    //         setInviteError(null);
    //         setInvitingId(userId);
    //         const apiUrl =
    //             import.meta.env.VITE_API_URL +
    //             `/conversations/${conversationId}/invite`;
    //         const headers: Record<string, string> = {
    //             'Content-Type': 'application/json',
    //             Accept: 'application/json',
    //             Authorization: `Bearer ${token}`
    //         };
    //         try {
    //             await axios.post(apiUrl, [userId], { headers });
    //             setSearchResults((prev) =>
    //                 prev.filter(
    //                     (u: any) => (u.id ?? u.email ?? u.name) !== userId
    //                 )
    //             );
    //         } catch (err: any) {
    //             setInviteError(
    //                 err.response?.data?.message || 'Failed to invite user'
    //             );
    //         } finally {
    //             setInvitingId(null);
    //         }
    //     },
    //     [conversationId, token]
    // );

    return (
        <div className='fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/98 backdrop-blur-3xl animate-in fade-in duration-500'>
            <div className='glass-panel w-full max-w-[480px] p-8 rounded-[3rem] border-white/5 relative shadow-2xl overflow-hidden'>
                <SimpleButton
                    onClose={onClose}
                    className='absolute top-6 right-6 text-slate-700 hover:text-white transition-colors'
                />
                <div className='text-center mb-6'>
                    <h2 className='text-xl font-syne font-bold text-cyan-400 tracking-tighter uppercase'>
                        Invite User
                    </h2>
                    <p className='text-slate-700 text-[10px] font-space font-bold mt-2 uppercase tracking-[0.3em]'>
                        Search for a user to invite
                    </p>
                </div>
                {!conversationId && (
                    <p className='text-amber-500/90 text-[10px] font-space uppercase tracking-wider mb-4 text-center'>
                        Select a conversation first
                    </p>
                )}
                {inviteError && (
                    <p className='text-red-500/80 text-[10px] font-space mb-4 text-center'>
                        {inviteError}
                    </p>
                )}
                <div className='space-y-4'>
                    <input
                        type='text'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyUp={handleKeyUp}
                        placeholder='Search by name or email...'
                        className='w-full bg-slate-900/50 border border-white/5 rounded-xl py-3 px-4 text-xs font-space tracking-wide focus:outline-none focus:border-cyan-500/20 transition-all text-slate-200 placeholder:text-slate-700'
                        autoFocus
                    />
                    <div className='min-h-[120px] max-h-[280px] overflow-y-auto scrollbar-hide rounded-xl border border-white/5 bg-slate-950/40 p-2'>
                        {searching && (
                            <p className='text-[10px] text-slate-600 font-space uppercase tracking-wider py-6 text-center'>
                                Searching...
                            </p>
                        )}
                        {!searching && searchError && (
                            <p className='text-[10px] text-red-500/80 font-space py-6 text-center'>
                                {searchError}
                            </p>
                        )}
                        {!searching &&
                            !searchError &&
                            searchQuery.trim() &&
                            searchResults.length === 0 && (
                                <p className='text-[10px] text-slate-600 font-space uppercase tracking-wider py-6 text-center'>
                                    No users found
                                </p>
                            )}
                        {!searching && searchResults.length > 0 && (
                            <ul className='space-y-1'>
                                {searchResults.map((u: any) => (
                                    <li
                                        key={u.id ?? u.email ?? u.name}
                                        className='flex items-center justify-between gap-3 py-2.5 px-3 rounded-lg bg-slate-900/40 border border-white/5 hover:border-cyan-500/10 transition-colors'
                                    >
                                        <div className='min-w-0'>
                                            <p className='text-xs font-semibold text-slate-200 truncate'>
                                                {u.name ?? u.username ?? '—'}
                                            </p>
                                            {u.email && (
                                                <p className='text-[10px] text-slate-600 truncate'>
                                                    {u.email}
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            type='button'
                                            disabled={
                                                !conversationId ||
                                                invitingId ===
                                                    (u.id ?? u.email ?? u.name)
                                            }
                                            onClick={() =>
                                                handleInvite(
                                                    u.id ?? u.email ?? u.name
                                                )
                                            }
                                            className='shrink-0 py-1.5 px-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[9px] font-space font-bold text-cyan-400 uppercase tracking-wider hover:bg-cyan-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                                        >
                                            {invitingId ===
                                            (u.id ?? u.email ?? u.name)
                                                ? '...'
                                                : 'Invite'}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InviteUserModal;
