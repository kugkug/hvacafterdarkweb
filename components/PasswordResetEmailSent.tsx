import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ADMIN_EMAIL } from '../constants';

const PasswordResetEmailSent: React.FC = () => {
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email')?.trim() ?? '';

    return (
        <main className='relative z-10 mx-auto w-full max-w-md flex-1 px-4 py-12 sm:py-16'>
            <div className='glass-panel rounded-2xl sm:rounded-[3rem] border border-white/5 p-6 sm:p-12 shadow-2xl text-center'>
                <div className='mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-950/40 text-cyan-400'>
                    <svg
                        className='h-7 w-7'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                        aria-hidden
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                        />
                    </svg>
                </div>

                <h1 className='text-2xl font-syne font-bold text-cyan-400 tracking-tighter uppercase'>
                    Check your email
                </h1>
                <p className='text-slate-600 text-[10px] font-space font-bold mt-3 uppercase tracking-[0.3em]'>
                    Password reset
                </p>

                <p className='mt-8 text-sm text-slate-300 leading-relaxed'>
                    If an account exists for that address, we sent a link to
                    reset your password.
                    {email ? (
                        <>
                            {' '}
                            <span className='text-cyan-400/90 break-all'>
                                {email}
                            </span>
                        </>
                    ) : null}
                </p>
                <p className='mt-4 text-[11px] text-slate-500 leading-relaxed'>
                    Open the link in the message to choose a new password. The
                    link may expire after a short time. Check your spam folder if
                    you do not see it.
                </p>

                <div className='mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4'>
                    <Link
                        to='/'
                        className='inline-block rounded-lg border border-cyan-500/30 bg-cyan-950/30 px-6 py-3 font-space text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400 transition-colors hover:border-cyan-400/50 hover:bg-cyan-950/50'
                    >
                        Back to home
                    </Link>
                    <Link
                        to='/forgot-password'
                        className='inline-block rounded-lg border border-white/10 px-6 py-3 font-space text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 transition-colors hover:border-slate-500/40 hover:text-slate-200'
                    >
                        Use another email
                    </Link>
                </div>

                <div className='text-center mt-12'>
                    <p className='text-[10px] text-slate-800 font-space font-bold uppercase tracking-[0.2em]'>
                        Contact Admin:{' '}
                        <span className='text-cyan-900'>{ADMIN_EMAIL}</span>
                    </p>
                </div>
            </div>
        </main>
    );
};

export default PasswordResetEmailSent;
