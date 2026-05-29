import React from 'react';
import { X, Menu, LayoutDashboard, LogOut } from 'lucide-react';
import SigninButton from '../../Buttons/SignIn/SigninButton';
import SignUpButton from '../../Buttons/SignUp/SignUpButton';
import { useNavigate } from 'react-router-dom';

const LandingNavBar = () => {
    const [toggleMenuBar, setToggleMenuBar] = React.useState(false);
    const navigate = useNavigate();

    // Read auth state
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const isLoggedIn = !!token;

    const handleSignOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/signin');
    };

    return (
        <>
            <header className='fixed top-0 w-full flex items-center justify-between px-6 py-4 sm:px-8 z-50 bg-gradient-to-r from-zinc-950 via-zinc-900 to-black border-b border-blue-500/20 shadow-lg'>
                <h1 className='text-blue-400 text-2xl sm:text-3xl font-bold'>NoteLeech AI</h1>

                {/* Desktop View */}
                <div className='hidden md:flex items-center gap-4'>
                    {isLoggedIn ? (
                        <>
                            {/* Greeting */}
                            <span className='text-gray-300 text-sm font-medium'>
                                Hello, <span className='text-blue-400 font-semibold'>{user?.name || user?.email || 'User'}</span>
                            </span>

                            {/* Go to Dashboard */}
                            <button
                                onClick={() => navigate('/dashboard')}
                                className='flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors'
                            >
                                <LayoutDashboard className='w-4 h-4' />
                                Dashboard
                            </button>

                            {/* Sign Out */}
                            <button
                                onClick={handleSignOut}
                                className='flex items-center gap-1.5 px-4 py-1.5 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 text-sm font-medium transition-colors'
                            >
                                <LogOut className='w-4 h-4' />
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <SigninButton />
                            <SignUpButton />
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    className='md:hidden p-2 rounded-md text-gray-300 hover:text-blue-400 hover:bg-zinc-800 transition-colors duration-200'
                    onClick={() => setToggleMenuBar(!toggleMenuBar)}
                    aria-label="Toggle menu"
                >
                    {toggleMenuBar ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* Mobile Menu */}
            {toggleMenuBar && (
                <div className='md:hidden fixed top-16 w-full py-4 px-6 bg-gradient-to-b from-zinc-900 to-zinc-950 border-b border-blue-500/20 z-40'>
                    <nav className='flex flex-col space-y-3'>
                        {isLoggedIn ? (
                            <>
                                <span className='text-gray-300 text-sm'>
                                    Hello, <span className='text-blue-400 font-semibold'>{user?.name || user?.email || 'User'}</span>
                                </span>
                                <button
                                    onClick={() => { navigate('/dashboard'); setToggleMenuBar(false); }}
                                    className='flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors'
                                >
                                    <LayoutDashboard className='w-4 h-4' />
                                    Dashboard
                                </button>
                                <button
                                    onClick={handleSignOut}
                                    className='flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 text-sm font-medium transition-colors'
                                >
                                    <LogOut className='w-4 h-4' />
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <SigninButton />
                                <SignUpButton />
                            </>
                        )}
                    </nav>
                </div>
            )}
        </>
    );
};

export default LandingNavBar;