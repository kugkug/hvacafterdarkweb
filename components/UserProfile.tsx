import { useState } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../custom_hooks/useFetch';
import { useAuth } from '../utilities/auth';
import { UserMeInfo, MePayload } from './UserMeInfo';
import ProfileEditForm from './ProfileEditForm';

function unwrapMe(data: unknown): MePayload | null {
    if (!data || typeof data !== 'object') return null;
    const d = data as Record<string, unknown>;
    if (d.data && typeof d.data === 'object') return d.data as MePayload;
    if (d.user && typeof d.user === 'object') return d.user as MePayload;
    return d as MePayload;
}

const UserProfile = () => {
    const {
        token,
        isAuthenticated,
        isLoading: authLoading,
        user,
        login
    } = useAuth();
    const { data, isLoading, error, refetch } = useFetch(
        '/user/me',
        null,
        !!token
    );

    const me = unwrapMe(data);
    const [isEditing, setIsEditing] = useState(false);

    const handleProfileSaved = (newName: string) => {
        void refetch();
        if (user && token) login(user, token, newName);
        setIsEditing(false);
    };

    if (authLoading) {
        return (
            <div className='flex min-h-[50vh] items-center justify-center px-4'>
                <p className='font-space text-[10px] font-bold uppercase tracking-[0.35em] text-slate-500'>
                    Loading…
                </p>
            </div>
        );
    }

    if (!isAuthenticated || !token) {
        return (
            <div className='mx-auto max-w-lg px-4 py-16 text-center'>
                <h1 className='font-syne text-2xl font-bold text-slate-200'>
                    Account
                </h1>
                <p className='mt-4 text-sm text-slate-500'>
                    Sign in from the home page to view your profile.
                </p>
                <Link
                    to='/'
                    className='mt-8 inline-block font-space text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-400 hover:text-cyan-300'
                >
                    ← Back to home
                </Link>
            </div>
        );
    }

    return (
        <div className='mx-auto w-full max-w-2xl px-4 py-10 sm:px-6'>
            <div className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
                <div>
                    <h1 className='font-syne text-3xl font-bold tracking-tight text-slate-100'>
                        Your profile
                    </h1>
                    <p className='mt-2 font-space text-[10px] font-bold uppercase tracking-[0.35em] text-slate-500'>
                        Account details
                    </p>
                </div>
                <div className='flex flex-wrap gap-2 self-start sm:self-end'>
                    <button
                        type='button'
                        onClick={() => refetch()}
                        className='rounded-lg border border-white/10 bg-slate-900/60 px-4 py-2 font-space text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 transition-colors hover:border-cyan-500/30 hover:text-cyan-400'
                    >
                        Refresh
                    </button>
                    {!isLoading && !error && me && (
                        <button
                            type='button'
                            onClick={() =>
                                setIsEditing((e) => !e)
                            }
                            className='rounded-lg border border-cyan-500/20 bg-cyan-950/30 px-4 py-2 font-space text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400 transition-colors hover:border-cyan-400/40 hover:bg-cyan-950/50'
                        >
                            {isEditing ? 'View profile' : 'Edit profile'}
                        </button>
                    )}
                </div>
            </div>

            {isEditing && me && !isLoading && !error ? (
                <ProfileEditForm
                    user={me}
                    onSaved={handleProfileSaved}
                    onCancel={() => setIsEditing(false)}
                />
            ) : (
                <UserMeInfo
                    user={me}
                    isLoading={isLoading}
                    error={error}
                    compact={false}
                />
            )}
        </div>
    );
};

export default UserProfile;
