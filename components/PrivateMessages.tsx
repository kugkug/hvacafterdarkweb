import React, {
    useState,
    useEffect,
    useRef,
    useMemo,
    useCallback
} from 'react';
import axios from 'axios';
import { User, PrivateMessage } from '../types';
import { OTHER_USERS, MOCK_PMS, MOCK_USER } from '../constants';
import { useAuth } from '../utilities/auth';
import usePost from '../custom_hooks/usePost';

const formatTime = (date: Date) =>
    date
        .toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })
        .toLowerCase();

type PmContact = {
    id: string;
    username: string;
    title?: string;
    email?: string;
};

function userToContact(u: User): PmContact {
    return {
        id: u.id,
        username: u.username,
        title: u.title,
        email: u.email
    };
}

function mapApiUserToContact(raw: Record<string, unknown>): PmContact | null {
    const id = raw.id ?? raw.user_id;
    if (id === undefined || id === null) return null;
    const email = typeof raw.email === 'string' ? raw.email : '';
    const name =
        (typeof raw.name === 'string' && raw.name) ||
        (typeof raw.username === 'string' && raw.username) ||
        email.split('@')[0] ||
        'User';
    const title =
        (typeof raw.title === 'string' && raw.title) ||
        (typeof raw.role === 'string' && raw.role) ||
        undefined;
    return {
        id: String(id),
        username: name,
        title,
        email: email || undefined
    };
}

/** Handles row shape or nested `user` / `contact` / `other_user` from /messages/contacts. */
function mapContactRow(raw: Record<string, unknown>): PmContact | null {
    const nested = raw.user ?? raw.contact ?? raw.other_user;
    if (nested && typeof nested === 'object' && nested !== null) {
        return mapApiUserToContact(nested as Record<string, unknown>);
    }
    return mapApiUserToContact(raw);
}

function mapApiPrivateMessage(
    raw: Record<string, unknown>,
    otherUserId: string,
    currentUserId: string,
    index: number
): PrivateMessage {
    const id = String(raw.id ?? raw.uuid ?? `pm-${otherUserId}-${index}`);
    const content = String(raw.body ?? raw.content ?? raw.message ?? '');
    const senderObj = raw.sender as Record<string, unknown> | undefined;
    let senderId = String(raw.sender_id ?? raw.user_id ?? senderObj?.id ?? '');
    let receiverId = String(raw.receiver_id ?? raw.recipient_id ?? '');
    let senderEmail = String(
        (raw.user as Record<string, unknown>)?.email ?? ''
    );

    if (!receiverId || receiverId === 'undefined') {
        if (senderId === String(otherUserId)) {
            receiverId = String(currentUserId);
        } else if (senderId === String(currentUserId)) {
            receiverId = String(otherUserId);
        } else {
            receiverId = String(otherUserId);
        }
    }
    if (!senderId || senderId === 'undefined') {
        if (receiverId === String(otherUserId)) {
            senderId = String(currentUserId);
        } else {
            senderId = String(otherUserId);
        }
    }

    if (!senderEmail) {
        senderEmail = String(
            (raw.user as Record<string, unknown>)?.email ?? ''
        );
        if (!senderEmail) {
            senderEmail = String(
                (raw.contact as Record<string, unknown>)?.email ?? ''
            );
        }
        if (!senderEmail) {
            senderEmail = String(
                (raw.other_user as Record<string, unknown>)?.email ?? ''
            );
        }
    }

    const ts =
        raw.created_at ?? raw.updated_at ?? raw.timestamp ?? raw.created_time;
    const timestamp = ts ? new Date(String(ts)) : new Date();
    const isRead = Boolean(raw.is_read ?? raw.read_at);

    return {
        id,
        senderId,
        receiverId,
        content,
        timestamp,
        isRead,
        senderEmail
    };
}

function parsePrivateMessagesPayload(
    data: unknown,
    recipientId: string,
    currentUserId: string
): PrivateMessage[] {
    const rawList = Array.isArray(data)
        ? data
        : ((data as Record<string, unknown>)?.data ??
          (data as Record<string, unknown>)?.messages ??
          []);

    const list = Array.isArray(rawList) ? rawList : [];
    return list.map((item, index) =>
        mapApiPrivateMessage(
            item as Record<string, unknown>,
            recipientId,
            currentUserId,
            index
        )
    );
}

