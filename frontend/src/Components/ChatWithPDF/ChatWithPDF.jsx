import React, { useState, useRef, useEffect } from 'react';
import { Send, FileText, X, Sparkles } from 'lucide-react';
import UploadPdfBox from '../UploadPdfBox/UploadPdfBox'



const ChatWithPDF = () => {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploadedFileName, setUploadedFileName] = useState('');
    const [uploadStatus, setUploadStatus] = useState('');
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false)
    const messageEndRef = useRef(null)

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
    };

    useEffect(()=>{
        scrollToBottom();
    }, [messages])

    const handleFileAccepted = async (file) => {
        setUploadedFile(file);
        setUploadStatus("Uploading PDF...");

        const formData = new FormData();
        formData.append('PDF', file);

        try {
            const response = await fetch('http://localhost:8000/pdf/upload', {
                method: 'POST',
                body: formData,
                onUploadProgress: (progress) => {
                    const percentCompleted = Math.round((progress.loaded * 100) / progress.total);
                    setUploadStatus(`Uploading... ${percentCompleted}%`);
                }
            });

            const data = await response.json();
            console.log('File uploaded successfully in chat with pdf:', data);
            
            // Store the uploaded filename from backend response
            if (data.file && data.file.filename) {
                setUploadedFileName(data.file.filename);
            }
            
            setUploadStatus('File uploaded successfully!');
            
        } catch(error) {
            console.error('Error uploading file:', error);
            setUploadStatus('Upload failed. Please try again.');
            setUploadedFile(null); 
        }
    };

    const handleSend = async () => {
        if (!inputText.trim()) return;
        
        const userMessage = { text: inputText, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsTyping(true)

        if (!uploadedFileName) {
            setIsTyping(false)
            console.error("No uploaded file available");
            setMessages(prev => [
                ...prev,
                { text: 'Error: No file uploaded. Please upload a PDF first.', sender: 'bot' },
            ]);
            return;
        }

        try {
            // 2️⃣ Send message to Node backend
            const response = await fetch('http://localhost:8000/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: inputText,
                    fileName: uploadedFileName, // use the filename from backend
                }),
            });

            const data = await response.json();
            setIsTyping(false)

            
            const botMessage = { text: data.answer || 'No response received', sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            setIsTyping(false)
            console.error('Error sending message:', error);
            setMessages(prev => [
            ...prev,
            { text: 'Error: Could not get response from AI', sender: 'bot' },
            ]);
        }
    };


    const handleRemoveFile = () => {
        setUploadedFile(null);
        setUploadedFileName('');
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

    return (
        <div className='min-h-screen bg-[#0d1117]'>
            <div className='h-screen flex flex-col '>

                {/* Heading */}
                <h1 className='py-2 px-4 text-2xl text-white font-semibold'>NoteLeech AI</h1>


                {!uploadedFile ? (
                    <div className="flex-1 flex items-center justify-center p-6">
                        <UploadPdfBox onFileAccepted={handleFileAccepted} />
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col overflow-hidden">
                        

                        {/* Chat Messages Area */}
                        <div className="flex-1 overflow-y-auto px-6 py-8   ">

                            {messages.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                                        <Sparkles className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Start Your Conversation</h3>
                                    <p className="text-gray-400">Ask me anything about your PDF document</p>
                                </div>
                            )}

                            {/* {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[70%] px-4 py-2 rounded-xl text-sm ${
                                        msg.sender === 'user'
                                            ? 'bg-blue-600 text-white rounded-br-none'
                                            : 'bg-gray-700 text-gray-100 rounded-bl-none'
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))} */}

                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom duration-300`}
                                >
                                    <div className={`flex gap-3 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                                            msg.sender === 'user' 
                                                ? 'bg-blue-600 shadow-blue-500/30' 
                                                : 'bg-gray-700 shadow-gray-700/30'
                                        }`}>
                                            {msg.sender === 'user' ? (
                                                <span className="text-white font-bold text-sm">You</span>
                                            ) : (
                                                <Sparkles className="w-5 h-5 text-blue-400" />
                                            )}
                                        </div>
                                        <div className={`px-5 py-3 rounded-2xl ${
                                            msg.sender === 'user'
                                                ? 'bg-blue-600 text-white rounded-tr-sm shadow-lg shadow-blue-500/20'
                                                : 'bg-[#161b22] text-gray-100 rounded-tl-sm border border-[#30363d]'
                                        }`}>
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="flex gap-3 max-w-[80%]">
                                    <div className="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-gray-700/30">
                                        <Sparkles className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div className="px-5 py-3 rounded-2xl bg-[#161b22] border border-[#30363d] rounded-tl-sm">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <div ref={messageEndRef} />

                        {/* Chat bar Container  */}
                        {/* <div className="w-full max-w-4xl mx-auto mb-8 fixed bottom-0  ">
                            <div className="bg-[#171717] border border-gray-600 rounded-xl shadow-lg">
                                
                                File Preview Inside Input
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
                                
                                Input Area
                                <div className="flex items-center p-4">
                                    <input 
                                        type="text"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        placeholder="Ask about your PDF..."
                                        className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-sm"
                                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    />
                                    <button 
                                        onClick={handleSend}
                                        className="ml-3 p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
                                        disabled={!inputText.trim()}
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div> */}
    
                        <div className="border-t border-[#30363d] bg-[#161b22] p-6">
                            <div className="max-w-4xl mx-auto">
                                
                                <div className="p-3 border-gray-600">
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
                                
                                <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-2 flex items-end gap-2 focus-within:border-blue-500 transition-all">
                                    
                                    <input 
                                        type="text"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        placeholder="Ask about your PDF..."
                                        className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none px-4 py-3 text-sm"
                                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                                    />
                                    <button 
                                        onClick={handleSend}
                                        disabled={!inputText.trim()}
                                        className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-2 text-center">Press Enter to send, Shift + Enter for new line</p>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ChatWithPDF;