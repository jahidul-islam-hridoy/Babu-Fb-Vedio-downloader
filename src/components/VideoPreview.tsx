import { useState } from 'react';
import { Download, Film, Clock, User, Shield, CheckCircle, ChevronDown, ChevronUp, ExternalLink, ArrowDownToLine, Copy, Check } from 'lucide-react';

interface QualityOption {
  label: string;
  quality: string;
  downloadUrl: string;
  format: string;
  badge?: string;
}

interface VideoData {
  title: string;
  thumbnail: string;
  duration: string;
  uploader: string;
  qualities: QualityOption[];
  downloadUrl: string;
}

interface VideoPreviewProps {
  video: VideoData;
  onReset: () => void;
}

export default function VideoPreview({ video, onReset }: VideoPreviewProps) {
  const [selectedQuality, setSelectedQuality] = useState(video.qualities[0]?.quality || 'best');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [thumbnailError, setThumbnailError] = useState(false);
  const [copied, setCopied] = useState(false);

  const selected = video.qualities.find(q => q.quality === selectedQuality) || video.qualities[0];
  const downloadUrl = selected?.downloadUrl || video.downloadUrl || '';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(downloadUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = downloadUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadQuality = (quality: QualityOption) => {
    setSelectedQuality(quality.quality);
    if (quality.downloadUrl) {
      window.open(quality.downloadUrl, '_blank');
    }
  };

  return (
    <section className="py-8 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Success Banner */}
        <div className="glass rounded-2xl p-1 mb-8 shadow-2xl shadow-fb-blue/10">
          <div className="bg-dark-800/80 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 flex items-center gap-3 border-b border-dark-600/50">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span className="text-green-400 font-medium">
                Video ready! Click download to save it.
              </span>
              <button
                onClick={onReset}
                className="ml-auto text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                Try another video
              </button>
            </div>

            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Video Thumbnail */}
                <div className="lg:w-2/5 flex-shrink-0">
                  <div className="relative group rounded-xl overflow-hidden bg-dark-900 aspect-video">
                    {video.thumbnail && !thumbnailError ? (
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-full h-full object-cover"
                        onError={() => setThumbnailError(true)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-dark-700">
                        <Film className="w-16 h-16 text-fb-blue/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Film className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    {video.duration && (
                      <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 rounded text-xs text-white font-medium">
                        {video.duration}
                      </div>
                    )}
                  </div>

                  {/* Video Meta */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <User className="w-4 h-4 text-fb-blue-light" />
                      <span className="truncate">{video.uploader}</span>
                    </div>
                    {video.duration && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="w-4 h-4 text-fb-blue-light" />
                        <span>Duration: {video.duration}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-green-400">
                      <Shield className="w-4 h-4" />
                      <span>Direct download link ready</span>
                    </div>
                  </div>
                </div>

                {/* Download Options */}
                <div className="lg:w-3/5">
                  <h3 className="text-xl font-bold text-white mb-1">{video.title}</h3>
                  <p className="text-sm text-gray-500 mb-6">Choose quality and click download to save</p>

                  {/* Quality Options */}
                  <div className="space-y-2">
                    {video.qualities.map((q) => (
                      <div
                        key={q.quality}
                        className={`flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all ${
                          selectedQuality === q.quality
                            ? 'border-fb-blue/50 bg-fb-blue/10'
                            : 'border-dark-600/50 bg-dark-700/50 hover:border-dark-500'
                        }`}
                      >
                        <button
                          onClick={() => setSelectedQuality(q.quality)}
                          className="flex items-center gap-3 flex-1"
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            selectedQuality === q.quality ? 'border-fb-blue bg-fb-blue' : 'border-gray-500'
                          }`}>
                            {selectedQuality === q.quality && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                          <div className="text-left">
                            <div className="text-white font-medium text-sm">{q.label}</div>
                            <div className="text-gray-500 text-xs">{q.format}</div>
                          </div>
                        </button>
                        <div className="flex items-center gap-2">
                          {q.badge && (
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                              q.badge === '4K' ? 'bg-purple-500/20 text-purple-400' :
                              'bg-green-500/20 text-green-400'
                            }`}>
                              {q.badge}
                            </span>
                          )}
                          <button
                            onClick={() => handleDownloadQuality(q)}
                            className="p-1.5 bg-fb-blue/20 hover:bg-fb-blue/30 rounded-lg text-fb-blue-light transition-colors"
                            title={`Download ${q.label}`}
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Main Download Button */}
                  <div className="mt-6 space-y-3">
                    <a
                      href={downloadUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="block w-full h-14 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 hover:shadow-green-500/35 active:scale-[0.98] text-lg no-underline"
                    >
                      <ArrowDownToLine className="w-5 h-5" />
                      Download {selected?.label} ({selected?.format})
                    </a>
                    
                    {/* Alternative methods */}
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => window.open(downloadUrl, '_blank')}
                        className="h-10 border border-dark-500/50 bg-dark-700/50 hover:bg-dark-600/50 hover:border-dark-400 text-gray-300 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Open Link
                      </button>
                      <button
                        onClick={copyToClipboard}
                        className="h-10 border border-dark-500/50 bg-dark-700/50 hover:bg-dark-600/50 hover:border-dark-400 text-gray-300 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copied!' : 'Copy Link'}
                      </button>
                      <a
                        href={downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="h-10 border border-dark-500/50 bg-dark-700/50 hover:bg-dark-600/50 hover:border-dark-400 text-gray-300 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5"
                      >
                        <ArrowDownToLine className="w-3.5 h-3.5" />
                        Save As
                      </a>
                    </div>
                  </div>
                  
                  {/* Download instructions */}
                  <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-xs text-blue-400">
                      <strong>How to download:</strong> Click the green "Download" button above. The video should start downloading automatically. If it opens in a browser instead, right-click the video and select "Save video as..." or use the "Copy Link" button to get the direct download URL.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div id="how-it-works" className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-3">How It Works</h2>
          <p className="text-gray-400 text-center mb-12 max-w-lg mx-auto">Download any Facebook video in just 3 simple steps</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                  </svg>
                ),
                title: 'Copy Video URL',
                desc: 'Copy the Facebook video link from the share button or address bar'
              },
              {
                step: '02',
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                ),
                title: 'Paste & Process',
                desc: 'Paste the URL and click download to fetch the video'
              },
              {
                step: '03',
                icon: <Download className="w-7 h-7" />,
                title: 'Download Video',
                desc: 'Choose quality and save the video to your device'
              }
            ].map((item) => (
              <div key={item.step} className="glass-card rounded-2xl p-6 text-center group hover:border-fb-blue/30 transition-colors">
                <div className="text-fb-blue-light/20 text-5xl font-black mb-2">{item.step}</div>
                <div className="w-14 h-14 bg-fb-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-fb-blue-light group-hover:bg-fb-blue/20 transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div id="faq" className="mt-20 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">Frequently Asked Questions</h2>
          <p className="text-gray-400 text-center mb-10">Everything you need to know about downloading Facebook videos</p>

          <div className="space-y-3">
            {[
              {
                q: 'Is it free to download Facebook videos?',
                a: 'Yes, our service is completely free. No hidden charges, subscriptions, or registration needed.'
              },
              {
                q: 'What video quality options are available?',
                a: 'We show all available quality options for each video — typically HD (1080p/720p) and SD (480p/360p) based on original quality.'
              },
              {
                q: 'Can I download Facebook Reels and Stories?',
                a: 'Yes! We support all Facebook content including regular videos, Reels, Stories, and Live videos.'
              },
              {
                q: 'Do I need to install any software?',
                a: 'No. Our tool works entirely in your browser — no software or extension needed.'
              },
              {
                q: 'Can I download private videos?',
                a: 'Only publicly available videos can be downloaded. Private videos require Facebook login.'
              },
              {
                q: 'Why does the video open in browser instead of downloading?',
                a: 'Some browsers open MP4 files directly instead of downloading. Right-click the video and select "Save video as..." or use our "Copy Link" button to get the direct URL.'
              },
            ].map((item, i) => (
              <div key={i} className="glass-card rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-dark-600/30 transition-colors"
                >
                  <span className="text-white font-medium pr-4">{item.q}</span>
                  {openFaq === i ? <ChevronUp className="w-5 h-5 text-fb-blue-light flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm text-gray-400 leading-relaxed border-t border-dark-600/30 pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
