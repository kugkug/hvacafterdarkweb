import React from 'react';
import { ADMIN_EMAIL } from '../constants';

export const Footer = () => {
    return (
        <div className='py-12 sm:py-16 md:py-24 px-4 border-t border-white/5 text-center space-y-4 sm:space-y-6'>
            <p className='text-slate-800 text-[9px] sm:text-[10px] font-space font-bold uppercase tracking-[0.4em] sm:tracking-[0.7em] break-words'>
                HVAC AFTER DARK // EST. 2024
            </p>
            <p className='text-slate-600 text-xs sm:text-sm font-light italic break-words'>
                Support & Admin:{' '}
                <span className='text-cyan-700 font-bold underline cursor-pointer hover:text-cyan-400 transition-colors'>
                    {ADMIN_EMAIL}
                </span>
            </p>
        </div>
    );
};

export default Footer;
