import React, {useState} from 'react';
import NavBarDashboard from '../Header/DashboardNavBar/NavBarDashboard';
import { BookOpenTextIcon, ClipboardSignature, DotSquareIcon, Upload } from 'lucide-react';
import { Send, FileText, X } from 'lucide-react';
import UploadPdfBox from '../UploadPdfBox/UploadPdfBox';

const Dashboard = () => {

    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState([]);

    const [uploadButtonClicked, setUploadButtonClicked] = useState(false)

    const handleUpload = () => {
        setUploadButtonClicked(prev => !prev)
    }

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

            console.log('File uploaded successfully in dashboard:', response);
            setUploadStatus('File uploaded successfully!');
            
        } catch(error) {
            console.error('Error uploading file:', error);
            setUploadStatus('Upload failed. Please try again.');
            setUploadedFile(null); 
        }
    };
    
    const handleSend = () => {
        if (inputText.trim()) {
            setMessages(prev => [...prev, { text: inputText, sender: 'user' }]);
            setInputText('');
            // Here you would typically send the message to your AI service
        }
    };

    const handleRemoveFile = () => {
        setUploadedFile(null);
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
        {icon: ClipboardSignature, title: "FlashCards", onClick: ()=> console.log("Adarsh clicked FlashCards")},
        {icon: BookOpenTextIcon, title: "Quiz", onClick: ()=> console.log("Adarsh clicked Quiz")},
        {icon: DotSquareIcon, title: "Crux", onClick: ()=> console.log("Adarsh clicked Crux")},
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
                    
                    {/* main chatting logic  */}
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
                                    placeholder="Ask about your PDF..."
                                    className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-sm"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                />
                                <button 
                                    className="ml-3 p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
        </>
    );
};

export default Dashboard;