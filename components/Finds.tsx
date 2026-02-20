import React, { useEffect, useState } from 'react';
import { useAuth } from '../utilities/auth';
import axios from 'axios';
import useFetch from '../custom_hooks/useFetch';

const Finds = () => {
    const { token, user } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [finds, setFinds] = useState([]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;
        setUploading(true);

        const formData = new FormData();

        formData.append('image', file);
        formData.append('user_id', user || '');
        formData.append('image_type', 'find');
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
            setUploading(false);
            refetch();
        } catch (error) {
            setUploading(false);
            console.error(error);
        }
    };

    const { data, isLoading, error, refetch } = useFetch('/images/find');

    const loadFinds = () => {
        const findsData = data?.data.data;
        const items = findsData?.map((p: any) => {
            return {
                id: p.id,
                image_url: p.s3_url,
                username: p.user.name
            };
        });
        setFinds(items || []);
    };

    useEffect(() => {
        loadFinds();
    }, [data]);

    return (
        <div className='min-h-screen bg-[#020617] text-slate-200 selection:bg-cyan-500/40 relative'>
            <main className='relative z-10 max-w-[1400px] mx-auto p-6 md:p-12'>
                <div className='space-y-12 animate-in fade-in duration-700'>
                    <div className='flex justify-between items-center border-b border-white/5 pb-8'>
                        <div className='space-y-1'>
                            <h2 className='text-3xl font-syne font-bold text-slate-100 tracking-tighter uppercase'>
                                Mechanical Finds
                            </h2>
                            <p className='text-[9px] font-space text-slate-600 uppercase tracking-[0.4em] font-bold'>
                                Evidence of Installation Madness
                            </p>
                        </div>
                        <label
                            className={`cursor-pointer bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-xl font-space font-bold text-[10px] transition-all shadow-xl uppercase tracking-widest text-white`}
                        >
                            {uploading ? 'UPLOADING...' : `SUBMIT FIND`}
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
                                <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500'></div>
                            </div>
                        ) : (
                            finds?.map((p: any) => (
                                <div
                                    key={p.id}
                                    className={`glass-panel p-4 rounded-[2rem] border-white/5 group overflow-hidden relative transition-all duration-700 hover:border-purple-500/20`}
                                >
                                    <img
                                        src={p.image_url}
                                        className='w-full h-64 object-cover rounded-2xl mb-4 group-hover:scale-105 transition-transform duration-1000 opacity-60 group-hover:opacity-100'
                                    />
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

export default Finds;
