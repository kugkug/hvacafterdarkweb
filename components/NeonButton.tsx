import React from 'react';

interface NeonButtonProps {
    children: React.ReactNode;
    className?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    variant?: 'blue' | 'purple';
    type?: 'button' | 'submit';
    loadingText?: string;
    isLoading?: boolean;
}

export const NeonButton: React.FC<NeonButtonProps> = ({
    children,
    onClick,
    className = '',
    variant = 'blue',
    type = 'button',
    loadingText = '',
    isLoading = false
}) => {
    const baseStyles =
        'px-6 py-2 rounded-md font-space font-bold uppercase tracking-[0.15em] transition-all duration-500 transform active:scale-95 text-[11px]';
    const variants = {
        blue: 'text-cyan-400 border border-cyan-400/50 hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_25px_rgba(0,210,255,0.4)] hover:border-cyan-400',
        purple: 'text-purple-400 border border-purple-400/50 hover:bg-purple-400 hover:text-black hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:border-purple-400'
    };

    return !isLoading ? (
        <button
            type={type}
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    ) : (
        <button
            disabled
            type={type}
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {loadingText ?? 'Loading...'}
        </button>
    );
};

export default NeonButton;
