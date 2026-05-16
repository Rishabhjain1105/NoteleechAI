import React, { useState, useRef, useEffect } from 'react';
import NavBarDashboard from '../Header/DashboardNavBar/NavBarDashboard';
import { Form, BookOpenTextIcon, ClipboardSignature, DotSquareIcon, Upload } from 'lucide-react';
import { Send, X, Sparkles, Loader2 } from 'lucide-react';
import UploadPdfBox from '../UploadPdfBox/UploadPdfBox';
import FlashcardModal from '../Flashcard/FlashcardModal';
import SummaryModal from '../Summary/SummaryModal';
import CruxModal from '../Crux/CruxModal';
import QuizModal from '../Quiz/QuizModal';

const Dashboard = () => {

    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState([]);
    const [collectionName, setCollectionName] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messageEndRef = useRef(null);
    const [uploadButtonClicked, setUploadButtonClicked] = useState(false);
    const [showFlashcardModal, setShowFlashcardModal] = useState(false);
    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const [showCruxModal, setShowCruxModal] = useState(false);
    const [showQuizModal, setShowQuizModal] = useState(false);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleUpload = () => {
        setUploadButtonClicked(prev => !prev)
    }

    const handleFileAccepted = async (file) => {
        setUploadedFile(file);
        setUploadStatus('Uploading & processing PDF...');
        setUploadButtonClicked(false);

        const formData = new FormData();
        formData.append('PDF', file);

        try {
            const response = await fetch('http://localhost:8000/pdf/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail || 'Upload failed');
            }

            const data = await response.json();
            setCollectionName(data.collection);   // <-- this is the key line
            setUploadStatus('Ready! Ask anything about your PDF.');
        } catch (error) {
            console.error('Error uploading file:', error);
            setUploadStatus(`Upload failed: ${error.message}`);
            setUploadedFile(null);
        }
    };
    
    const handleSend = async () => {
        const question = inputText.trim();
        if (!question) return;

        if (!collectionName) {
            setMessages(prev => [...prev,
                { text: question, sender: 'user' },
                { text: 'Please upload a PDF first before asking questions.', sender: 'bot' }
            ]);
            setInputText('');
            return;
        }

        setMessages(prev => [...prev, { text: question, sender: 'user' }]);
        setInputText('');
        setIsTyping(true);

        try {
            const response = await fetch('http://localhost:8000/chat/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question,
                    collection_name: collectionName,
                }),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail || 'Failed to get response');
            }

            const data = await response.json();
            setMessages(prev => [...prev, { text: data.answer, sender: 'bot' }]);
        } catch (error) {
            setMessages(prev => [...prev, { text: `Error: ${error.message}`, sender: 'bot' }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleRemoveFile = () => {
        setUploadedFile(null);
        setCollectionName('');
        setUploadStatus('');
        setMessages([]);
    };

    const getFileIcon = (fileName) => {
        if (fileName.toLowerCase().endsWith('.pdf')) {
            return (
                <div className="w-8 h-10 bg-red-500 rounded-sm flex items-center justify-center mr-3">
                    <span className="text-xs font-bold text-white">PDF</span>
                </div>
            );
        }
        // return <FileText className="w-6 h-6 mr-3 text-blue-400" />;
    };


    const items = [
        {icon: Upload, title: "Upload", onClick: handleUpload },
        { icon: ClipboardSignature, title: 'FlashCards', onClick: () => setShowFlashcardModal(true) },
        {icon: BookOpenTextIcon, title: "Quiz", onClick: ()=> setShowQuizModal(true)},
        { icon: Form, title: 'Summary', onClick: () => setShowSummaryModal(true) },
        { icon: DotSquareIcon, title: 'Crux', onClick: () => setShowCruxModal(true) },
    ]
    return (
        <>  
        <div className='flex flex-col h-screen bg-[#0d1117]'>
            <NavBarDashboard />
            
            {/* Main Content Area - This will be your chat area in the future */}
            <main className='flex-1   overflow-hidden flex flex-col'>
                {/* Section 1 - Chat/Content Area */}
                <section className='flex flex-1 flex-col items-center p-6 bg-transparent overflow-y-auto w-full max-w-6xl mx-auto'>
                   
                    <h1 className="text-white text-4xl mt-20 mb-6 font-semibold">
                        Namaste, it feels good to see you here.
                    </h1>

                    {uploadButtonClicked && <UploadPdfBox onFileAccepted={handleFileAccepted} />}
                    
                    {/* main chatting logic */}
                    {messages.length > 0 && (
                        <div className="w-full flex flex-col gap-4 pb-4">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`flex gap-3 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                            msg.sender === 'user' ? 'bg-blue-600' : 'bg-gray-700'
                                        }`}>
                                            {msg.sender === 'user'
                                                ? <span className="text-white font-bold text-xs">You</span>
                                                : <Sparkles className="w-5 h-5 text-blue-400" />
                                            }
                                        </div>
                                        <div className={`px-5 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                                            msg.sender === 'user'
                                                ? 'bg-blue-600 text-white rounded-tr-sm'
                                                : 'bg-[#161b22] text-gray-100 rounded-tl-sm border border-[#30363d]'
                                        }`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="flex gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center">
                                            <Sparkles className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div className="px-5 py-3 rounded-2xl bg-[#161b22] border border-[#30363d]">
                                            <div className="flex gap-1">
                                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messageEndRef} />
                        </div>
                    )}
                </section>
                
                {/* Bottom Search Box - Fixed at bottom */}
                <section className='p-6'>
                    <div className="w-full max-w-4xl mx-auto">
                        <div className="bg-[#171717] border border-gray-600 rounded-xl shadow-lg">
                            {/* Options bar */}
                            <div className="p-3 border-b border-gray-600">
                                {items.map((item, index)=>{
                                    const Icon = item.icon;
                                    return (
                                        <div
                                            key={index} 
                                            className='inline-flex rounded-md items-center justify-center bg-[#171717] border-[.1px] border-gray-600 hover:border-gray-200 gap-2 mr-4 px-2 py-1 cursor-pointer transition-all duration-200'

                                            onClick={item.onClick}
                                        >
                                            <Icon className='text-[#e9e9e9]' size={20}/>
                                            <h1 className='text-[#e9e9e9] font-semibold text-lg'>
                                                {item.title}
                                            </h1>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Input Area / File upload preview area */}
                            {uploadedFile && (
                                <div className="p-3 border-b border-gray-600">
                                    <div className="inline-flex items-center bg-slate-700 text-white px-3 py-2 rounded-lg">
                                        {getFileIcon(uploadedFile.name)}
                                        <div className="flex-1 min-w-0 mr-3">
                                            <p className="text-sm font-medium truncate">{uploadedFile.name}</p>
                                            <p className="text-xs text-gray-300">{uploadStatus}</p>
                                        </div>
                                        
                                        <button 
                                            onClick={handleRemoveFile}
                                            className="text-gray-400 hover:text-white transition-colors"
                                            title="Remove file"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                                
                            {/* Input Area */}
                            <div className="flex items-center p-4">
                                <input
                                    type="text"
                                    value={inputText}                              // ADD
                                    onChange={(e) => setInputText(e.target.value)} // ADD
                                    placeholder="Ask about your PDF..."
                                    className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-sm"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    disabled={isTyping}                            // ADD
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!inputText.trim() || isTyping}       // ADD disabled
                                    className="ml-3 p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    {isTyping
                                        ? <Loader2 className="w-5 h-5 animate-spin" />
                                        : <Send className="w-5 h-5" />
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
        {showFlashcardModal && (
            <FlashcardModal
                collectionName={collectionName}
                onClose={() => setShowFlashcardModal(false)}
            />
        )}
        {showSummaryModal && (
            <SummaryModal
                collectionName={collectionName}
                onClose={() => setShowSummaryModal(false)}
            />
        )}
        {showCruxModal && (
            <CruxModal
                collectionName={collectionName}
                onClose={() => setShowCruxModal(false)}
            />
        )}
        {showQuizModal && (
            <QuizModal
                collectionName={collectionName}
                onClose={() => setShowQuizModal(false)}
            />
        )}
        </>
    );
};

export default Dashboard;