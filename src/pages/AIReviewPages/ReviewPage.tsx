// ReviewPage.tsx

import { useState, useEffect, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import axios from 'axios';
import { parse } from 'partial-json';
import { useLocation, useParams } from 'react-router-dom';
import type { AIReviewResponse } from '../../types/tpes';
import apiClient from '../../hooks/apiClient';
import toast from 'react-hot-toast';

export default function ReviewPage() {
  const location = useLocation();
  const [code, setCode] = useState(location.state?.initialCode || '');
  const [language, setLanguage] = useState('javascript');
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewResult, setReviewResult] = useState<AIReviewResponse | null>(null);
  const { reviewId } = useParams();
  const hasStartedReview = useRef(false);
  const selectedHistory = location.state?.selectedHistory;

  const getLanguageExtension = (lang: string) => {
    switch (lang) {
      case 'javascript':
      case 'typescript':
        return [javascript({ jsx: true, typescript: lang === 'typescript' })];
      case 'python':
        return [python()];
      default:
        // fallback to javascript for syntax highlighting
        return [javascript()];
    }
  };

  const handleReview = async () => {
    if (!code.trim()) return;

    try {
      setIsReviewing(true)
      const response = await apiClient.post(`/api/v1/ai/review-code`, { code, language, id: reviewId }, {
        withCredentials: true, responseType: 'stream',
        adapter: 'fetch'
      })
      const stream = response.data
      const reader = stream.pipeThrough(new TextDecoderStream()).getReader()
      let fullResponse = "";
      while (true) {
        const { done, value } = await reader.read()
        if (done) break;
        fullResponse += value
        const parsedData = parse(fullResponse)
        // console.log("ParsedData", parsedData)
        setReviewResult(parsedData as AIReviewResponse)

      }

    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Failed to analyze code. Please check your connection.';
      toast.error(errorMessage);
      console.error('Review failed:', errorMessage);
    } finally {
      setIsReviewing(false)
    }


  };
  useEffect(() => {
    if (selectedHistory && reviewId) {
      const fetchSelectedHistoryData = async () => {
        try {
          const response = await apiClient.get(`/api/v1/ai/history/${reviewId}`, { withCredentials: true })
          const fetchedData = response.data.data;
          
          if (fetchedData && fetchedData.reviews) {
            setCode(fetchedData.reviews.codeSnippet);
            setLanguage(fetchedData.reviews.language);
            
            if (fetchedData.items && fetchedData.items.length > 0) {
              const item = fetchedData.items[0];
              const mappedResult: AIReviewResponse = {
                category: item.category,
                severity: item.severity,
                description: item.message,
                location: item.lineNumber,
                recommendation: item.suggestion,
                NewCodeVersion: {
                  code: item.codeSnippet
                }
              };
              setReviewResult(mappedResult);
            } else {
              setReviewResult(null);
            }
          }
        } catch (error: any) {
          toast.error(error?.response?.data?.message || 'Failed to fetch selected history item.');
          console.error(error?.response?.data)
        }
      }
      fetchSelectedHistoryData()
    }
  }, [selectedHistory, reviewId]);

  useEffect(() => {
    // If the page loaded with initial code and we haven't started reviewing yet
    if (location.state?.initialCode && code.trim() && !hasStartedReview.current) {
      hasStartedReview.current = true;
      handleReview();
    }
  }, [location.state?.initialCode, code]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-140px)]">

      {/* Left Panel - Code Input */}
      <div className="flex flex-col bg-[#111111] border border-gray-800 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-gray-800 flex items-center justify-between bg-[#1a1a1a]">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-400">YOUR CODE</span>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-[#1f1f1f] border border-gray-700 text-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-violet-500"
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
            </select>

            <button
              onClick={handleReview}
              // disabled={!code.trim() || isReviewing}
              className="bg-violet-600 hover:bg-violet-700 disabled:bg-gray-700 disabled:text-gray-400 px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
            >
              {isReviewing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Reviewing...
                </>
              ) : (
                'Review My Code'
              )}
            </button>
          </div>
        </div>

        {/* Code Editor Area */}
        <div className="flex-1 relative bg-[#1e1e1e] overflow-hidden">
          <CodeMirror
            value={code}
            height="100%"
            theme={vscodeDark}
            extensions={getLanguageExtension(language)}
            onChange={(value) => setCode(value)}
            className="absolute inset-0 h-full text-sm font-mono [&>.cm-editor]:h-full"
            basicSetup={{
              lineNumbers: true,
              highlightActiveLineGutter: true,
              highlightSpecialChars: true,
              history: true,
              foldGutter: true,
              drawSelection: true,
              dropCursor: true,
              allowMultipleSelections: true,
              indentOnInput: true,
              syntaxHighlighting: true,
              bracketMatching: true,
              closeBrackets: true,
              autocompletion: true,
              rectangularSelection: true,
              crosshairCursor: true,
              highlightActiveLine: true,
              highlightSelectionMatches: true,
              closeBracketsKeymap: true,
              defaultKeymap: true,
              searchKeymap: true,
              historyKeymap: true,
              foldKeymap: true,
              completionKeymap: true,
              lintKeymap: true,
            }}
          />

          {code.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 bg-[#1e1e1e]/60">
              <div className="text-center">
                <div className="text-6xl mb-4 opacity-20">💻</div>
                <p className="text-gray-500 text-sm">Your code will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Results */}
      <div className="flex flex-col bg-[#111111] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-gray-800 bg-[#1a1a1a] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-400">AI REVIEW RESULTS</span>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-auto custom-scrollbar">
          {reviewResult ? (
            <div className="flex flex-col gap-6 text-sm text-gray-300 font-light leading-relaxed">
              {/* Summary Section */}
              {reviewResult.summary && (
                <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-xl">📋</div>
                    <h3 className="text-lg font-semibold text-white">Summary</h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    {reviewResult.summary}
                  </p>
                </div>
              )}

              {/* Main Issue Section */}
              {(reviewResult.category || reviewResult.severity || reviewResult.description) && (
                <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-5 shadow-sm relative overflow-hidden">
                  {/* Decorative gradient based on severity */}
                  <div className={`absolute top-0 left-0 w-1 h-full ${reviewResult.severity === 'critical' ? 'bg-red-500' :
                      reviewResult.severity === 'warning' ? 'bg-yellow-500' :
                        reviewResult.severity === 'info' ? 'bg-blue-500' : 'bg-gray-500'
                    }`} />

                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider ${reviewResult.severity === 'critical' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        reviewResult.severity === 'warning' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                          'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                      {reviewResult.severity || 'Issue'}
                    </span>

                    {reviewResult.category && (
                      <span className="text-gray-400 text-xs px-2.5 py-1 bg-[#222] border border-gray-700 rounded-md uppercase tracking-wider font-medium">
                        {reviewResult.category}
                      </span>
                    )}
                  </div>

                  {reviewResult.description && (
                    <p className="text-gray-200 text-sm mb-4 leading-relaxed">
                      {reviewResult.description}
                    </p>
                  )}

                  {reviewResult.location && (
                    <div className="mb-4">
                      <span className="text-xs text-gray-500 uppercase font-semibold mb-1 block">Location</span>
                      <div className="text-xs font-mono bg-[#111] p-3 rounded-lg text-red-300/90 border border-gray-800/50 inline-block font-medium">
                        {reviewResult.location}
                      </div>
                    </div>
                  )}

                  {reviewResult.recommendation && (
                    <div className="mt-4 pt-4 border-t border-gray-800/50">
                      <span className="text-xs text-green-500/80 uppercase font-semibold mb-2 flex items-center gap-1.5">
                        <span className="text-base">💡</span> Recommendation
                      </span>
                      <p className="text-sm text-green-100/80 leading-relaxed bg-green-500/5 p-3 rounded-lg border border-green-500/10">
                        {reviewResult.recommendation}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Refactored Code */}
              {reviewResult.NewCodeVersion?.code && (
                <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
                  <div className="px-5 py-3 border-b border-gray-800 bg-[#151515] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-green-400 text-lg">✨</span>
                      <h3 className="text-sm font-semibold text-gray-200">Refactored Code</h3>
                    </div>
                    <button
                      onClick={() => navigator.clipboard.writeText(reviewResult.NewCodeVersion!.code!)}
                      className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 bg-[#222] px-2.5 py-1.5 rounded-md border border-gray-700 hover:border-gray-500"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                      Copy
                    </button>
                  </div>
                  <div className="relative bg-[#0d0d0d]">
                    <CodeMirror
                      value={reviewResult.NewCodeVersion.code}
                      theme={vscodeDark}
                      extensions={getLanguageExtension(language)}
                      readOnly={true}
                      basicSetup={{
                        lineNumbers: true,
                        foldGutter: true,
                        highlightActiveLine: false
                      }}
                      className="text-sm font-mono max-h-[400px] overflow-y-auto custom-scrollbar [&>.cm-editor]:bg-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-[#1a1a1a] border border-gray-800 rounded-2xl flex items-center justify-center mb-6 shadow-lg relative overflow-hidden group">
                <div className="absolute inset-0 bg-violet-500/10 group-hover:bg-violet-500/20 transition-colors"></div>
                <span className="text-4xl relative z-10 animate-pulse">✨</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-200 mb-3 tracking-tight">Ready for Review</h3>
              <p className="text-gray-400 max-w-sm text-sm leading-relaxed">
                Paste your code on the left and click <span className="text-violet-400 font-medium bg-violet-500/10 px-1.5 py-0.5 rounded">Review My Code</span> to get intelligent, context-aware feedback.
              </p>
            </div>
          )}
        </div>

        {reviewResult && (
          <div className="p-5 border-t border-gray-800 bg-[#151515] flex gap-4">
            <button className="flex-1 py-2.5 bg-[#222] hover:bg-[#2a2a2a] border border-gray-700/50 rounded-lg text-sm font-semibold text-gray-300 transition-all flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
              Ask Follow-up
            </button>
            <button className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-500 hover:shadow-[0_0_15px_rgba(124,58,237,0.3)] border border-violet-500 rounded-lg text-sm font-semibold text-white transition-all flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              Improve Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
}