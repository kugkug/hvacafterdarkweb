import { useAuth } from '../utilities/auth';
import NeonButton from './NeonButton';
import { Link } from 'react-router-dom';

export const Navbar = () => {
    const auth = useAuth();
    return (
        <nav className='flex justify-between items-center py-5 px-6 md:px-12 bg-slate-950/95 sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl shadow-2xl'>
            <div className='flex items-center space-x-3 cursor-pointer group'>
                <div className='w-8 h-8 bg-cyan-600 rounded flex items-center justify-center font-space font-bold text-black rotate-12 shadow-[0_0_15px_rgba(0,210,255,0.3)] group-hover:rotate-0 transition-all duration-500'>
                    H
                </div>
                <h1 className='text-lg font-syne font-extrabold tracking-tighter uppercase leading-none'>
                    HVAC{' '}
                    <span className='text-purple-500 neon-text-purple'>
                        AFTER DARK
                    </span>
                </h1>
            </div>
            <div className='flex items-center space-x-8'>
                <Link to='/'>
                    <button
                        className={`text-[10px] font-space font-bold tracking-[0.25em] text-slate-600 hover:text-cyan-400 transition-all uppercase`}
                    >
                        HOME
                    </button>
                </Link>
                {auth.user && (
                    <NeonButton onClick={() => {}}> ACCESS </NeonButton>
                )}
            </div>
        </nav>
    );
};
