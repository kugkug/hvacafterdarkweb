import React, { useEffect, useState } from 'react';
import { MOCK_MEMES } from '../constants';
import { Post } from '../types';
import { checkContentSafety } from '../services/geminiService';
import { useAuth } from '../utilities/auth';
import usePost from '../custom_hooks/usePost';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useFetch from '../custom_hooks/useFetch';

const Memes = () => {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);
    const [memes, setMemes] = useState([]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;
        setUploading(true);

        const formData = new FormData();

        formData.append('image', file);
        formData.append('user_id', user || '');
        formData.append('image_type', 'meme');
        try {
            const response = await axios.post(
                import.meta.env.VITE_API_URL + '/images/upload',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            console.log(response);
            setUploading(false);
            refetch();
        } catch (error) {
            setUploading(false);
            console.error(error);
        }
    };

    // const loadImage = () => {
    const { data, isLoading, error, refetch } = useFetch('/images/meme', {
        image_type: 'meme'
    });

    const loadImage = () => {
        const memesData = data?.data.data;
        const memes = memesData?.map((p: any) => {
            return {
                id: p.id,
                image_url: p.s3_url,
                username: p.user.name
            };
        });
        setMemes(memes || []);
    };

    useEffect(() => {
        loadImage();
    }, [data]);

    return (
        <div className='min-h-screen bg-[#020617] text-slate-200 selection:bg-cyan-500/40 relative'>
            <main className='relative z-10 max-w-[1400px] mx-auto p-6 md:p-12'>
                <div className='space-y-12 animate-in fade-in duration-700'>
                    <div className='flex justify-between items-center border-b border-white/5 pb-8'>
                        <div className='space-y-1'>
                            <h2 className='text-3xl font-syne font-bold text-slate-100 tracking-tighter uppercase'>
                                The Meme Lab
                            </h2>
                            <p className='text-[9px] font-space text-slate-600 uppercase tracking-[0.4em] font-bold'>
                                Systematic Humor Transmissions
                            </p>
                        </div>
                        <label
                            className={`cursor-pointer bg-cyan-600 hover:bg-cyan-500 px-6 py-3 rounded-xl font-space font-bold text-[10px] transition-all shadow-xl uppercase tracking-widest text-white`}
                        >
                            {uploading ? 'UPLOADING...' : `UPLOAD MEME`}
                            <input
                                type='file'
                                hidden
                                accept='image/*'
                                onChange={(e) => handleUpload(e)}
                                disabled={uploading}
                            />
                        </label>
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10'>
                        {isLoading ? (
                            <div className='flex justify-center items-center h-full'>
                                <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500'></div>
                            </div>
                        ) : (
                            memes?.map((p: any) => (
                                <div
                                    key={p.id}
                                    className={`glass-panel p-4 rounded-[2rem] border-white/5 group overflow-hidden relative transition-all duration-700 hover:border-cyan-500/20`}
                                >
                                    <img
                                        src={p.image_url}
                                        className='w-full h-64 object-cover rounded-2xl mb-4 group-hover:scale-105 transition-transform duration-1000 opacity-60 group-hover:opacity-100'
                                    />
                                    {/* <p className='text-sm text-slate-400 mb-4 px-2 italic font-light'>
                                    "{p.caption}"</p> 
                                    */}
                                    <div className='flex justify-between items-center text-[9px] font-space font-bold text-slate-600 px-2 uppercase tracking-widest pt-3 border-t border-white/5'>
                                        <span className='hover:text-cyan-400 transition-colors cursor-pointer'>
                                            @{p.username}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Memes;
