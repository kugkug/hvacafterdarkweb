import { useState } from 'react';
import { useAuth } from '../utilities/auth';
import NeonButton from './NeonButton';
import { Link, useLocation } from 'react-router-dom';

const navLinkClass = (active: boolean) =>
    `block w-full text-left text-[10px] font-space font-bold tracking-[0.25em] py-3 px-4 rounded-lg transition-all uppercase md:py-0 md:px-0 md:w-auto md:inline-block ${
        active ? 'text-cyan-400 bg-cyan-500/10 md:bg-transparent' : 'text-slate-600 hover:text-cyan-400 hover:bg-slate-800/50 md:hover:bg-transparent'
    }`;

export const Navbar = () => {
    const auth = useAuth();
    const location = useLocation();
    const currentLocation = location.pathname;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className='flex flex-wrap justify-between items-center py-4 px-4 sm:px-6 md:px-12 bg-slate-950/95 sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl shadow-2xl'>
            <Link to='/' className='flex items-center space-x-2 sm:space-x-3 cursor-pointer group min-w-0'>
                <div className='w-7 h-7 sm:w-8 sm:h-8 bg-cyan-600 rounded flex items-center justify-center font-space font-bold text-black rotate-12 shadow-[0_0_15px_rgba(0,210,255,0.3)] group-hover:rotate-0 transition-all duration-500 flex-shrink-0'>
                    H
                </div>
                <h1 className='text-sm sm:text-lg font-syne font-extrabold tracking-tighter uppercase leading-none truncate'>
                    HVAC{' '}
                    <span className='text-purple-500 neon-text-purple'>
                        AFTER DARK
                    </span>
                </h1>
            </Link>

            {/* Desktop nav */}
            <div className='hidden lg:flex items-center gap-6 xl:gap-8'>
                <Link to='/'>
                    <button className={navLinkClass(currentLocation === '/')}>
                        HOME
                    </button>
                </Link>
                {auth.user && (
                    <>
                        <Link to='/memes'>
                            <button className={navLinkClass(currentLocation === '/memes')}>
                                MEMES
                            </button>
                        </Link>
                        <Link to='/finds'>
                            <button className={navLinkClass(currentLocation === '/finds')}>
                                FINDS
                            </button>
                        </Link>
                        <Link to='/community'>
                            <button className={navLinkClass(currentLocation === '/community')}>
                                COMMUNITY
                            </button>
                        </Link>
                        <Link to='/messages'>
                            <button className={navLinkClass(currentLocation === '/messages')}>
                                PMs
                            </button>
                        </Link>
                        <Link to='/profile'>
                            <button className={navLinkClass(currentLocation === '/profile')}>
                                PROFILE
                            </button>
                        </Link>
                        <span className='text-[10px] font-space font-bold tracking-[0.15em] text-cyan-400 uppercase whitespace-nowrap'>
                            {auth.user}
                        </span>
                        <NeonButton onClick={() => auth.logout()} className='flex-shrink-0'>
                            LOGOUT
                        </NeonButton>
                    </>
                )}
            </div>

            {/* Mobile menu button */}
            <div className='flex items-center gap-2 lg:hidden'>
                {auth.user && (
                    <span className='text-[9px] sm:text-[10px] font-space font-bold text-cyan-400 uppercase truncate max-w-[80px] sm:max-w-[120px]'>
                        {auth.user}
                    </span>
                )}
                <button
                    type='button'
                    onClick={() => setMobileMenuOpen((o) => !o)}
                    className='p-2 rounded-lg border border-white/10 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/20 transition-all'
                    aria-label='Toggle menu'
                >
                    {mobileMenuOpen ? (
                        <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                        </svg>
                    ) : (
                        <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile dropdown menu */}
            {mobileMenuOpen && (
                <div className='w-full lg:hidden mt-4 pt-4 border-t border-white/5 animate-in fade-in slide-in-from-top-2 duration-200'>
                    <div className='flex flex-col gap-1'>
                        <Link to='/' onClick={() => setMobileMenuOpen(false)}>
                            <button className={navLinkClass(currentLocation === '/')}>HOME</button>
                        </Link>
                        {auth.user && (
                            <>
                                <Link to='/memes' onClick={() => setMobileMenuOpen(false)}>
                                    <button className={navLinkClass(currentLocation === '/memes')}>MEMES</button>
                                </Link>
                                <Link to='/finds' onClick={() => setMobileMenuOpen(false)}>
                                    <button className={navLinkClass(currentLocation === '/finds')}>FINDS</button>
                                </Link>
                                <Link to='/community' onClick={() => setMobileMenuOpen(false)}>
                                    <button className={navLinkClass(currentLocation === '/community')}>COMMUNITY</button>
                                </Link>
                                <Link to='/messages' onClick={() => setMobileMenuOpen(false)}>
                                    <button className={navLinkClass(currentLocation === '/messages')}>PMs</button>
                                </Link>
                                <Link to='/profile' onClick={() => setMobileMenuOpen(false)}>
                                    <button className={navLinkClass(currentLocation === '/profile')}>PROFILE</button>
                                </Link>
                                <div className='pt-3 mt-2 border-t border-white/5'>
                                    <NeonButton onClick={() => { auth.logout(); setMobileMenuOpen(false); }} className='w-full'>
                                        LOGOUT
                                    </NeonButton>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};
