import React from 'react';

interface SimpleButtonProps {
    onClose?: () => void;
    className?: string;
}

export const SimpleButton: React.FC<SimpleButtonProps> = ({
    onClose,
    className
}) => {
    return (
        <>
            <button onClick={onClose} className={className}>
                ✕
            </button>
        </>
    );
};
