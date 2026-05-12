import React from 'react';
import { X , Menu, MenuIcon } from 'lucide-react';
import SigninButton from '../Buttons/SignIn/SigninButton';
import SignUpButton from '../Buttons/SignUp/SignUpButton';

const NavBar = () => {
    const [toggleMenuBar, setToggleMenuBar] = React.useState(false);
    const navItems = [
        {name: "About", href:'#'},
    ]

    return (
        <>
            <header className='fixed w-full flex items-center justify-between px-6 py-3 sm:px-18 sm:py-2 shadow'>
                <h1 className='text-blue-400 sm:text-4xl'>NoteLeech AI</h1>

            {/* Desktop View */}
                <div className='hidden md:flex gap-4'>
                    {/* {navItems.map((item)=>(
                        <a 
                            href={item.href} 
                            key={item.name}
                            className='  transition-colors duration-200 font-mono text-2xl'
                        >
                            {item.name}
                        </a>
                    ))} */}

                    <SigninButton/>
                    <SignUpButton/>
                </div>


            {/* mobile view */}

                <button 
                    className='md:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors'
                    onClick={() => setToggleMenuBar(!toggleMenuBar)}
                    aria-label="Toggle menu"
                >
                    {toggleMenuBar ? <X size={24} /> : <Menu size={24} />}
                </button>
     
        </header>

        {toggleMenuBar && (
            <div className='md:hidden py-4 px-6 pt-16 border-t '>
                <nav className=' flex flex-col space-y-2'>
                    {/* {navItems.map((item)=>(
                        <a 
                            href={item.href} 
                            key={item.name}
                            className='transition-colors duration-200 font-medium'
                        >
                            {item.name}
                        </a>
                    ))} */}
                    
                    <SigninButton/>
                </nav> 
            </div>

        )}
        </>

    );
};

export default NavBar;