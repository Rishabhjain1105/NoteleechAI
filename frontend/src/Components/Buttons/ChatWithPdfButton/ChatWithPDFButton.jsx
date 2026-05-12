import { useNavigate } from "react-router-dom"

const ChatWithPDFButton = () =>{
    const navigate = useNavigate()
    return(
        <button 
            onClick={()=>navigate('/chat-with-pdf')}
            className='bg-[#0f0f0f] hover:bg-[#171717] border border-white rounded-lg px-8 py-4 text-white font-bold transition-colors duration-200 shadow-sm w-full'>
            Chat with PDF
        </button>
    )
}

export default ChatWithPDFButton