import { useState, useCallback } from 'react';
import { useVideoDownloader } from './hooks/useVideoDownloader';
import VideoPreview from './components/VideoPreview';
import Features from './components/Features';
import Footer from './components/Footer';

export default function App() {
  const {
    url,
    setUrl,
    status,
    progress,
    videoData,
    error,
    fetchingStep,
    processVideo,
    reset,
    clearError,
  } = useVideoDownloader();

  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        clearError();
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.warn('Clipboard read failed:', err);
      // Fallback: focus input so user can paste manually
      const input = document.querySelector<HTMLInputElement>('input[type="text"]');
      if (input) {
        input.focus();
        try {
          const text = await navigator.clipboard.readText();
          if (text) {
            setUrl(text);
            clearError();
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            return;
          }
        } catch {}
      }
      // Last resort: try document.execCommand fallback
      try {
        const input = document.querySelector<HTMLInputElement>('input[type="text"]');
        if (input) {
          input.focus();
          document.execCommand('paste');
        }
      } catch {
        // If all fails, just focus the input
        console.warn('All clipboard methods failed');
      }
    }
  }, [clearError]);

  const handleRedirectDownload = () => {
    const videoUrl = url.trim();
    if (videoUrl) {
      window.open(`https://fdown.net/?url=${encodeURIComponent(videoUrl)}`, '_blank');
    }
  };

  return (
    <div className="bg-mesh min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-9 h-9 bg-gradient-to-br from-fb-blue to-fb-blue-light rounded-lg flex items-center justify-center shadow-lg shadow-fb-blue/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
              </div>
              <span className="text-xl font-bold gradient-text">FBVideo</span>
              <span className="text-xl font-bold text-white/40">Downloader</span>
            </a>

            {/* Desktop Menu Bar */}
            <div className="hidden md:flex items-center gap-3">
              {/* Home Button */}
              <a
                href="/"
                className="group flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              >
                <svg className="w-4 h-4 group-hover:text-fb-blue-light transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                Home
              </a>

              {/* FB Video Downloader Button */}
              <a
                href="#downloader"
                className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-fb-blue to-fb-blue-light hover:from-fb-blue-dark hover:to-fb-blue text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-fb-blue/20 hover:shadow-fb-blue/35"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
                </svg>
                FB Video Downloader
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
            >
              {showMenu ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Dropdown Menu */}
          {showMenu && (
            <div className="md:hidden pb-4 pt-2 border-t border-white/5 mt-2">
              <a
                href="/"
                onClick={() => setShowMenu(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                Home
              </a>
              <a
                href="#downloader"
                onClick={() => setShowMenu(false)}
                className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-fb-blue to-fb-blue-light text-white text-sm font-semibold rounded-xl transition-all mt-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
                </svg>
                FB Video Downloader
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* Hero + Input Section */}
      <section id="downloader" className="pt-28 pb-8 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-fb-blue/5 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-72 h-72 bg-blue-400/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-fb-blue/10 border border-fb-blue/20 text-fb-blue-light text-xs font-medium">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Free • No Registration • Unlimited Downloads
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Download Facebook{' '}
              <span className="gradient-text">Videos</span>
              <br />
              in Seconds
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Paste any Facebook video link and download it directly in HD quality.
              Supports reels, stories, live videos, and more.
            </p>
          </div>

          {/* Input Card */}
          <div className="glass rounded-2xl p-1 shadow-2xl shadow-black/20">
            <div className="bg-dark-800/80 rounded-xl p-6 sm:p-8">
              <div className="relative">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative z-30">
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => {
                        setUrl(e.target.value);
                        clearError();
                      }}
                      onKeyDown={(e) => { if (e.key === 'Enter') processVideo(); }}
                      placeholder="Paste Facebook video URL here..."
                      className="w-full h-14 pl-5 pr-12 bg-dark-900/80 border border-dark-500/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-fb-blue/60 focus:ring-2 focus:ring-fb-blue/20 transition-all text-base disabled:bg-dark-900/60 disabled:text-gray-400"
                      disabled={status === 'fetching'}
                    />
                    {/* Paste Button - always clickable, highest z-index */}
                    <button
                      type="button"
                      onClick={handlePaste}
                      className="absolute right-1 top-1/2 -translate-y-1/2 p-3 hover:bg-dark-600 active:bg-dark-500 rounded-lg transition-all text-gray-400 hover:text-white cursor-pointer active:scale-90"
                      title="Paste from clipboard"
                      tabIndex={0}
                      style={{ zIndex: 9999 }}
                    >
                      {copied ? (
                        <span className="text-xs text-green-400 font-bold">✓</span>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <button
                    onClick={processVideo}
                    disabled={status === 'fetching' || !url.trim()}
                    className="h-14 px-8 bg-gradient-to-r from-fb-blue to-fb-blue-light hover:from-fb-blue-dark hover:to-fb-blue text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-fb-blue/20 hover:shadow-fb-blue/35 active:scale-[0.98] whitespace-nowrap"
                  >
                    {status === 'fetching' ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        Download
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Error message with redirect option */}
              {error && status === 'error' && (
                <div className="mt-4">
                  <div className="flex items-start gap-2 text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3 text-sm">
                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    <span className="flex-1">{error}</span>
                    <button onClick={reset} className="p-1 hover:bg-red-400/20 rounded transition-colors flex-shrink-0">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  {url.trim() && (
                    <div className="mt-3 flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={handleRedirectDownload}
                        className="flex-1 px-4 py-3 bg-dark-600/50 border border-dark-500/50 hover:border-fb-blue/40 hover:bg-fb-blue/10 rounded-lg text-sm text-fb-blue-light font-medium transition-all flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                        Try downloading on FDOWN.net (opens in new tab)
                      </button>
                      <button
                        onClick={() => {
                          window.open(`https://fbdown.net/?url=${encodeURIComponent(url.trim())}`, '_blank');
                        }}
                        className="flex-1 px-4 py-3 bg-dark-600/50 border border-dark-500/50 hover:border-fb-blue/40 hover:bg-fb-blue/10 rounded-lg text-sm text-fb-blue-light font-medium transition-all flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                        Try FBDOWN.net (opens in new tab)
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Progress bar */}
              {status === 'fetching' && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <span className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {fetchingStep}
                    </span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-1.5 bg-dark-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-fb-blue to-fb-blue-light rounded-full transition-all duration-500 animate-progress"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Supported URLs hint */}
              {status === 'idle' && !error && (
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500">
                  <span>Supported:</span>
                  <span className="px-2 py-0.5 bg-dark-600/50 rounded text-gray-400">facebook.com</span>
                  <span className="px-2 py-0.5 bg-dark-600/50 rounded text-gray-400">fb.watch</span>
                  <span className="px-2 py-0.5 bg-dark-600/50 rounded text-gray-400">fb.me</span>
                  <span className="px-2 py-0.5 bg-dark-600/50 rounded text-gray-400">Reels</span>
                  <span className="px-2 py-0.5 bg-dark-600/50 rounded text-gray-400">Stories</span>
                  <span className="px-2 py-0.5 bg-dark-600/50 rounded text-gray-400">Live</span>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 sm:gap-16 mt-10 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white">10M+</div>
              <div className="text-xs text-gray-500 mt-1">Videos Downloaded</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white">4K</div>
              <div className="text-xs text-gray-500 mt-1">Max Quality</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white">100%</div>
              <div className="text-xs text-gray-500 mt-1">Free Forever</div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Preview Section */}
      {videoData && status === 'ready' && (
        <VideoPreview
          video={videoData}
          onReset={reset}
        />
      )}

      {/* Features */}
      <Features />

      {/* Footer */}
      <Footer />
    </div>
  );
}
