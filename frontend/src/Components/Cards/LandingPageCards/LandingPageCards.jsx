import React from 'react';

const LandingPageCards = () => {

    const items = [
        {icon: "🤖", title: "Chat With PDF" , description: "Chat with your PDF file for whatever you want to understand!"},

        {icon: "🪄", title: "Create Magical Notes" , description: "Create lovely notes that you can stick to with your raw notes"},

        {icon: "📜", title: "Generate FlashCards" , description: "Generate Flashcards for easy remembrance of the topic"},

        {icon: "🧑🏻‍🎓", title: "Get Important Q/A" , description: "All the important questions at your footstep with answers"}
    ]

    return (
        <>
            {items.map((item) => (
                <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl p-6 w-72 border border-blue-500/20 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105">
                    <div className="text-4xl mb-4 drop-shadow-lg">{item.icon}</div>
                    <h2 className="text-blue-400 font-semibold mb-2 text-lg">{item.title}</h2>
                    <p className="text-gray-300 text-sm leading-relaxed">
                        {item.description}
                    </p>
                </div>
            ))}
        </>
    );
};

export default LandingPageCards;