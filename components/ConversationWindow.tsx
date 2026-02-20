import React, { useEffect, useState } from 'react';
import { NeonButton } from './NeonButton';
import { Input } from './Input';
import { SimpleButton } from './SimpleButton';
import { ADMIN_EMAIL } from '../constants';
import useFetch from '../custom_hooks/useFetch';
import { Select } from './Select';
import usePost from '../custom_hooks/usePost';

const ConversationWindow = ({
    onClose,
    refetchConversation
}: {
    onClose: () => void;
    refetchConversation: () => void;
}) => {
    const { data, isLoading, error, refetch } = useFetch('/categories');
    console.log(data);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState<any[]>([]);
    const [type, setType] = useState('group');

    const {
        postData,
        loading,
        error: postError,
        response: postResponse
    } = usePost('/conversations');

    const handleCreateChatRoom = async (
        e: React.MouseEvent<HTMLButtonElement>
    ) => {
        e.preventDefault();
        console.log({
            type,
            name,
            description,
            category_id: categoryId
        });
        const postResponse = await postData({
            type,
            name,
            description,
            category_id: categoryId
        });

        if (postResponse?.status === true) {
            onClose();
            refetchConversation();
        }
    };

    useEffect(() => {
        if (data && data.status === true) {
            if (data.data.length > 0) {
                setCategoryId(data.data[0].id);
            }
            setCategories(data.data);
        }
    }, [data]);
    return (
        <div className='fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/98 backdrop-blur-3xl animate-in fade-in duration-500'>
            <div className='glass-panel w-full max-w-[600px] p-12 rounded-[3rem] border-white/5 relative shadow-2xl overflow-hidden'>
                <SimpleButton
                    onClose={onClose}
                    className='absolute top-8 right-8 text-slate-700 hover:text-white transition-colors'
                />
                <div className='text-center mb-10'>
                    <h2 className='text-2xl font-syne font-bold text-cyan-400 tracking-tighter uppercase'>
                        Create Chat Room
                    </h2>
                    <p className='text-slate-700 text-[10px] font-space font-bold mt-2.5 uppercase tracking-[0.5em]'>
                        Create a new chat room for your community.
                    </p>
                </div>

                <form className='space-y-6'>
                    <Input
                        id='name'
                        label='Name'
                        type='text'
                        isRequired={true}
                        value={name}
                        onChange={(e: any) => setName(e.target.value)}
                    />
                    <Input
                        id='description'
                        label='Description'
                        type='text'
                        isRequired={true}
                        value={description}
                        onChange={(e: any) => setDescription(e.target.value)}
                    />

                    <Select
                        id='category_id'
                        label='Category'
                        isRequired={true}
                        value={categoryId}
                        onChange={(e: any) => setCategoryId(e.target.value)}
                        options={categories}
                    />

                    <NeonButton
                        type='submit'
                        onClick={handleCreateChatRoom}
                        className='w-full py-5 text-sm mt-4'
                    >
                        Create Chat Room
                    </NeonButton>
                </form>
                <div className='text-center mt-10'>
                    <p className='text-[10px] text-slate-800 font-space font-bold uppercase tracking-[0.2em]'>
                        Contact Admin:{' '}
                        <span className='text-cyan-900'>{ADMIN_EMAIL}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ConversationWindow;
