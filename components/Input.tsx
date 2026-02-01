import React from 'react';

interface InputProps {
    id: string;
    label: string;
    type: string;
    isRequired?: boolean;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isEmpty?: boolean;
}
export const Input: React.FC<InputProps> = ({
    id,
    label,
    type,
    isRequired = false,
    value,
    onChange,
    isEmpty = false
}) => {
    return (
        <div className='space-y-2'>
            <label
                htmlFor={id}
                className='block text-[9px] font-space font-bold text-cyan-500/60 uppercase tracking-[0.3em]'
            >
                {label}
            </label>
            <input
                id={id}
                type={type}
                value={value}
                required={isRequired}
                onChange={onChange}
                className='w-full bg-slate-950 border border-white/5 rounded-xl px-6 py-4 text-sm focus:border-cyan-500/40 focus:outline-none transition-all duration-500 font-light'
            />
            {isEmpty && (
                <p
                    className='transition-all duration-100 text-[13px] text-red-600'
                    id={`${id}-error`}
                >
                    Please enter a valid {label.toLowerCase()}.
                </p>
            )}
        </div>
    );
};
