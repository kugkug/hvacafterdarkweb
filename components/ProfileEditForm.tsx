import React, { useEffect, useState } from 'react';
import usePost from '../custom_hooks/usePost';
import { Input } from './Input';
import NeonButton from './NeonButton';
import { MePayload } from './UserMeInfo';

export function getEditableFields(user: MePayload | null): {
    name: string;
    searchable: boolean;
} {
    const name = user && typeof user.name === 'string' ? user.name : '';
    const raw = user?.searchable === 'YES' ? true : false;
    const searchable = raw;
    return { name, searchable };
}

interface ProfileEditFormProps {
    user: MePayload | null;
    onSaved: (name: string) => void;
    onCancel: () => void;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
    user,
    onSaved,
    onCancel
}) => {
    const { postData, loading, error } = usePost('/user/update');
    const [name, setName] = useState('');
    const [searchable, setSearchable] = useState(
        user?.searchable === 'YES' ? true : false
    );
    const [nameEmpty, setNameEmpty] = useState(false);

    useEffect(() => {
        const { name: n, searchable: s } = getEditableFields(user);
        setName(n);
        setSearchable(s);
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) {
            setNameEmpty(true);
            return;
        }
        setNameEmpty(false);

        const payload = { name: trimmed, searchable };
        const res = await postData(payload);

        if (res?.status) {
            onSaved(trimmed);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className='rounded-2xl border border-white/10 bg-slate-950/50 p-6 sm:p-8'
        >
            <h2 className='font-syne text-lg font-bold text-slate-100'>
                Edit profile
            </h2>
            <p className='mt-1 font-space text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500'>
                Only display name and search visibility can be changed here.
            </p>

            <div className='mt-8 space-y-6'>
                <Input
                    id='profile-name'
                    label='Name'
                    type='text'
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        setNameEmpty(false);
                    }}
                    isEmpty={nameEmpty}
                />

                <div className='flex items-start gap-3 pt-1'>
                    <input
                        id='profile-searchable'
                        type='checkbox'
                        checked={searchable}
                        onChange={(e) => setSearchable(e.target.checked)}
                        className='mt-1 h-4 w-4 rounded border-white/20 bg-slate-950 text-cyan-500 focus:ring-cyan-500/40'
                    />
                    <label
                        htmlFor='profile-searchable'
                        className='cursor-pointer font-space text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400'
                    >
                        Allow my profile to appear in search
                    </label>
                </div>
            </div>

            {error && (
                <p className='mt-6 text-sm text-red-400' role='alert'>
                    {error}
                </p>
            )}

            <div className='mt-8 flex flex-wrap gap-3'>
                <NeonButton
                    type='submit'
                    isLoading={loading}
                    loadingText='Saving…'
                    className='min-w-[10rem] py-4'
                >
                    Save changes
                </NeonButton>
                <button
                    type='button'
                    onClick={onCancel}
                    disabled={loading}
                    className='rounded-lg border border-white/10 bg-slate-900/60 px-6 py-2 font-space text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 transition-colors hover:border-slate-500/40 hover:text-slate-200 disabled:opacity-50'
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default ProfileEditForm;
