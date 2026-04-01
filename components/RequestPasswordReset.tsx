import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NeonButton from './NeonButton';
import { Input } from './Input';
import usePost from '../custom_hooks/usePost';
import { ADMIN_EMAIL } from '../constants';

function forgotPasswordApiPath(): string {
    const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? '';
    if (base.endsWith('/api/v1')) {
        return '/user/forgot-password';
    }
    return '/api/v1/user/forgot-password';
}

const RequestPasswordReset: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isEmpty, setIsEmpty] = useState(false);
    const { postData, loading, error } = usePost(forgotPasswordApiPath());

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = email.trim();
        if (!trimmed) {
            setIsEmpty(true);
            return;
        }
        setIsEmpty(false);
        const res = await postData({ email: trimmed });
        if (res?.status) {
            navigate(
                `/forgot-password/sent?email=${encodeURIComponent(trimmed)}`
            );
        }
    };

    return (
        <main className='relative z-10 mx-auto w-full max-w-md flex-1 px-4 py-12 sm:py-16'>
            <div className='glass-panel rounded-2xl sm:rounded-[3rem] border border-white/5 p-6 sm:p-12 shadow-2xl'>
                <div className='text-center mb-8'>
                    <h1 className='text-2xl font-syne font-bold text-cyan-400 tracking-tighter uppercase'>
                        Reset password
                    </h1>
                    <p className='text-slate-600 text-[10px] font-space font-bold mt-2.5 uppercase tracking-[0.35em]'>
                        Enter your email to continue
                    </p>
                </div>

                <form className='space-y-6' onSubmit={handleSubmit}>
                    <Input
                        id='reset-email'
                        label='Email'
                        type='email'
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setEmail(e.target.value)
                        }
                        isRequired
                        isEmpty={isEmpty}
                    />
                    <NeonButton
                        type='submit'
                        isLoading={loading}
                        loadingText='Sending…'
                        className='w-full py-5 text-sm mt-2'
                    >
                        Continue
                    </NeonButton>
                    {error && (
                        <p className='text-[14px] text-red-600' role='alert'>
                            {error}
                        </p>
                    )}
                    <div className='text-center pt-2'>
                        <Link
                            to='/'
                            className='font-space text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-cyan-400 transition-colors'
                        >
                            Back to home
                        </Link>
                    </div>
                </form>

                <div className='text-center mt-10'>
                    <p className='text-[10px] text-slate-800 font-space font-bold uppercase tracking-[0.2em]'>
                        Contact Admin:{' '}
                        <span className='text-cyan-900'>{ADMIN_EMAIL}</span>
                    </p>
                </div>
            </div>
        </main>
    );
};

export default RequestPasswordReset;
