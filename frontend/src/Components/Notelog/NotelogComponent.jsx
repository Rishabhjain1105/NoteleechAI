import React, { useState, useEffect } from "react";
import NotelogNavbar from "../Header/NotelogNavbar/NotelogNavbar";
import { useNavigate } from "react-router-dom";
import { X, RotateCw } from "lucide-react";

const NODE_API = "http://localhost:5000";

export default function NotelogComponent() {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // For the expanded collection viewer
  const [selectedCollection, setSelectedCollection] = useState(null); // array of flashcards
  const [selectedCollectionName, setSelectedCollectionName] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    fetch(`${NODE_API}/api/flashcard/all`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setFlashcards(data.flashcards || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load flashcards. Make sure you are logged in.");
        setLoading(false);
      });
  }, []);

  // Group flashcards by collectionName
  const grouped = flashcards.reduce((acc, fc) => {
    const key = fc.collectionName;
    if (!acc[key]) acc[key] = [];
    acc[key].push(fc);
    return acc;
  }, {});

  // Build collection summary cards + apply date filter
  const collections = Object.entries(grouped)
    .map(([name, cards]) => ({
      name,
      cards,
      count: cards.length,
      latestDate: cards[0]?.createdAt?.slice(0, 10) ?? "",
      topics: [...new Set(cards.map((c) => c.topic))].slice(0, 3),
    }))
    .filter((c) => !filterDate || c.latestDate >= filterDate);

  // Open a collection for browsing
  const openCollection = (col) => {
    setSelectedCollection(col.cards);
    setSelectedCollectionName(col.name);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const closeCollection = () => {
    setSelectedCollection(null);
    setSelectedCollectionName("");
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const goPrev = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((i) => Math.max(0, i - 1)), 150);
  };

  const goNext = () => {
    setIsFlipped(false);
    setTimeout(
      () =>
        setCurrentIndex((i) =>
          Math.min(selectedCollection.length - 1, i + 1)
        ),
      150
    );
  };

  const currentCard = selectedCollection?.[currentIndex]?.flashcard;

  return (
    <>
      <NotelogNavbar />
      <div className="min-h-screen bg-[#0d1117] text-white pt-20 px-12">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Flashcards</h1>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-3 py-2 rounded-md bg-[#171717] text-white border border-gray-600 cursor-pointer"
          />
        </div>

        {/* States */}
        {loading && (
          <p className="text-gray-400">Loading your flashcards...</p>
        )}
        {error && <p className="text-red-400">{error}</p>}

        {/* Collection Grid */}
        {!loading && !error && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {collections.length === 0 ? (
              <p className="text-gray-400 col-span-full">
                No flashcards found. Generate some from the Dashboard first!
              </p>
            ) : (
              collections.map((col) => (
                <div
                  key={col.name}
                  onClick={() => openCollection(col)}
                  className="bg-[#171717] border border-gray-600 rounded-xl p-5 shadow-md hover:shadow-lg hover:border-gray-100 transition cursor-pointer"
                >
                  <h2 className="text-xl font-semibold truncate">{col.name}</h2>
                  <p className="text-gray-400 text-sm mt-1">{col.latestDate}</p>
                  <p className="mt-2 text-blue-400 font-medium">
                    {col.count} flashcard{col.count !== 1 ? "s" : ""}
                  </p>
                  <p className="mt-1 text-gray-500 text-xs truncate">
                    Topics: {col.topics.join(", ")}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Flashcard Viewer Modal */}
      {selectedCollection && currentCard && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl w-full max-w-lg p-6">

            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-white text-lg font-semibold truncate max-w-xs">
                  {selectedCollectionName}
                </h2>
                <p className="text-gray-500 text-xs mt-0.5">
                  {currentIndex + 1} / {selectedCollection.length}
                </p>
              </div>
              <button
                onClick={closeCollection}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Topic Label */}
            <p className="text-center text-xs text-blue-400 font-medium mb-3">
              Topic: {currentCard.topic}
            </p>

            {/* Flip Card */}
            <div
              onClick={() => setIsFlipped((f) => !f)}
              className="cursor-pointer w-full h-52 relative"
              style={{ perspective: "1000px" }}
            >
              <div
                className="w-full h-full relative transition-transform duration-500"
                style={{
                  transformStyle: "preserve-3d",
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                {/* Front */}
                <div
                  className="absolute inset-0 bg-[#0d1117] border border-[#30363d] rounded-2xl flex flex-col items-center justify-center p-6"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <p className="text-xs text-blue-400 font-semibold uppercase tracking-widest mb-3">
                    Question
                  </p>
                  <p className="text-white text-center text-sm leading-relaxed">
                    {currentCard.front}
                  </p>
                </div>

                {/* Back */}
                <div
                  className="absolute inset-0 bg-blue-600 border border-blue-500 rounded-2xl flex flex-col items-center justify-center p-6"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <p className="text-xs text-white/70 font-semibold uppercase tracking-widest mb-3">
                    Answer
                  </p>
                  <p className="text-white text-center text-sm leading-relaxed">
                    {currentCard.back}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-center text-gray-600 text-xs mt-2">
              Click card to flip
            </p>

            {/* Prev / Next */}
            <div className="flex items-center justify-between mt-5">
              <button
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="px-4 py-2 rounded-xl border border-[#30363d] text-gray-400 hover:text-white hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition text-sm"
              >
                ← Prev
              </button>

              <button
                onClick={() => setIsFlipped((f) => !f)}
                className="flex items-center gap-1 text-gray-400 hover:text-white text-sm transition"
              >
                <RotateCw className="w-4 h-4" /> Flip
              </button>

              <button
                onClick={goNext}
                disabled={currentIndex === selectedCollection.length - 1}
                className="px-4 py-2 rounded-xl border border-[#30363d] text-gray-400 hover:text-white hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition text-sm"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}