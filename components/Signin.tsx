import React, { useEffect, useState } from 'react';

import NeonButton from './NeonButton';
import { ADMIN_EMAIL } from '../constants';
import { SimpleButton } from './SimpleButton';
import { useAuth } from '../utilities/auth';
import { Input } from './Input';
import usePost from '../custom_hooks/usePost';
import { useNavigate } from 'react-router-dom';

interface Props {
    onClose: () => void;
    onClick?: () => void;
}

const Sigin = ({ onClose, onClick }: Props) => {
    const { postData, loading, error, response } = usePost('/user/login');

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isEmpty, setIsEmpty] = useState({
        email: false,
        password: false
    });

    const auth = useAuth();

    const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        setIsEmpty({
            email: !email,
            password: !password
        });

        if (!email || !password) {
            return;
        }

        const postResponse = await postData({
            email,
            password
        });

        if (postResponse?.status && postResponse?.token && postResponse?.name) {
            auth.login(email, postResponse.token, postResponse.name);
            setEmail('');
            setPassword('');
            onClose();
        }
    };

    return (
        <div className='fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/98 backdrop-blur-3xl animate-in fade-in duration-500'>
            <div className='glass-panel w-full max-w-md p-12 rounded-[3rem] border-white/5 relative shadow-2xl overflow-hidden'>
                <SimpleButton
                    onClose={onClose}
                    className='absolute top-8 right-8 text-slate-700 hover:text-white transition-colors'
                />
                <div className='text-center mb-10'>
                    <h2 className='text-2xl font-syne font-bold text-cyan-400 tracking-tighter uppercase'>
                        login
                    </h2>
                    <p className='text-slate-700 text-[10px] font-space font-bold mt-2.5 uppercase tracking-[0.5em]'>
                        Terminal Entry Protocol
                    </p>
                </div>

                <form className='space-y-6'>
                    <Input
                        id='email'
                        label='Email'
                        type='email'
                        value={email}
                        onChange={(e: any) => setEmail(e.target.value)}
                        isRequired={true}
                        isEmpty={isEmpty.email}
                    />

                    <Input
                        id='password'
                        label='Password'
                        type='password'
                        isRequired={true}
                        value={password}
                        onChange={(e: any) => setPassword(e.target.value)}
                        isEmpty={isEmpty.password}
                    />

                    <NeonButton
                        isLoading={loading}
                        type='submit'
                        className='w-full py-5 text-sm mt-4'
                        loadingText='Validating Credentials...'
                        onClick={handleLogin}
                    >
                        PUNCH CLOCK
                    </NeonButton>
                    {error && (
                        <p className='transition-all duration-100 text-[14px] text-red-600'>
                            {error}
                        </p>
                    )}
                    <NeonButton
                        onClick={() => {
                            onClose();
                            onClick?.();
                        }}
                        className='w-full py-5 text-sm mt-4'
                    >
                        REGISTER
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

export default Sigin;
