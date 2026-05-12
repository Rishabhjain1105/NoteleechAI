import React from 'react';

const AboutUsSection = () => (
  <section className="py-20 px-6 bg-gradient-to-b from-zinc-900 to-zinc-950">
    <div className="max-w-4xl mx-auto text-center space-y-8">
      <h2 className="text-4xl md:text-5xl font-bold text-white">
        About <span className="bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">NoteLeech-AI</span>
      </h2>
      <p className="text-lg text-gray-300 leading-relaxed">
        At <strong>NoteLeech-AI</strong>, we’re reimagining the world of note-taking. Our vision is to empower learners, professionals, and creators with AI-driven tools that simplify information capture, enhance clarity, and boost productivity.
      </p>
      <div className="flex flex-col md:flex-row justify-center gap-8 mt-12">
        <div className="flex-1 bg-gradient-to-br from-zinc-800 to-zinc-900 p-8 rounded-2xl border border-blue-500/20 hover:border-blue-400/50 transition-all duration-300">
          <h3 className="text-2xl font-semibold text-blue-400 mb-2">Our Mission</h3>
          <p className="text-gray-300 leading-relaxed">
            To craft intuitive AI tools that make note management effortless, insightful, and seamlessly integrated into your workflow.
          </p>
        </div>
        <div className="flex-1 bg-gradient-to-br from-zinc-800 to-zinc-900 p-8 rounded-2xl border border-blue-500/20 hover:border-blue-400/50 transition-all duration-300">
          <h3 className="text-2xl font-semibold text-blue-400 mb-2">Who We Serve</h3>
          <p className="text-gray-300 leading-relaxed">
            Educators, students, professionals in law, medicine, research, and anyone passionate about retaining and organizing knowledge efficiently.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default AboutUsSection;