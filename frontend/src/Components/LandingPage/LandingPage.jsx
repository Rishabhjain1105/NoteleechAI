import React from 'react';
import LandingPageCards from '../Cards/LandingPageCards/LandingPageCards';
import ChatWithPDFButton from '../Buttons/ChatWithPdfButton/ChatWithPDFButton';
import CreateMagicalNotesButton from '../Buttons/CreateMagicalNotes/CreateMagicalNotesButton';
import LandingPageImage from '../../images/LandingPage.png';
import AboutUsSection from '../AboutUs/AboutUs';
import Footer from '../Footer/Footer';
import LandingNavBar from '../Header/LandingNavBar/LandingNavBar';

function LandingPage() {
    return (
        <div className="min-h-screen bg-zinc-950 text-white overflow-x-hidden">
            <LandingNavBar />
            
            {/* Hero Section */}
            <section className="pt-32 px-6 sm:px-8 min-h-screen flex flex-col items-center justify-center">
                <div
                    className="flex flex-col items-center justify-center w-full max-w-5xl text-center relative"
                >
                    <div className="absolute inset-0 opacity-30 -z-10">
                        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
                        <div className="absolute bottom-20 right-0 w-80 h-80 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
                    </div>
                    <div className="relative z-10">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold drop-shadow-lg mb-6">
                            Welcome to <span className="bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">NoteLeech-AI</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto drop-shadow-md leading-relaxed">
                            Your AI-powered note management solution.
                            Now create magical notes and chat with your PDFs seamlessly!
                        </p>
                    </div>
                </div>
            </section>

            {/* Features Cards Section */}
            <section className="py-20 px-6 sm:px-8 bg-gradient-to-b from-zinc-950 to-zinc-900">
                    <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-8">
                        <LandingPageCards />
                    </div>
            </section>

            {/* Divider */}
            <div className="px-6 sm:px-8">
                <div className="max-w-6xl mx-auto border-t border-blue-500/30"></div>
            </div>

            {/* Image Section */}
            <section className="py-20 px-6 sm:px-8 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black">
                <div className="max-w-6xl mx-auto">
                    <div className="relative flex justify-center items-center">
                        <img
                            src={LandingPageImage}
                            alt="Find What You Need Instantly"
                            className="max-w-4xl w-full rounded-2xl border border-blue-500/30 shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-shadow duration-300"
                        />
                        {/* Dark overlay */}
                        <div className="absolute inset-0 max-w-4xl mx-auto rounded-2xl bg-gradient-to-b from-blue-950/20 via-transparent to-zinc-950/40 pointer-events-none"></div>
                    </div>
                </div>
            </section>

            {/* Action Buttons Section */}
            {/* <section className="py-20 px-6 sm:px-8 bg-zinc-900">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                        <div className="w-full sm:w-auto min-w-64">
                            <ChatWithPDFButton />
                        </div>
                        <div className="w-full sm:w-auto min-w-64">
                            <CreateMagicalNotesButton />
                        </div>
                    </div>
                </div>
            </section> */}

            {/* Divider */}
            <div className="px-6 sm:px-8">
                <div className="max-w-6xl mx-auto border-t border-blue-500/30"></div>
            </div>

            {/* About Section */}
            <AboutUsSection />
            
            {/* Footer */}
            <Footer />
        </div>
    );
}

export default LandingPage;