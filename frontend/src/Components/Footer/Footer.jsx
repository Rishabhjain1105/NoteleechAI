import React from 'react';

const Footer = () => (
  <footer className="bg-gradient-to-t from-black via-zinc-950 to-zinc-900 text-gray-300 py-12 w-full border-t border-blue-500/20">
    <div className="px-6 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {/* Logo / Brand */}
      <div className="text-center md:text-left">
        <h3 className="text-2xl font-bold text-blue-400">NoteLeech-AI</h3>
        <p className="mt-2 text-sm text-gray-400">
          AI-powered note management that elevates your workflow.
        </p>
      </div>

      {/* Navigation Links */}
      <div className="text-center">
        <h4 className="font-semibold text-white mb-3">Product</h4>
        <ul className="space-y-2 text-sm">
          <li><a href="#features" className="text-gray-400 hover:text-blue-400 transition-colors">Features</a></li>
          <li><a href="#about" className="text-gray-400 hover:text-blue-400 transition-colors">About Us</a></li>
          <li><a href="#pricing" className="text-gray-400 hover:text-blue-400 transition-colors">Pricing</a></li>
          <li><a href="#contact" className="text-gray-400 hover:text-blue-400 transition-colors">Contact</a></li>
        </ul>
      </div>

      {/* Legal */}
      <div className="text-center md:text-right text-sm">
        <a href="/privacy" className="text-gray-400 hover:text-blue-400 transition-colors block">Privacy Policy</a>
        <a href="/terms" className="text-gray-400 hover:text-blue-400 transition-colors block mt-2">Terms of Service</a>
        <p className="mt-4 text-gray-500">&copy; {new Date().getFullYear()} NoteLeech-AI. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
