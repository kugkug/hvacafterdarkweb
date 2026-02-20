import { useEffect, useRef, useState } from 'react';
import useFetch from '../custom_hooks/useFetch';
import ConversationWindow from './ConversationWindow';
import usePost from '../custom_hooks/usePost';
import { useAuth } from '../utilities/auth';

const Community = () => {
    const { user } = useAuth();
    const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
    const [chat, setChat] = useState([]);
    const [showConversationWindow, setShowConversationWindow] = useState(false);
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

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log(conversationData);
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
            console.log('message.sent');
            refetchConversation();
        });

        return () => {
            window.Echo?.leave(`private-conversation.${activeRoomId}`);
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
        <main className='relative z-10 max-w-[1400px] mx-auto p-6 md:p-12'>
            <div className='flex h-[82vh] glass-panel rounded-3xl border border-white/5 shadow-2xl bg-slate-950/40 overflow-hidden'>
                <div className='flex-1 flex flex-col min-w-0'>
                    <div className='p-5 border-b border-white/5 bg-slate-950/60 flex justify-between items-center'>
                        <div>
                            <h2 className='text-base font-syne font-bold text-slate-100 uppercase tracking-tighter'>
                                #{conversationName}
                            </h2>
                            <p className='text-[9px] text-slate-600 font-space uppercase tracking-[0.2em] mt-0.5'>
                                {conversationDescription}
                            </p>
                        </div>
                        <div className='flex items-center space-x-4'></div>
                    </div>

                    <div
                        ref={scrollRef}
                        className='flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide'
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
                                    <div className='flex items-center space-x-3 mb-1'>
                                        <span className='font-bold text-xs text-cyan-400'>
                                            @{msg.user.name}
                                        </span>
                                        <span
                                            className={`text-[8px] px-2 py-0.5 rounded border font-space uppercase tracking-wider bg-slate-950/80`}
                                        >
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
                                    <div
                                        className={`p-4 rounded-2xl border transition-all duration-300 bg-slate-900/60 border-white/5  max-w-[45%] relative`}
                                    >
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
                                            <button
                                                // onClick={() => setReplyTo(msg)}
                                                className='text-[9px] text-slate-600 hover:text-cyan-400 uppercase font-space tracking-widest font-bold'
                                            >
                                                REPLY
                                            </button>
                                            <button
                                                // onClick={() =>
                                                //     handleThumbUp(msg.id)
                                                // }
                                                className={`text-[9px] uppercase font-space tracking-widest flex items-center space-x-1`}
                                            >
                                                <span className='font-bold'>
                                                    HELPFUL
                                                </span>
                                                <span className='text-emerald-500 font-bold opacity-80'>
                                                    👍{' '}
                                                    {/* {msg.thumbsUps.length || ''} */}
                                                </span>
                                            </button>
                                            {/* {canModify(msg) && ( */}
                                            <button
                                                // onClick={() => {
                                                //     setInputText(
                                                //         msg.content
                                                //     );
                                                //     setEditingMessageId(
                                                //         msg.id
                                                //     );
                                                // }}
                                                className='text-[9px] text-amber-500/60 hover:text-amber-500 uppercase font-space tracking-widest font-bold'
                                            >
                                                EDIT
                                            </button>
                                            {/* )} */}
                                            {/* {(user.role === 'ADMIN' ||
                                                user.role === 'MODERATOR') && ( */}
                                            <button
                                                // onClick={() =>
                                                //     handlePurgeMessage(msg)
                                                // }
                                                className='text-[9px] text-red-500/60 hover:text-red-500 uppercase font-space tracking-widest font-bold'
                                            >
                                                PURGE
                                            </button>
                                            {/* )} */}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className='p-6 border-t border-white/5 bg-slate-950/80'>
                        <form onSubmit={handleSendMessage} className='relative'>
                            <input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder='Send Message'
                                className='w-full bg-slate-900/40 border border-white/5 rounded-xl px-6 py-4 text-xs focus:outline-none focus:border-cyan-500/20 transition-all text-slate-200 placeholder:text-slate-800 font-light'
                            />
                            <button
                                type='submit'
                                className='absolute right-6 top-1/2 -translate-y-1/2 text-cyan-700 font-space text-[10px] font-bold tracking-widest hover:text-cyan-500 uppercase'
                            >
                                SEND
                            </button>
                        </form>
                    </div>
                </div>

                {/* RIGHT: Rooms & Categories */}
                <div className='w-64 border-l border-white/5 bg-slate-950/60 flex flex-col'>
                    <div className='p-6'>
                        <input
                            type='text'
                            placeholder='SEARCH NODES...'
                            className='w-full bg-slate-900/50 border border-white/5 rounded-lg py-3 px-4 text-[9px] font-space tracking-widest focus:outline-none focus:border-cyan-500/20 transition-all uppercase placeholder:text-slate-800'
                        />
                    </div>
                    <div className='flex-1 overflow-y-auto px-6 space-y-6 scrollbar-hide pb-6'>
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
                                                        onClick={() =>
                                                            setActiveRoomId(
                                                                conversation.id
                                                            )
                                                        }
                                                        className={`w-full text-left py-2 px-3 rounded-lg text-[11px] transition-all duration-300 flex items-center justify-between ${
                                                            activeRoomId ===
                                                            conversation.id
                                                                ? 'bg-cyan-500/5 text-cyan-400 border border-cyan-500/10'
                                                                : 'text-slate-600 hover:text-slate-400'
                                                        }`}
                                                    >
                                                        <span>
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

                    <div className='p-6 border-t border-white/5 bg-slate-950/60'>
                        <button
                            onClick={() => setShowConversationWindow(true)}
                            className='w-full py-4 bg-slate-900/40 border border-white/5 rounded-xl text-[9px] font-space font-bold text-slate-700 hover:text-cyan-500 transition-all uppercase tracking-[0.2em]'
                        >
                            + CREATE CHAT ROOM
                        </button>
                    </div>
                </div>
            </div>
            {showConversationWindow && (
                <ConversationWindow
                    onClose={() => setShowConversationWindow(false)}
                    refetchConversation={refetch}
                />
            )}
        </main>
    );
};

export default Community;
