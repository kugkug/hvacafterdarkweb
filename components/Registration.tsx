import React, { useState } from 'react';
import { NeonButton } from './NeonButton';
import { Input } from './Input';

import { ADMIN_EMAIL } from '../constants';
import { SimpleButton } from './SimpleButton';
import usePost from '../custom_hooks/usePost';
import { useAuth } from '../utilities/auth';

interface Props {
    onClose?: () => void;
    onCancel: () => void;
}

const Registration = ({ onClose, onCancel }: Props) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password_confirmation, setConfirmPassword] = useState('');
    const auth = useAuth();

    const { postData, loading, error, response } = usePost('/user/create');

    const [isEmpty, setIsEmpty] = useState({
        name: false,
        email: false,
        password: false,
        password_confirmation: false
    });

    const handleRegistration = async (
        e: React.MouseEvent<HTMLButtonElement>
    ) => {
        e.preventDefault();

        setIsEmpty({
            name: !name,
            email: !email,
            password: !password,
            password_confirmation: !password_confirmation
        });

        if (!name || !email || !password || !password_confirmation) {
            return;
        }

        const registrationData = {
            name,
            email,
            password,
            password_confirmation
        };

        const registrationResponse = await postData(registrationData);

        if (registrationResponse?.status && registrationResponse?.token) {
            auth.login(
                email,
                registrationResponse.token,
                registrationResponse.name
            );
            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            onClose?.();
        }
    };

    return (
        <div className='fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/98 backdrop-blur-3xl animate-in fade-in duration-500'>
            <div className='glass-panel w-full max-w-md p-12 rounded-[3rem] border-white/5 relative shadow-2xl overflow-hidden'>
                <SimpleButton
                    onClose={onClose}
                    className='absolute top-8 right-8 text-slate-700 hover:text-white transition-colors'
                />
                <form className='space-y-6'>
                    <Input
                        id='name'
                        label='Name'
                        type='text'
                        isRequired={true}
                        value={name}
                        onChange={(e: any) => setName(e.target.value)}
                        isEmpty={isEmpty.name}
                    />
                    <Input
                        id='email'
                        label='Email Credential'
                        type='text'
                        isRequired={true}
                        value={email}
                        onChange={(e: any) => setEmail(e.target.value)}
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

                    <Input
                        id='password_confirmation'
                        label='Confirm Password'
                        type='password'
                        isRequired={true}
                        value={password_confirmation}
                        onChange={(e: any) =>
                            setConfirmPassword(e.target.value)
                        }
                        isEmpty={isEmpty.password_confirmation}
                    />

                    <NeonButton
                        isLoading={loading}
                        loadingText='In Progress...'
                        onClick={handleRegistration}
                        type='submit'
                        className='w-full py-5 text-sm mt-4'
                    >
                        SIGN UP
                    </NeonButton>
                    <NeonButton
                        onClick={() => onCancel()}
                        className='w-full py-5 text-sm mt-4'
                    >
                        BACK TO LOG IN
                    </NeonButton>

                    {error && (
                        <p className='transition-all duration-100 text-[14px] text-red-600'>
                            {error}
                        </p>
                    )}
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

export default Registration;
