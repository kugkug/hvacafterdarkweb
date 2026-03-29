import React from 'react';

export type MePayload = Record<string, unknown>;

function getFirst(
    obj: MePayload,
    keys: string[]
): string | number | boolean | null | undefined {
    for (const k of keys) {
        const v = obj[k];
        if (v !== undefined && v !== null && v !== '') return v as never;
    }
    return undefined;
}

function formatValue(v: unknown): string {
    if (v === null || v === undefined) return '—';
    if (typeof v === 'object') return JSON.stringify(v);
    return String(v);
}

const ROWS: { label: string; keys: string[] }[] = [
    // { label: 'ID', keys: ['id'] },
    { label: 'Name', keys: ['name'] },
    { label: 'Email', keys: ['email'] },
    { label: 'Username', keys: ['username', 'user_name'] },
    { label: 'Phone', keys: ['phone', 'phone_number'] },
    // { label: 'Role', keys: ['role', 'user_role'] },
    { label: 'Title', keys: ['title'] },
    { label: 'Company', keys: ['company'] },
    { label: 'Position', keys: ['position'] },
    { label: 'Bio', keys: ['bio', 'about'] },
    {
        label: 'Years in industry',
        keys: ['years_in_industry', 'yearsInIndustry']
    },
    { label: 'Allow Search', keys: ['searchable', 'is_searchable'] },
    { label: 'Member since', keys: ['created_at_formatted', 'createdAt'] },

    { label: 'Email verified', keys: ['email_verified_at', 'emailVerifiedAt'] },

    {
        label: 'Last Profile Update',
        keys: ['updated_at_formatted', 'updated_at_formatted']
    }
];

interface UserMeInfoProps {
    user: MePayload | null;
    isLoading: boolean;
    error: string | null;
    /** When true, skips rows already shown elsewhere (e.g. name in header). */
    compact?: boolean;
    /** Row labels to hide from the read-only list (e.g. fields edited elsewhere). */
    omitRowLabels?: string[];
}

export const UserMeInfo: React.FC<UserMeInfoProps> = ({
    user,
    isLoading,
    error,
    compact,
    omitRowLabels = []
}) => {
    if (isLoading) {
        return (
            <div className='rounded-2xl border border-white/10 bg-slate-900/40 p-8 text-center'>
                <p className='font-space text-[10px] font-bold uppercase tracking-[0.35em] text-slate-500'>
                    Loading profile…
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className='rounded-2xl border border-red-500/20 bg-red-950/20 p-6'>
                <p className='text-sm text-red-400'>{error}</p>
            </div>
        );
    }

    if (!user || typeof user !== 'object') {
        return (
            <div className='rounded-2xl border border-white/10 bg-slate-900/40 p-6 text-slate-500'>
                No profile data returned.
            </div>
        );
    }

    const skipLabels = compact
        ? new Set(['Name', ...omitRowLabels])
        : new Set(omitRowLabels);

    const entries = ROWS.filter((row) => !skipLabels.has(row.label))
        .map((row) => {
            const raw = getFirst(user, row.keys);
            if (raw === undefined) return null;
            return { label: row.label, value: formatValue(raw) };
        })
        .filter(Boolean) as { label: string; value: string }[];

    const shownKeys = new Set(
        ROWS.flatMap((r) => r.keys).filter((k) => k in user)
    );
    const extraKeys = Object.keys(user).filter(
        (k) =>
            !shownKeys.has(k) &&
            user[k] !== null &&
            user[k] !== undefined &&
            user[k] !== '' &&
            typeof user[k] !== 'object'
    );

    const displayName =
        getFirst(user, ['name', 'username', 'email']) ?? 'Account';

    return (
        <div className='space-y-6'>
            {!compact && (
                <div className='rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/30 to-slate-900/60 p-6 shadow-[0_0_30px_rgba(6,182,212,0.08)]'>
                    <p className='font-space text-[10px] font-bold uppercase tracking-[0.35em] text-cyan-500/80'>
                        Signed in as
                    </p>
                    <h2 className='mt-2 font-syne text-2xl font-bold text-slate-100'>
                        {String(displayName)}
                    </h2>
                </div>
            )}

            <div className='overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50'>
                <dl className='divide-y divide-white/5'>
                    {entries.map(({ label, value }) => (
                        <div
                            key={label}
                            className='grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-[minmax(0,11rem)_1fr] sm:gap-4 sm:px-6'
                        >
                            <dt className='font-space text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500'>
                                {label}
                            </dt>
                            <dd className='break-words text-sm text-slate-200'>
                                {value}
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
        </div>
    );
};
