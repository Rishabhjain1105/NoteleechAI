import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';

const PYTHON_API = 'http://localhost:8000';

const CruxModal = ({ collectionName, onClose }) => {
    const [crux, setCrux] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        generateCrux();
    }, []);

    const generateCrux = async () => {
        setIsLoading(true);
        setError('');
        setCrux('');

        try {
            const response = await fetch(`${PYTHON_API}/crux/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ collection_name: collectionName })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail || 'Failed to generate crux');
            }

            const data = await response.json();
            setCrux(data.crux);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl w-full max-w-lg mx-4 p-6">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-white text-xl font-semibold flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-blue-400" />
                        Crux of Document
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="min-h-24">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-24 gap-3">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            </div>
                            <p className="text-gray-400 text-sm">Finding the crux...</p>
                        </div>
                    )}

                    {error && (
                        <p className="text-red-400 text-sm text-center">{error}</p>
                    )}

                    {crux && (
                        <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-5">
                            <p className="text-gray-200 text-sm leading-relaxed">{crux}</p>
                        </div>
                    )}
                </div>

                {/* Regenerate */}
                {!isLoading && (
                    <button
                        onClick={generateCrux}
                        className="mt-4 w-full border border-[#30363d] text-gray-400 hover:text-white hover:border-gray-400 py-2 rounded-xl transition-all duration-200 text-sm"
                    >
                        Regenerate
                    </button>
                )}
            </div>
        </div>
    );
};

export default CruxModal;