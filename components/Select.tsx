import React from 'react';

interface SelectProps {
    id: string;
    label: string;
    isRequired?: boolean;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    isEmpty?: boolean;
    options: any[];
}
export const Select: React.FC<SelectProps> = ({
    id,
    label,
    isRequired = false,
    value,
    onChange,
    isEmpty = false,
    options
}) => {
    return (
        <div className='space-y-2'>
            <label
                htmlFor={id}
                className='block text-[9px] font-space font-bold text-cyan-500/60 uppercase tracking-[0.3em]'
            >
                {label}
            </label>
            <select
                id={id}
                value={value}
                required={isRequired}
                onChange={(e: any) => onChange(e)}
                className='w-full bg-slate-950 border border-white/5 rounded-xl px-6 py-4 text-sm focus:border-cyan-500/40 focus:outline-none transition-all duration-500 font-light'
            >
                {options.map((option: any) => (
                    <option key={option.id} value={option.id}>
                        {option.name}
                    </option>
                ))}
            </select>
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
