import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import useFetch from '../custom_hooks/useFetch';
import ConversationWindow from './ConversationWindow';
import InviteUserModal from './InviteUserModal';
import usePost from '../custom_hooks/usePost';
import { useAuth } from '../utilities/auth';

const Community = () => {
    const { user, token } = useAuth();
    const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
    const [chat, setChat] = useState([]);
    const [showConversationWindow, setShowConversationWindow] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [mobileRoomsOpen, setMobileRoomsOpen] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [conversationName, setConversationName] = useState<string | null>(
        null
    );
    const [conversationDescription, setConversationDescription] = useState<
        string | null
    >(null);

    const { data, isLoading, error, refetch } = useFetch(
        '/conversations/categorized'
    );

    const {
        data: conversationData,
        isLoading: conversationLoading,
        error: conversationError,
        refetch: refetchConversation
    } = useFetch(
        activeRoomId ? `/conversations/${activeRoomId}/messages` : '',
        null,
        !!activeRoomId
    );

    const {
        postData,
        loading,
        error: messageError,
        response: messageResponse
    } = usePost(`/conversations/${activeRoomId}/messages`);
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newMessage.trim()) return;
        const postResponse = await postData({
            body: newMessage
        });

        if (postResponse?.status === true) {
            setNewMessage('');
            await refetchConversation();
        }
    };

    const handlePurgeMessage = async (msg: { id: string | number }) => {
        if (!activeRoomId || !token) return;
        const apiUrl =
            import.meta.env.VITE_API_URL +
            `/conversations/${activeRoomId}/messages/${msg.id}`;
        try {
            await axios.delete(apiUrl, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            await refetchConversation();
        } catch (err) {
            console.error('Failed to delete message', err);
        }
    };

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (conversationData) {
            setConversationName(conversationData.conversation.name);
            setConversationDescription(
                conversationData.conversation.description
            );
        }
    }, [conversationData]);

    useEffect(() => {
        if (data && data.status === true) {
            setChat(data.data);
        }
    }, [data]);

    // Pusher/Reverb: subscribe to active conversation for real-time messages (private channel)
    useEffect(() => {
        if (!window.Echo || !activeRoomId) return;

        const channel = window.Echo.private(`conversation.${activeRoomId}`);
        channel.listen('.message.sent', () => {
            refetchConversation();
        });
        return () => {
            window.Echo?.leave(`conversation.${activeRoomId}`);
        };
    }, [activeRoomId, refetchConversation]);

    // Pusher: subscribe to community channel for new conversations
    useEffect(() => {
        if (!window.Echo) return;

        const channel = window.Echo.channel('community');

        channel.listen('.conversation.created', () => {
            refetch();
        });

        return () => {
            window.Echo?.leave('community');
        };
    }, [refetch]);

    useEffect(() => {
        if (scrollRef.current)
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [conversationData, activeRoomId]);

    return (
        <main className='relative z-10 w-full max-w-[1400px] mx-auto px-4 py-6 sm:p-6 md:p-12 min-w-0'>
            <div className='flex flex-col md:flex-row h-[75vh] sm:h-[82vh] glass-panel rounded-2xl sm:rounded-3xl border border-white/5 shadow-2xl bg-slate-950/40 overflow-hidden'>
                <div className='flex-1 flex flex-col min-w-0 min-h-0'>
                    <div className='p-4 sm:p-5 border-b border-white/5 bg-slate-950/60 flex flex-wrap justify-between items-center gap-2'>
                        <div className='flex items-center gap-2 min-w-0 flex-1'>
                            <button
                                type='button'
                                onClick={() => setMobileRoomsOpen(true)}
                                className='md:hidden p-2 rounded-lg border border-white/10 text-slate-400 hover:text-cyan-400 flex-shrink-0'
                                aria-label='Open rooms'
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
                                        d='M4 6h16M4 12h16M4 18h16'
                                    />
                                </svg>
                            </button>
                            <div className='min-w-0'>
                                <h2 className='text-sm sm:text-base font-syne font-bold text-slate-100 uppercase tracking-tighter truncate'>
                                    #{conversationName || 'Community'}
                                </h2>
                                <p className='text-[9px] text-slate-600 font-space uppercase tracking-[0.2em] mt-0.5 truncate'>
                                    {conversationDescription || 'Select a room'}
                                </p>
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <button
                                onClick={() => setShowInviteModal(true)}
                                className='py-2 sm:py-2.5 px-3 sm:px-4 bg-slate-900/40 border border-white/5 rounded-xl text-[9px] font-space font-bold text-slate-400 hover:text-cyan-400 hover:border-cyan-500/20 transition-all uppercase tracking-[0.2em]'
                            >
                                + Invite
                            </button>
                        </div>
                    </div>

                    <div
                        ref={scrollRef}
                        className='flex-1 overflow-y-auto p-4 sm:p-8 space-y-4 sm:space-y-6 scrollbar-hide'
                    >
                        {conversationData?.data.map((msg: any) => {
                            const isOwnMessage = user === msg.user?.email;
                            return (
                                <div
                                    key={msg.id}
                                    className={`group animate-in fade-in duration-500 flex flex-col ${
                                        isOwnMessage ? 'items-end' : ''
                                    }`}
                                >
                                    <div className='flex flex-wrap items-center gap-x-3 gap-y-0.5 mb-1'>
                                        <span className='font-bold text-xs text-cyan-400'>
                                            @{msg.user.name}
                                        </span>
                                        <span className='text-[8px] px-2 py-0.5 rounded border font-space uppercase tracking-wider bg-slate-950/80'>
                                            Role
                                        </span>
                                        <span className='text-[9px] text-slate-700 uppercase font-space tracking-tight'>
                                            {msg.created_time} |{' '}
                                            {msg.created_date}
                                        </span>
                                        {msg.isEdited && (
                                            <span className='text-[8px] text-slate-700 italic font-space'>
                                                (edited)
                                            </span>
                                        )}
                                    </div>
                                    <div className='p-3 sm:p-4 rounded-2xl border transition-all duration-300 bg-slate-900/60 border-white/5 max-w-[85%] sm:max-w-[75%] md:max-w-[45%] relative'>
                                        {msg.isDeleted ? (
                                            <p className='text-slate-700 italic text-xs font-light'>
                                                Content purged by system
                                                protocol.
                                            </p>
                                        ) : (
                                            <p className='text-slate-300 text-[14px] leading-relaxed font-light'>
                                                {msg.body}
                                            </p>
                                        )}
                                    </div>

                                    {!msg.isDeleted && (
                                        <div className='flex items-center mt-2 space-x-4 opacity-0 group-hover:opacity-100 transition-all'>
                                            {msg.user.email === user && (
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            setNewMessage(
                                                                msg.body
                                                            );
                                                        }}
                                                        className='text-[9px] text-amber-500/60 hover:text-amber-500 uppercase font-space tracking-widest font-bold'
                                                    >
                                                        EDIT
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handlePurgeMessage(
                                                                msg
                                                            )
                                                        }
                                                        className='text-[9px] text-red-500/60 hover:text-red-500 uppercase font-space tracking-widest font-bold'
                                                    >
                                                        DELETE
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {activeRoomId && (
                        <>
                            <div className='p-4 sm:p-6 border-t border-white/5 bg-slate-950/80'>
                                <form
                                    onSubmit={handleSendMessage}
                                    className='relative'
                                >
                                    <input
                                        value={newMessage}
                                        onChange={(e) =>
                                            setNewMessage(e.target.value)
                                        }
                                        placeholder='Send Message'
                                        className='w-full bg-slate-900/40 border border-white/5 rounded-xl pl-4 pr-20 sm:px-6 py-3 sm:py-4 text-xs focus:outline-none focus:border-cyan-500/20 transition-all text-slate-200 placeholder:text-slate-800 font-light'
                                    />
                                    <button
                                        type='submit'
                                        className='absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 text-cyan-700 font-space text-[10px] font-bold tracking-widest hover:text-cyan-500 uppercase'
                                    >
                                        SEND
                                    </button>
                                </form>
                            </div>
                        </>
                    )}
                </div>

                {/* RIGHT: Rooms & Categories — sidebar on desktop, drawer on mobile */}
                <div
                    className={`
                        md:w-64 flex-shrink-0 flex flex-col border-t md:border-t-0 md:border-l border-white/5 bg-slate-950/60
                        ${mobileRoomsOpen ? 'fixed inset-0 z-50 md:relative md:inset-auto flex' : 'hidden md:flex'}
                    `}
                >
                    <div className='p-4 md:p-6 flex items-center justify-between border-b md:border-b-0 border-white/5'>
                        <input
                            type='text'
                            placeholder='SEARCH NODES...'
                            className='flex-1 min-w-0 bg-slate-900/50 border border-white/5 rounded-lg py-2.5 sm:py-3 px-3 sm:px-4 text-[9px] font-space tracking-widest focus:outline-none focus:border-cyan-500/20 transition-all uppercase placeholder:text-slate-800'
                        />
                        <button
                            type='button'
                            onClick={() => setMobileRoomsOpen(false)}
                            className='md:hidden ml-2 p-2 rounded-lg border border-white/10 text-slate-400 hover:text-white'
                            aria-label='Close rooms'
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
                                    d='M6 18L18 6M6 6l12 12'
                                />
                            </svg>
                        </button>
                    </div>

                    <div className='flex-1 overflow-y-auto px-4 md:px-6 space-y-6 scrollbar-hide pb-6'>
                        {chat &&
                            chat.map((chat: any) => (
                                <div
                                    key={chat?.category?.id}
                                    className='space-y-2'
                                >
                                    <h4 className='text-[9px] font-space text-slate-700 uppercase tracking-[0.3em] font-bold'>
                                        {chat?.category?.name}
                                    </h4>
                                    <div className='space-y-1'>
                                        {chat.conversations &&
                                            chat.conversations.map(
                                                (conversation: any) => (
                                                    <button
                                                        key={conversation.id}
                                                        onClick={() => {
                                                            setActiveRoomId(
                                                                conversation.id
                                                            );
                                                            setMobileRoomsOpen(
                                                                false
                                                            );
                                                        }}
                                                        className={`w-full text-left py-2 px-3 rounded-lg text-[11px] transition-all duration-300 flex items-center justify-between ${
                                                            activeRoomId ===
                                                            conversation.id
                                                                ? 'bg-cyan-500/5 text-cyan-400 border border-cyan-500/10'
                                                                : 'text-slate-600 hover:text-slate-400'
                                                        }`}
                                                    >
                                                        <span className='truncate'>
                                                            #{' '}
                                                            {conversation.name}
                                                        </span>
                                                    </button>
                                                )
                                            )}
                                    </div>
                                </div>
                            ))}
                    </div>

                    <div className='p-4 md:p-6 border-t border-white/5 bg-slate-950/60 space-y-3'>
                        <button
                            onClick={() => {
                                setShowConversationWindow(true);
                                setMobileRoomsOpen(false);
                            }}
                            className='w-full py-3 sm:py-4 bg-slate-900/40 border border-white/5 rounded-xl text-[9px] font-space font-bold text-slate-700 hover:text-cyan-500 transition-all uppercase tracking-[0.2em]'
                        >
                            + CREATE CHAT ROOM
                        </button>
                    </div>
                </div>
                {mobileRoomsOpen && (
                    <div
                        className='fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden'
                        onClick={() => setMobileRoomsOpen(false)}
                        aria-hidden
                    />
                )}
            </div>
            {showConversationWindow && (
                <ConversationWindow
                    onClose={() => setShowConversationWindow(false)}
                    refetchConversation={refetch}
                />
            )}
            {showInviteModal && (
                <InviteUserModal
                    onClose={() => setShowInviteModal(false)}
                    token={token}
                    conversationId={activeRoomId}
                />
            )}
        </main>
    );
};

export default Community;
