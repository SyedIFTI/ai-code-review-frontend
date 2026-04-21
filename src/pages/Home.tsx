import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { javascript } from '@codemirror/lang-javascript';
import { useNavigate } from 'react-router-dom';
import uuid from 'uuid-random';

const Home = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');

  const handleStartReview = () => {
    let reviewid  = uuid()
    navigate(`/review/${reviewid}`, { state: { initialCode: code } });
    
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col items-center justify-center w-full max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-500/10 mb-6 border border-violet-500/20">
          <span className="text-3xl">✨</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          What would you like to review?
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Paste your code snippets below, and our AI will provide instant feedback, find potential bugs, and suggest improvements.
        </p>
      </div>

      <div className="w-full bg-[#111111] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl relative transition-all duration-300 hover:shadow-violet-900/20 focus-within:border-violet-500/50 focus-within:shadow-violet-900/20">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-[#1a1a1a]">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-400 tracking-wider">YOUR CODE</span>
          </div>
          <button 
            onClick={handleStartReview}
            disabled={!code.trim()}
            className="bg-violet-600 hover:bg-violet-500 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 shadow-lg"
          >
            Start Code Review
            {!code.trim() ? null : (
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            )}
          </button>
        </div>
        <div className="relative h-[400px]">
          <CodeMirror
            value={code}
            height="400px"
            theme={vscodeDark}
            extensions={[javascript({ jsx: true })]}
            onChange={(value) => setCode(value)}
            className="absolute inset-0 h-full text-base font-mono [&>.cm-editor]:h-full"
            basicSetup={{
              lineNumbers: true,
              highlightActiveLineGutter: true,
              dropCursor: true,
            }}
          />
          {code.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 bg-[#1e1e1e]/40 backdrop-blur-[1px]">
              <div className="text-center p-8 border border-gray-800/50 rounded-2xl bg-[#1a1a1a]/80 shadow-2xl">
                <div className="text-5xl mb-4 opacity-50">💻</div>
                <p className="text-gray-300 font-medium text-lg mb-1">Ready to analyze</p>
                <p className="text-gray-500 text-sm">Paste your code or start typing...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;