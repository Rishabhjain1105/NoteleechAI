import React, { useState, useEffect } from 'react';
import { X, Sparkles, CheckCircle, XCircle, RotateCw } from 'lucide-react';

const PYTHON_API = 'http://localhost:8000';

const QuizModal = ({ collectionName, onClose }) => {
    const [quiz, setQuiz] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        generateQuiz();
    }, []);

    const generateQuiz = async () => {
        setIsLoading(true);
        setError('');
        setQuiz([]);
        setSelectedAnswers({});
        setSubmitted(false);
        setScore(0);

        try {
            const response = await fetch(`${PYTHON_API}/quiz/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ collection_name: collectionName })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail || 'Failed to generate quiz');
            }

            const data = await response.json();
            setQuiz(data.quiz);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelect = (questionIndex, option) => {
        if (submitted) return;
        setSelectedAnswers(prev => ({ ...prev, [questionIndex]: option }));
    };

    const handleSubmit = () => {
        let correct = 0;
        quiz.forEach((q, index) => {
            if (selectedAnswers[index] === q.correct_answer) correct++;
        });
        setScore(correct);
        setSubmitted(true);
    };

    const allAnswered = quiz.length > 0 && Object.keys(selectedAnswers).length === quiz.length;

    const getOptionStyle = (questionIndex, option) => {
        const isSelected = selectedAnswers[questionIndex] === option;
        const isCorrect = quiz[questionIndex].correct_answer === option;

        if (!submitted) {
            return isSelected
                ? 'border-blue-500 bg-blue-600/20 text-white'
                : 'border-[#30363d] text-gray-300 hover:border-gray-400';
        }

        if (isCorrect) return 'border-green-500 bg-green-600/20 text-green-300';
        if (isSelected && !isCorrect) return 'border-red-500 bg-red-600/20 text-red-300';
        return 'border-[#30363d] text-gray-500';
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl w-full max-w-2xl mx-4 p-6 max-h-[90vh] flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-white text-xl font-semibold flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-blue-400" />
                        Quiz
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Loading */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center h-40 gap-3">
                        <div className="flex gap-1">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                        <p className="text-gray-400 text-sm">Generating quiz questions...</p>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <p className="text-red-400 text-sm text-center">{error}</p>
                )}

                {/* Score */}
                {submitted && (
                    <div className={`mb-4 p-4 rounded-xl text-center border ${
                        score === quiz.length ? 'bg-green-600/20 border-green-500' :
                        score >= quiz.length / 2 ? 'bg-blue-600/20 border-blue-500' :
                        'bg-red-600/20 border-red-500'
                    }`}>
                        <p className="text-white font-semibold text-lg">
                            You scored {score} / {quiz.length}
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                            {score === quiz.length ? 'Perfect score! 🎉' :
                             score >= quiz.length / 2 ? 'Good job! Keep going 💪' :
                             'Keep studying, you got this! 📚'}
                        </p>
                    </div>
                )}

                {/* Questions */}
                <div className="flex-1 overflow-y-auto flex flex-col gap-6 pr-1">
                    {quiz.map((q, qIndex) => (
                        <div key={qIndex} className="bg-[#0d1117] border border-[#30363d] rounded-xl p-5">
                            <div className="flex items-start gap-2 mb-4">
                                {submitted && (
                                    selectedAnswers[qIndex] === q.correct_answer
                                        ? <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                        : <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                )}
                                <p className="text-white text-sm font-medium">
                                    {qIndex + 1}. {q.question}
                                </p>
                            </div>

                            <div className="flex flex-col gap-2">
                                {q.options.map((option, oIndex) => (
                                    <button
                                        key={oIndex}
                                        onClick={() => handleSelect(qIndex, option)}
                                        className={`text-left px-4 py-2.5 rounded-lg border text-sm transition-all duration-200 ${getOptionStyle(qIndex, option)}`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Buttons */}
                {!isLoading && quiz.length > 0 && (
                    <div className="mt-4 flex gap-3">
                        {!submitted ? (
                            <button
                                onClick={handleSubmit}
                                disabled={!allAnswered}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 text-sm"
                            >
                                {allAnswered ? 'Submit Quiz' : `Answer all questions to submit`}
                            </button>
                        ) : (
                            <button
                                onClick={generateQuiz}
                                className="flex-1 flex items-center justify-center gap-2 border border-[#30363d] text-gray-400 hover:text-white hover:border-gray-400 py-3 rounded-xl transition-all duration-200 text-sm"
                            >
                                <RotateCw className="w-4 h-4" />
                                Try New Quiz
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizModal;