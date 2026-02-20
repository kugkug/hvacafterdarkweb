import { useAuth } from '../utilities/auth';
import NeonButton from './NeonButton';
import { Link, useLocation } from 'react-router-dom';

export const Navbar = () => {
    const auth = useAuth();
    const location = useLocation();
    const currentLocation = location.pathname;
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
                        className={`text-[10px] font-space font-bold tracking-[0.25em] text-slate-600 hover:text-cyan-400 transition-all uppercase ${currentLocation === '/' ? 'text-cyan-400' : ''}`}
                    >
                        HOME
                    </button>
                </Link>
                {auth.user && (
                    <>
                        <Link to='/memes'>
                            <button
                                className={`text-[10px] font-space font-bold tracking-[0.25em] text-slate-600 hover:text-cyan-400 transition-all uppercase ${currentLocation === '/memes' ? 'text-cyan-400' : ''}`}
                            >
                                MEMES
                            </button>
                        </Link>
                        <Link to='/finds'>
                            <button
                                className={`text-[10px] font-space font-bold tracking-[0.25em] text-slate-600 hover:text-cyan-400 transition-all uppercase ${currentLocation === '/finds' ? 'text-cyan-400' : ''}`}
                            >
                                FINDS
                            </button>
                        </Link>
                        <Link to='/community'>
                            <button
                                className={`text-[10px] font-space font-bold tracking-[0.25em] text-slate-600 hover:text-cyan-400 transition-all uppercase ${currentLocation === '/community' ? 'text-cyan-400' : ''}`}
                            >
                                COMMUNITY
                            </button>
                        </Link>
                        <Link to='/messages'>
                            <button
                                className={`text-[10px] font-space font-bold tracking-[0.25em] text-slate-600 hover:text-cyan-400 transition-all uppercase ${currentLocation === '/messages' ? 'text-cyan-400' : ''}`}
                            >
                                PMs
                            </button>
                        </Link>
                        <span className='text-[10px] font-space font-bold tracking-[0.15em] text-cyan-400 uppercase'>
                            {auth.user}
                        </span>
                        <NeonButton onClick={() => auth.logout()}>
                            LOGOUT
                        </NeonButton>
                    </>
                )}
            </div>
        </nav>
    );
};
