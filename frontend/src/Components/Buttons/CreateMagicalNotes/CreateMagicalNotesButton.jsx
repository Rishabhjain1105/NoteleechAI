import { useNavigate } from "react-router-dom"

const CreateMagicalNotesButton = () =>{
    const navigate = useNavigate()
    return(
        <button
            onClick={()=>navigate('/dashboard')}
            className="bg-[#0f0f0f] hover:bg-[#171717] border border-white rounded-lg px-8 py-4 text-white font-bold transition-colors duration-200 shadow-sm w-full">
            Create Magical Notes
        </button>
    )
}

export default CreateMagicalNotesButton