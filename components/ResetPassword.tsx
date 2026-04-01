import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import NeonButton from './NeonButton';
import { Input } from './Input';
import usePost from '../custom_hooks/usePost';
import { ADMIN_EMAIL } from '../constants';

/** Resolves to `.../api/v1/user/reset-password` for typical `VITE_API_URL` ending in `/api/v1`. */
function resetPasswordApiPath(): string {
    const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? '';
    if (base.endsWith('/api/v1')) {
        return '/user/reset-password';
    }
    return '/api/v1/user/reset-password';
}

const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const emailFromQuery = useMemo(
        () => searchParams.get('email') ?? '',
        [searchParams]
    );
    const tokenFromQuery = useMemo(
        () => searchParams.get('token') ?? '',
        [searchParams]
    );

    const [password, setPassword] = useState('');
    const [password_confirmation, setPasswordConfirmation] = useState('');
    const [isEmpty, setIsEmpty] = useState({
        password: false,
        password_confirmation: false
    });

    const { postData, loading, error } = usePost(resetPasswordApiPath());

    const missingLink = !emailFromQuery.trim() || !tokenFromQuery.trim();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsEmpty({
            password: !password,
            password_confirmation: !password_confirmation
        });
        if (!password || !password_confirmation) return;
        if (password !== password_confirmation) {
            return;
        }

        const res = await postData({
            email: emailFromQuery.trim(),
            token: tokenFromQuery.trim(),
            password,
            password_confirmation
        });
        if (res?.status) {
            navigate('/', { replace: true });
        }
    };

    return (
        <main className='relative z-10 mx-auto w-full max-w-md flex-1 px-4 py-12 sm:py-16'>
            <div className='glass-panel rounded-2xl sm:rounded-[3rem] border border-white/5 p-6 sm:p-12 shadow-2xl'>
                <div className='text-center mb-8'>
                    <h1 className='text-2xl font-syne font-bold text-cyan-400 tracking-tighter uppercase'>
                        Set new password
                    </h1>
                    <p className='text-slate-600 text-[10px] font-space font-bold mt-2.5 uppercase tracking-[0.35em]'>
                        Enter and confirm your new password
                    </p>
                </div>

                {missingLink ? (
                    <div className='space-y-6 text-center'>
                        <p className='text-sm text-slate-400 leading-relaxed'>
                            This link is missing a token or email. Open the
                            reset link from your email, or request a new one.
                        </p>
                        <Link
                            to='/forgot-password'
                            className='inline-block font-space text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-400 hover:text-cyan-300'
                        >
                            Request password reset
                        </Link>
                        <div>
                            <Link
                                to='/'
                                className='font-space text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-cyan-400'
                            >
                                Back to home
                            </Link>
                        </div>
                    </div>
                ) : (
                    <form className='space-y-6' onSubmit={handleSubmit}>
                        <p className='text-[10px] font-space text-slate-500 uppercase tracking-widest truncate'>
                            {emailFromQuery}
                        </p>
                        <Input
                            id='reset-password'
                            label='Password'
                            type='password'
                            value={password}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => setPassword(e.target.value)}
                            isRequired
                            isEmpty={isEmpty.password}
                        />
                        <Input
                            id='reset-password-confirmation'
                            label='Confirm password'
                            type='password'
                            value={password_confirmation}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => setPasswordConfirmation(e.target.value)}
                            isRequired
                            isEmpty={isEmpty.password_confirmation}
                        />
                        {password &&
                            password_confirmation &&
                            password !== password_confirmation && (
                                <p className='text-[13px] text-red-600'>
                                    Passwords do not match.
                                </p>
                            )}
                        <NeonButton
                            type='submit'
                            isLoading={loading}
                            loadingText='Saving…'
                            className='w-full py-5 text-sm mt-2'
                        >
                            Update password
                        </NeonButton>
                        {error && (
                            <p
                                className='text-[14px] text-red-600'
                                role='alert'
                            >
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
                )}

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

export default ResetPassword;
