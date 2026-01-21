
import React, { useState } from 'react';
import { TranscriptionResult } from '../types';

interface TranscriptionViewProps {
  result: TranscriptionResult;
  onReset: () => void;
}

const TranscriptionView: React.FC<TranscriptionViewProps> = ({ result, onReset }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadText = () => {
    const element = document.createElement("a");
    const file = new Blob([result.text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${result.fileName.split('.')[0]}_transcription.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Result Header */}
      <div className="bg-gray-50 border-b border-gray-100 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 truncate max-w-xs md:max-w-md">
            {result.fileName}
          </h3>
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            Transcribed on {new Date(result.timestamp).toLocaleString()}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Home Button */}
          <button 
            onClick={onReset}
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            처음으로
          </button>

          {/* Copy Button */}
          <button 
            onClick={copyToClipboard}
            className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm ${
              copied 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {copied ? (
              <>
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                복사됨!
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                텍스트 복사
              </>
            )}
          </button>
          
          {/* Download Button */}
          <button 
            onClick={downloadText}
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            다운로드
          </button>
        </div>
      </div>

      {/* Transcription Content */}
      <div className="p-8 max-h-[600px] overflow-y-auto bg-white">
        <div className="prose prose-slate max-w-none">
          <p className="whitespace-pre-wrap text-slate-700 leading-relaxed text-lg">
            {result.text}
          </p>
        </div>
      </div>

      {/* Result Footer */}
      <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-center">
        <button 
          onClick={onReset}
          className="group text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center"
        >
          <svg className="w-4 h-4 mr-1 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          다른 파일 변환하기
        </button>
      </div>
    </div>
  );
};

export default TranscriptionView;
