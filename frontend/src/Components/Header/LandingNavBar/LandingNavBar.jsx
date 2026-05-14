import React from 'react';
import { X, Menu } from 'lucide-react';
import SigninButton from '../../Buttons/SignIn/SigninButton';
import SignUpButton from '../../Buttons/SignUp/SignUpButton';

const LandingNavBar = () => {
    const [toggleMenuBar, setToggleMenuBar] = React.useState(false);

    return (
        <>
            <header className='fixed top-0 w-full flex items-center justify-between px-6 py-4 sm:px-8 z-50 bg-gradient-to-r from-zinc-950 via-zinc-900 to-black border-b border-blue-500/20 shadow-lg'>
                <h1 className='text-blue-400 text-2xl sm:text-3xl font-bold'>NoteLeech AI</h1>

                {/* Desktop View */}
                <div className='hidden md:flex items-center gap-4'>
                    <SigninButton/>
                    <SignUpButton/>
                </div>

                {/* Mobile View Toggle */}
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
                        <SigninButton/>
                        <SignUpButton/>
                    </nav> 
                </div>
            )}
        </>
    );
};

export default LandingNavBar;
