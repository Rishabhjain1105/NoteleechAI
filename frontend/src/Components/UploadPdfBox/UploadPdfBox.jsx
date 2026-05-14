import React from 'react';
import { UploadIcon } from 'lucide-react';
import {useDropzone} from 'react-dropzone'

const UploadPdfBox = ({ onFileAccepted }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { "application/pdf": [".pdf"] },
        maxSize: 10 * 1024 * 1024, // 10MB
        multiple: false,
        onDrop: (acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            onFileAccepted(acceptedFiles[0]); // send file back to parent
        }
        },
    });

    return (
        <div 
            {...getRootProps()}
            className={`bg-[#171717] h-64 w-[90%] sm:h-64 sm:w-4xl border-2 border-dashed flex items-center justify-center flex-col gap-3 rounded-md hover:border-blue-500 transition-colors 
            ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-400"}`
            }
        >
            
            <input {...getInputProps()} />

            <UploadIcon size={40} className='text-gray-500' />
            <h1 className='text-gray-500'>Upload your PDF</h1>
            <p className="text-xs text-gray-400">(Drag & drop or click to browse)</p>
        </div>
    );
};

export default UploadPdfBox;