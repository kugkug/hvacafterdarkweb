import React from 'react';
import { ADMIN_EMAIL } from '../constants';

export const Footer = () => {
    return (
        <div className='py-24 border-t border-white/5 text-center space-y-6'>
            <p className='text-slate-800 text-[10px] font-space font-bold uppercase tracking-[0.7em]'>
                HVAC AFTER DARK // EST. 2024
            </p>
            <p className='text-slate-600 text-sm font-light italic'>
                Support & Admin:{' '}
                <span className='text-cyan-700 font-bold underline cursor-pointer hover:text-cyan-400 transition-colors'>
                    {ADMIN_EMAIL}
                </span>
            </p>
        </div>
    );
};

export default Footer;
