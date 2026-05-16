import React, { useState } from 'react';
import { X, Sparkles, Download, FileText } from 'lucide-react';

const PYTHON_API = 'http://localhost:8000';

const NotesModal = ({ collectionName, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [generated, setGenerated] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        setError('');
        setGenerated(false);

        try {
            const response = await fetch(`${PYTHON_API}/notes/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ collection_name: collectionName })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail || 'Failed to generate notes');
            }

            // Get the PDF blob and trigger download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `notes_${collectionName}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            setGenerated(true);

        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl w-full max-w-md mx-4 p-6">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-white text-xl font-semibold flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-blue-400" />
                        Generate Structured Notes
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Info */}
                <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-white text-sm font-medium mb-1">What this does</p>
                            <p className="text-gray-400 text-xs leading-relaxed">
                                Reads your PDF, organizes all topics with clear headings and explanations, 
                                and generates a clean structured PDF you can download and study from.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <p className="text-red-400 text-sm text-center mb-4">{error}</p>
                )}

                {/* Success */}
                {generated && (
                    <div className="bg-green-600/20 border border-green-500 rounded-xl p-3 mb-4 text-center">
                        <p className="text-green-400 text-sm">
                            ✓ Notes downloaded successfully!
                        </p>
                    </div>
                )}

                {/* Generate Button */}
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            </div>
                            Generating Notes...
                        </>
                    ) : (
                        <>
                            <Download className="w-4 h-4" />
                            {generated ? 'Download Again' : 'Generate & Download PDF'}
                        </>
                    )}
                </button>

                <p className="text-gray-500 text-xs text-center mt-3">
                    This may take 10-20 seconds depending on PDF size
                </p>
            </div>
        </div>
    );
};

export default NotesModal;