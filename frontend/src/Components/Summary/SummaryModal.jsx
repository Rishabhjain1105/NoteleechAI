import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';

const PYTHON_API = 'http://localhost:8000';

const SummaryModal = ({ collectionName, onClose }) => {
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        generateSummary();
    }, []);

    const generateSummary = async () => {
        setIsLoading(true);
        setError('');
        setSummary('');

        try {
            const response = await fetch(`${PYTHON_API}/summary/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ collection_name: collectionName })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail || 'Failed to generate summary');
            }

            const data = await response.json();
            setSummary(data.summary);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl w-full max-w-2xl mx-4 p-6 max-h-[80vh] flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-white text-xl font-semibold flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-blue-400" />
                        Document Summary
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-40 gap-3">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            </div>
                            <p className="text-gray-400 text-sm">Generating summary...</p>
                        </div>
                    )}

                    {error && (
                        <p className="text-red-400 text-sm text-center">{error}</p>
                    )}

                    {summary && (
                        <div className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap bg-[#0d1117] border border-[#30363d] rounded-xl p-5">
                            {summary}
                        </div>
                    )}
                </div>

                {/* Regenerate */}
                {!isLoading && (
                    <button
                        onClick={generateSummary}
                        className="mt-4 w-full border border-[#30363d] text-gray-400 hover:text-white hover:border-gray-400 py-2 rounded-xl transition-all duration-200 text-sm"
                    >
                        Regenerate Summary
                    </button>
                )}
            </div>
        </div>
    );
};

export default SummaryModal;