function resolveCurrentUserId(authEmail: string | null): string {
    if (!authEmail) return MOCK_USER.id;
    if (authEmail === MOCK_USER.email) return MOCK_USER.id;
    const match = OTHER_USERS.find((u) => u.email === authEmail);
    return match?.id ?? MOCK_USER.id;
}

export const PrivateMessages: React.FC = () => {
    const { user: authEmail, name: displayName, token } = useAuth();
    const currentUserId = useMemo(
        () => resolveCurrentUserId(authEmail),
        [authEmail]
    );

    const fallbackContacts = useMemo(() => OTHER_USERS.map(userToContact), []);

    const [contactById, setContactById] = useState<Record<string, PmContact>>(
        {}
    );

    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [apiContacts, setApiContacts] = useState<PmContact[]>([]);
    const [contactsLoading, setContactsLoading] = useState(false);
    const [contactsError, setContactsError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<PmContact[]>([]);
    const [searching, setSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [threadMessages, setThreadMessages] = useState<PrivateMessage[]>([]);
    const [threadLoading, setThreadLoading] = useState(false);
    const [threadError, setThreadError] = useState<string | null>(null);
    const [inputText, setInputText] = useState('');
    const [mobilePanel, setMobilePanel] = useState<'list' | 'chat'>('list');
    const scrollRef = useRef<HTMLDivElement>(null);
    const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(
        null
    );

    const fetchPrivateThreadMessages = useCallback(
        async (
            recipientId: string,
            signal?: AbortSignal
        ): Promise<PrivateMessage[]> => {
            const res = await axios.get(
                import.meta.env.VITE_API_URL +
                    `/messages/private/${encodeURIComponent(recipientId)}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    signal
                }
            );
            return parsePrivateMessagesPayload(
                res.data,
                recipientId,
                currentUserId
            );
        },
        [token, currentUserId]
    );

    const {
        postData,
        loading: sendLoading,
        error: messageError
    } = usePost('/messages/private');

    const refetchThread = useCallback(async () => {
        if (!selectedUserId || !token) return;
        const parsed = await fetchPrivateThreadMessages(selectedUserId);
        setThreadMessages(parsed);
    }, [selectedUserId, token, fetchPrivateThreadMessages]);

    useEffect(() => {
        if (!token) {
            const map = Object.fromEntries(
                OTHER_USERS.map((u) => [u.id, userToContact(u)])
            );
            setContactById(map);
            setApiContacts(fallbackContacts);
            setContactsError(null);
            setContactsLoading(false);
            setSelectedUserId((prev) => {
                if (prev && map[prev]) return prev;
                return OTHER_USERS[0]?.id ?? null;
            });
            return;
        }

        let cancelled = false;
        setContactsLoading(true);
        setContactsError(null);

        const apiUrl = import.meta.env.VITE_API_URL + '/messages/contacts';
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        };

        axios
            .get(apiUrl, { headers })
            .then((res) => {
                if (cancelled) return;
                const data = res.data;
                const rawList = Array.isArray(data)
                    ? data
                    : (data?.data ?? data?.contacts ?? []);
                const list = Array.isArray(rawList) ? rawList : [];
                const mapped: PmContact[] = [];
                const byId: Record<string, PmContact> = {};
                for (const item of list) {
                    const row = item as Record<string, unknown>;
                    const c = mapContactRow(row);
                    if (!c) continue;
                    if (authEmail && c.email === authEmail) continue;
                    if (c.id === currentUserId) continue;
                    mapped.push(c);
                    byId[c.id] = c;
                }
                setApiContacts(mapped);
                setContactById((prev) => ({ ...prev, ...byId }));
                setSelectedUserId((prev) => {
                    if (prev && mapped.some((x) => x.id === prev)) return prev;
                    return mapped[0]?.id ?? null;
                });
            })
            .catch((err) => {
                if (cancelled) return;
                setContactsError(
                    err.response?.data?.message || 'Failed to load contacts'
                );
                setApiContacts([]);
            })
            .finally(() => {
                if (!cancelled) setContactsLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [token, authEmail, currentUserId, fallbackContacts]);

    const runUserSearch = useCallback(
        (q: string) => {
            const trimmed = q.trim();
            if (!trimmed) {
                setSearchResults([]);
                setSearchError(null);
                setSearching(false);
                return;
            }
            setSearching(true);
            setSearchError(null);
            const apiUrl =
                import.meta.env.VITE_API_URL +
                `/user/search?q=${encodeURIComponent(trimmed)}`;
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            };
            if (token) headers.Authorization = `Bearer ${token}`;

            axios
                .get(apiUrl, { headers })
                .then((res) => {
                    const data = res.data;
                    const rawList = Array.isArray(data)
                        ? data
                        : (data?.data ?? data?.users ?? []);
                    const list = Array.isArray(rawList) ? rawList : [];
                    const mapped: PmContact[] = [];
                    for (const item of list) {
                        const c = mapApiUserToContact(
                            item as Record<string, unknown>
                        );
                        if (!c) continue;
                        if (authEmail && c.email === authEmail) continue;
                        if (c.id === currentUserId) continue;
                        mapped.push(c);
                    }
                    setSearchResults(mapped);
                })
                .catch((err) => {
                    setSearchError(
                        err.response?.data?.message || 'Search failed'
                    );
                    setSearchResults([]);
                })
                .finally(() => setSearching(false));
        },
        [token, authEmail, currentUserId]
    );

    useEffect(() => {
        if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
        const q = searchQuery;
        if (!q.trim()) {
            setSearchResults([]);
            setSearchError(null);
            setSearching(false);
            return;
        }
        searchDebounceRef.current = setTimeout(() => runUserSearch(q), 320);
        return () => {
            if (searchDebounceRef.current)
                clearTimeout(searchDebounceRef.current);
        };
    }, [searchQuery, runUserSearch]);

    const listContacts = useMemo(() => {
        if (searchQuery.trim()) return searchResults;
        if (!token) return fallbackContacts;
        return apiContacts;
    }, [searchQuery, searchResults, token, fallbackContacts, apiContacts]);

    const selectedUser = selectedUserId
        ? (contactById[selectedUserId] ?? null)
        : null;

    const sortedThreadMessages = useMemo(
        () =>
            [...threadMessages].sort(
                (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
            ),
        [threadMessages]
    );

    useEffect(() => {
        if (!selectedUserId) {
            setThreadMessages([]);
            setThreadError(null);
            setThreadLoading(false);
            return;
        }

        if (!token) {
            const local = MOCK_PMS.filter(
                (m) =>
                    (m.senderId === currentUserId &&
                        m.receiverId === selectedUserId) ||
                    (m.senderId === selectedUserId &&
                        m.receiverId === currentUserId)
            );
            setThreadMessages(local);
            setThreadError(null);
            setThreadLoading(false);
            return;
        }

        const controller = new AbortController();
        setThreadLoading(true);
        setThreadError(null);
        setThreadMessages([]);

        fetchPrivateThreadMessages(selectedUserId, controller.signal)
            .then((parsed) => {
                setThreadMessages(parsed);
            })
            .catch((err: unknown) => {
                const e = err as { code?: string; name?: string };
                if (
                    e?.code === 'ERR_CANCELED' ||
                    e?.name === 'CanceledError' ||
                    e?.name === 'AbortError'
                ) {
                    return;
                }
                setThreadError(
                    (err as { response?: { data?: { message?: string } } })
                        .response?.data?.message || 'Failed to load messages'
                );
                setThreadMessages([]);
            })
            .finally(() => {
                setThreadLoading(false);
            });

        return () => {
            controller.abort();
        };
    }, [selectedUserId, token, currentUserId, fetchPrivateThreadMessages]);

    const handleSelectConversation = (contact: PmContact) => {
        setSelectedUserId(contact.id);
        setContactById((prev) => ({ ...prev, [contact.id]: contact }));
        setMobilePanel('chat');
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const text = inputText.trim();
        if (!text || !selectedUserId) return;

        if (!token) {
            const newMessage: PrivateMessage = {
                id: `pm-${Date.now()}`,
                senderId: currentUserId,
                receiverId: selectedUserId,
                content: text,
                timestamp: new Date(),
                isRead: false
            };
            setThreadMessages((prev) => [...prev, newMessage]);
            setInputText('');
            return;
        }

        const postResponse = await postData({
            recipient_id: selectedUserId,
            body: text
        });

        if (postResponse?.status === true) {
            setInputText('');
            await refetchThread();
        }
    };

    useEffect(() => {
        if (scrollRef.current)
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [sortedThreadMessages, selectedUserId]);

    // Pusher/Reverb: same pattern as Community — private thread channel + .message.sent
    useEffect(() => {
        if (!window.Echo || !selectedUserId || !token) return;

        const channel = window.Echo.private(
            `private-messages.${selectedUserId}`
        );

        channel.listen('.message.sent', () => {
            fetchPrivateThreadMessages(selectedUserId)
                .then(setThreadMessages)
                .catch(() => {});
        });

        return () => {
            window.Echo?.leave(`private-messages.${selectedUserId}`);
        };
    }, [selectedUserId, token, fetchPrivateThreadMessages, refetchThread]);

    return (
        <main className='relative z-10 w-full max-w-[1400px] mx-auto px-4 py-6 sm:p-6 md:p-12 min-w-0'>
            <div className='flex flex-col md:flex-row h-[75vh] sm:h-[80vh] glass-panel rounded-2xl sm:rounded-3xl border border-cyan-500/10 overflow-hidden bg-slate-950/40 animate-in fade-in duration-700'>
                {/* Conversation List — search row matches Community sidebar */}
                <div
                    className={`w-full md:w-72 lg:w-80 flex-shrink-0 flex flex-col border-b md:border-b-0 md:border-r border-cyan-500/5 bg-slate-950/60 min-h-0 ${
                        mobilePanel === 'chat' ? 'hidden md:flex' : 'flex'
                    }`}
                >
                    <div className='p-4 sm:p-6 md:p-8 border-b border-cyan-500/5 bg-slate-950/40'>
                        <h2 className='text-lg sm:text-xl font-syne font-bold text-cyan-400 uppercase tracking-tighter'>
                            MESSAGES
                        </h2>
                    </div>
                    <div className='p-4 md:p-6 flex items-center border-b border-cyan-500/5 bg-slate-950/40'>
                        <label className='sr-only' htmlFor='pm-user-search'>
                            Search users
                        </label>
                        <input
                            id='pm-user-search'
                            type='search'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder='SEARCH USERS...'
                            autoComplete='off'
                            className='flex-1 min-w-0 bg-slate-900/50 border border-white/5 rounded-lg py-2.5 sm:py-3 px-3 sm:px-4 text-[9px] font-space tracking-widest focus:outline-none focus:border-cyan-500/20 transition-all uppercase placeholder:text-slate-800'
                        />
                    </div>
                    <div className='flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 scrollbar-hide min-h-0'>
                        {contactsLoading && !searchQuery.trim() && token && (
                            <div className='flex flex-col items-center justify-center py-12 gap-3'>
                                <div className='animate-spin rounded-full h-9 w-9 border-2 border-cyan-500/30 border-t-cyan-500' />
                                <p className='text-center text-[10px] font-space text-slate-600 uppercase tracking-widest'>
                                    Loading contacts...
                                </p>
                            </div>
                        )}
                        {!contactsLoading &&
                            contactsError &&
                            !searchQuery.trim() &&
                            token && (
                                <p className='text-center text-[10px] font-space text-red-500/80 py-8 px-2'>
                                    {contactsError}
                                </p>
                            )}
                        {!contactsLoading &&
                            !contactsError &&
                            !searchQuery.trim() &&
                            token &&
                            listContacts.length === 0 && (
                                <p className='text-center text-[10px] font-space text-slate-600 uppercase tracking-widest py-8 px-2'>
                                    No conversations yet
                                </p>
                            )}
                        {searching && searchQuery.trim() && (
                            <p className='text-center text-[10px] font-space text-slate-600 uppercase tracking-widest py-8'>
                                Searching...
                            </p>
                        )}
                        {!searching && searchError && searchQuery.trim() && (
                            <p className='text-center text-[10px] font-space text-red-500/80 py-6 px-2'>
                                {searchError}
                            </p>
                        )}
                        {!searching &&
                            searchQuery.trim() &&
                            !searchError &&
                            listContacts.length === 0 && (
                                <p className='text-center text-[10px] font-space text-slate-600 uppercase tracking-widest py-8'>
                                    No users found
                                </p>
                            )}
                        {!searching &&
                            !contactsLoading &&
                            !(contactsError && !searchQuery.trim() && token) &&
                            listContacts.map((u) => {
                                const unreadCount = !token
                                    ? MOCK_PMS.filter(
                                          (m) =>
                                              m.senderId === u.id &&
                                              m.receiverId === currentUserId &&
                                              !m.isRead
                                      ).length
                                    : 0;

                                return (
                                    <button
                                        key={u.id}
                                        type='button'
                                        onClick={() =>
                                            handleSelectConversation(u)
                                        }
                                        className={`w-full flex items-center p-4 rounded-2xl transition-all duration-300 border ${
                                            selectedUserId === u.id
                                                ? 'bg-cyan-500/10 border-cyan-500/20 shadow-[0_0_20px_rgba(0,210,255,0.05)]'
                                                : 'border-transparent hover:bg-slate-900/40'
                                        }`}
                                    >
                                        <div className='w-10 h-10 rounded-xl bg-slate-800 mr-4 overflow-hidden flex-shrink-0 border border-slate-700'>
                                            <img
                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.username)}`}
                                                alt={u.username}
                                            />
                                        </div>
                                        <div className='flex-1 text-left min-w-0'>
                                            <div className='flex justify-between items-center mb-0.5'>
                                                <span className='text-sm font-bold text-slate-200 truncate font-space tracking-tight'>
                                                    @{u.username}
                                                </span>
                                                {unreadCount > 0 && (
                                                    <span className='w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_8px_#06b6d4]'></span>
                                                )}
                                            </div>
                                            <p className='text-[10px] text-slate-500 font-space uppercase tracking-widest truncate'>
                                                {u.title ||
                                                    u.email ||
                                                    'OPERATIVE'}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                    </div>
                </div>

                {/* Chat Area — layout aligned with Community */}
                <div
                    className={`flex-1 flex flex-col min-w-0 min-h-0 bg-slate-950/20 border-l border-cyan-500/5 ${
                        mobilePanel === 'list' ? 'hidden md:flex' : 'flex'
                    }`}
                >
                    {selectedUser ? (
                        <>
                            <div className='p-4 sm:p-5 border-b border-cyan-500/5 bg-slate-950/60 flex flex-wrap justify-between items-center gap-2'>
                                <div className='flex items-center gap-2 min-w-0 flex-1'>
                                    <button
                                        type='button'
                                        onClick={() => setMobilePanel('list')}
                                        className='md:hidden p-2 rounded-lg border border-white/10 text-slate-400 hover:text-cyan-400 flex-shrink-0'
                                        aria-label='Back to conversations'
                                    >
                                        <svg
                                            className='w-5 h-5'
                                            fill='none'
                                            stroke='currentColor'
                                            viewBox='0 0 24 24'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth={2}
                                                d='M15 19l-7-7 7-7'
                                            />
                                        </svg>
                                    </button>
                                    <div className='w-10 h-10 rounded-xl bg-slate-800 overflow-hidden border border-slate-700 flex-shrink-0'>
                                        <img
                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(selectedUser.username)}`}
                                            alt={selectedUser.username}
                                        />
                                    </div>
                                    <div className='min-w-0'>
                                        <h3 className='text-sm sm:text-base font-syne font-bold text-slate-100 uppercase tracking-tighter truncate'>
                                            @{selectedUser.username}
                                        </h3>
                                        <div className='flex items-center gap-2 mt-0.5'>
                                            <span className='w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse flex-shrink-0'></span>
                                            <span className='text-[9px] font-space text-emerald-500/90 uppercase tracking-widest truncate'>
                                                Secure link ·{' '}
                                                {selectedUser.title ||
                                                    selectedUser.email ||
                                                    'OPERATIVE'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div
                                ref={scrollRef}
                                className='flex-1 overflow-y-auto p-4 sm:p-8 space-y-4 sm:space-y-6 scrollbar-hide'
                            >
                                {threadLoading && token && (
                                    <div className='flex flex-col items-center justify-center py-16 gap-3'>
                                        <div className='animate-spin rounded-full h-10 w-10 border-2 border-cyan-500/30 border-t-cyan-500' />
                                        <p className='text-[10px] font-space text-slate-600 uppercase tracking-widest'>
                                            Loading messages...
                                        </p>
                                    </div>
                                )}
                                {!threadLoading && threadError && token && (
                                    <p className='text-center text-[10px] font-space text-red-500/80 py-12 px-2'>
                                        {threadError}
                                    </p>
                                )}
                                {!threadLoading &&
                                    !threadError &&
                                    sortedThreadMessages.map((msg) => {
                                        const isOwnMessage =
                                            String(msg.senderEmail) ===
                                            String(authEmail);
                                        const senderLabel = isOwnMessage
                                            ? displayName ||
                                              authEmail?.split('@')[0] ||
                                              'You'
                                            : selectedUser.username;

                                        return (
                                            <div
                                                key={msg.id}
                                                className={`group animate-in fade-in duration-500 flex flex-col ${
                                                    isOwnMessage
                                                        ? 'items-end'
                                                        : ''
                                                }`}
                                            >
                                                <div className='flex flex-wrap items-center gap-x-3 gap-y-0.5 mb-1'>
                                                    <span className='font-bold text-xs text-cyan-400'>
                                                        @{senderLabel}
                                                    </span>
                                                    <span className='text-[8px] px-2 py-0.5 rounded border font-space uppercase tracking-wider bg-slate-950/80 text-slate-500 border-white/5'>
                                                        PM
                                                    </span>
                                                    <span className='text-[9px] text-slate-700 uppercase font-space tracking-tight'>
                                                        {formatTime(
                                                            msg.timestamp
                                                        )}
                                                    </span>
                                                </div>
                                                <div
                                                    className={`p-3 sm:p-4 rounded-2xl border transition-all duration-300 max-w-[85%] sm:max-w-[75%] md:max-w-[55%] relative ${
                                                        isOwnMessage
                                                            ? 'bg-cyan-500/5 border-cyan-500/20'
                                                            : 'bg-slate-900/60 border-white/5'
                                                    }`}
                                                >
                                                    <p className='text-slate-300 text-[14px] leading-relaxed font-light'>
                                                        {msg.content}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                {!threadLoading &&
                                    !threadError &&
                                    sortedThreadMessages.length === 0 && (
                                        <p className='text-center text-[10px] font-space text-slate-600 uppercase tracking-widest py-12'>
                                            No messages yet
                                        </p>
                                    )}
                            </div>

                            <div className='p-4 sm:p-6 border-t border-cyan-500/5 bg-slate-950/80 space-y-2'>
                                {messageError && (
                                    <p className='text-[10px] font-space text-red-500/90 text-center'>
                                        {messageError}
                                    </p>
                                )}
                                <form
                                    onSubmit={handleSendMessage}
                                    className='relative'
                                >
                                    <input
                                        value={inputText}
                                        onChange={(e) =>
                                            setInputText(e.target.value)
                                        }
                                        placeholder='Send Message'
                                        disabled={sendLoading}
                                        className='w-full bg-slate-900/40 border border-white/5 rounded-xl pl-4 pr-24 sm:px-6 py-3 sm:py-4 text-xs focus:outline-none focus:border-cyan-500/20 transition-all text-slate-200 placeholder:text-slate-800 font-light disabled:opacity-50'
                                    />
                                    <button
                                        type='submit'
                                        disabled={
                                            sendLoading || !inputText.trim()
                                        }
                                        className='absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 text-cyan-700 font-space text-[10px] font-bold tracking-widest hover:text-cyan-500 uppercase disabled:opacity-40 disabled:cursor-not-allowed'
                                    >
                                        {sendLoading ? '...' : 'SEND'}
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className='flex-1 flex flex-col items-center justify-center text-center space-y-4 px-6 opacity-40'>
                            <div className='w-16 h-16 rounded-3xl border-2 border-dashed border-slate-800 flex items-center justify-center'>
                                <span className='text-slate-600 text-2xl'>
                                    ?
                                </span>
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
        </main>
    );
};
