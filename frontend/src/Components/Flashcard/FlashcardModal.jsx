import React, { useState } from 'react';
import { X, Sparkles, RotateCw } from 'lucide-react';

const PYTHON_API = 'http://localhost:8000';
const NODE_API = 'http://localhost:5000';

const FlashcardModal = ({ collectionName, onClose }) => {
    const [topic, setTopic] = useState('');
    const [flashcard, setFlashcard] = useState(null);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!collectionName) {
            setError('Please upload a PDF first.');
            return;
        }

        setIsLoading(true);
        setError('');
        setFlashcard(null);
        setIsFlipped(false);

        try {
            // Step 1 - Generate flashcard from Python backend
            const response = await fetch(`${PYTHON_API}/flashcard/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    collection_name: collectionName,
                    topic: topic.trim()
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail || 'Failed to generate flashcard');
            }

            const data = await response.json();
            setFlashcard(data.flashcard);

            // Step 2 - Save to MongoDB via Node backend (in background)
            const token = localStorage.getItem('token');
            if (token) {
                fetch(`${NODE_API}/api/flashcard/save`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        topic: data.flashcard.topic,
                        collectionName,
                        flashcard: data.flashcard
                    })
                }).catch(err => console.error('Failed to save flashcard:', err));
            }

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
                        Generate Flashcard
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Topic Input */}
                <div className="mb-4">
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Enter a topic (or leave empty for AI to choose)"
                        className="w-full bg-[#0d1117] border border-[#30363d] text-white placeholder-gray-500 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors text-sm"
                    />
                </div>

                {/* Generate Button */}
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 mb-6"
                >
                    {isLoading ? 'Generating...' : 'Generate Flashcard'}
                </button>

                {/* Error */}
                {error && (
                    <p className="text-red-400 text-sm text-center mb-4">{error}</p>
                )}

                {/* Flashcard */}
                {flashcard && (
                    <div className="mt-2">
                        <p className="text-gray-400 text-xs text-center mb-3">
                            Topic: <span className="text-blue-400 font-medium">{flashcard.topic}</span> — Click card to flip
                        </p>

                        {/* Flip Card */}
                        <div
                            onClick={() => setIsFlipped(prev => !prev)}
                            className="cursor-pointer w-full h-48 relative"
                            style={{ perspective: '1000px' }}
                        >
                            <div
                                className="w-full h-full relative transition-transform duration-500"
                                style={{
                                    transformStyle: 'preserve-3d',
                                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                                }}
                            >
                                {/* Front */}
                                <div
                                    className="absolute inset-0 bg-[#0d1117] border border-[#30363d] rounded-2xl flex flex-col items-center justify-center p-6"
                                    style={{ backfaceVisibility: 'hidden' }}
                                >
                                    <p className="text-xs text-blue-400 font-semibold uppercase tracking-widest mb-3">Question</p>
                                    <p className="text-white text-center text-sm leading-relaxed">{flashcard.front}</p>
                                </div>

                                {/* Back */}
                                <div
                                    className="absolute inset-0 bg-blue-600 border border-blue-500 rounded-2xl flex flex-col items-center justify-center p-6"
                                    style={{
                                        backfaceVisibility: 'hidden',
                                        transform: 'rotateY(180deg)'
                                    }}
                                >
                                    <p className="text-xs text-white/70 font-semibold uppercase tracking-widest mb-3">Answer</p>
                                    <p className="text-white text-center text-sm leading-relaxed">{flashcard.back}</p>
                                </div>
                            </div>
                        </div>

                        {/* Generate Another */}
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className="mt-4 w-full flex items-center justify-center gap-2 border border-[#30363d] text-gray-400 hover:text-white hover:border-gray-400 py-2 rounded-xl transition-all duration-200 text-sm"
                        >
                            <RotateCw className="w-4 h-4" />
                            Generate Another
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FlashcardModal;