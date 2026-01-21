
import React, { useState } from 'react';
import { AppStatus, TranscriptionResult } from './types';
import { transcribeAudio } from './services/geminiService';
import TranscriptionView from './components/TranscriptionView';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TranscriptionResult | null>(null);
  const [progress, setProgress] = useState<string>('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Limit to 20MB for performance and stability
    if (file.size > 20 * 1024 * 1024) {
      setError("파일 크기가 너무 큽니다. 20MB 이하의 MP3 파일을 업로드해주세요.");
      return;
    }

    try {
      setStatus(AppStatus.UPLOADING);
      setProgress('오디오 파일을 읽는 중...');
      setError(null);

      setStatus(AppStatus.TRANSCRIBING);
      setProgress('AI가 오디오를 분석하여 텍스트로 변환 중입니다 (약 1분 소요)...');
      
      const text = await transcribeAudio(file);
      
      setResult({
        text,
        fileName: file.name,
        timestamp: Date.now(),
      });
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      setError(err.message || "변환 중 예기치 않은 오류가 발생했습니다.");
      setStatus(AppStatus.ERROR);
    }
  };

  const reset = () => {
    setStatus(AppStatus.IDLE);
    setError(null);
    setResult(null);
    setProgress('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-3xl w-full text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl mb-4">
          VoxScribe <span className="text-indigo-600">AI</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          MP3 파일을 업로드하면 고성능 AI가 정확하게 텍스트로 변환해 드립니다.
        </p>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Upload State */}
        {(status === AppStatus.IDLE || status === AppStatus.ERROR) && (
          <div className="p-16 text-center">
            <div className="mb-10 flex justify-center">
              <div className="p-8 bg-indigo-50 rounded-3xl">
                <svg className="w-16 h-16 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
                </svg>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-slate-800 mb-3">변환할 MP3 파일 선택</h2>
            <p className="text-slate-500 mb-10 max-w-sm mx-auto">기기에 저장된 오디오 파일을 선택해주세요. (최대 20MB)</p>
            
            <label className="group relative inline-flex items-center px-10 py-5 border border-transparent text-xl font-semibold rounded-2xl shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 cursor-pointer transition-all active:scale-95">
              <span>파일 불러오기</span>
              <input type="file" className="hidden" accept="audio/*" onChange={handleFileUpload} />
            </label>

            {status === AppStatus.ERROR && (
              <div className="mt-8 p-5 bg-rose-50 text-rose-700 rounded-2xl border border-rose-100 flex items-start gap-3 text-left">
                <svg className="w-6 h-6 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-bold">오류 발생</p>
                  <p className="text-sm opacity-90">{error}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {(status === AppStatus.UPLOADING || status === AppStatus.TRANSCRIBING) && (
          <div className="p-24 flex flex-col items-center justify-center text-center">
            <div className="relative mb-10">
              <div className="w-24 h-24 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">처리 중...</h3>
            <p className="text-slate-500 animate-pulse font-medium">{progress}</p>
          </div>
        )}

        {/* Success State */}
        {status === AppStatus.SUCCESS && result && (
          <TranscriptionView result={result} onReset={reset} />
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-12 text-center text-slate-400 text-sm">
        <p>© 2024 VoxScribe AI - Professional MP3 to Text</p>
        <p className="mt-3 flex items-center justify-center gap-1.5 font-medium">
          <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Google Gemini 3 Pro를 사용한 정밀 보안 처리
        </p>
      </div>
    </div>
  );
};

export default App;
