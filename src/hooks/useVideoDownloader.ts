import { useState, useCallback, useRef } from 'react';
import { validateFacebookUrl } from '../utils/validators';

const API_URL = 'https://fdown.isuru.eu.org';

// CORS proxies ordered by reliability
const CORS_PROXIES = [
  (targetUrl: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
  (targetUrl: string) => `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`,
  (targetUrl: string) => `https://cors.lol/${encodeURIComponent(targetUrl)}`,
];

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

interface DownloadResult {
  status: 'success' | 'error';
  video_info?: any;
  download_url?: string;
  available_formats?: string[];
  title?: string;
  thumbnail?: string;
  message?: string;
  links?: Record<string, string>;
}

// Helper: Try fetching through direct or CORS proxies
async function fetchWithFallback(
  targetUrl: string,
  options?: RequestInit
): Promise<{ data: any; success: boolean }> {
  // First try: Direct API call
  try {
    const res = await fetch(targetUrl, { ...options, signal: AbortSignal.timeout(15000) });
    if (res.ok) {
      const text = await res.text();
      try {
        return { data: JSON.parse(text), success: true };
      } catch {
        // Not JSON, might be video data
        return { data: text, success: true };
      }
    }
  } catch {
    // CORS or network error, try proxies
  }

  // Fallback: Try CORS proxies
  for (const proxyFn of CORS_PROXIES) {
    try {
      const proxyUrl = proxyFn(targetUrl);
      const res = await fetch(proxyUrl, {
        ...options,
        signal: AbortSignal.timeout(20000),
      });
      if (res.ok) {
        const text = await res.text();
        try {
          return { data: JSON.parse(text), success: true };
        } catch {
          return { data: text, success: true };
        }
      }
    } catch {
      continue;
    }
  }

  return { data: null, success: false };
}

// Helper: POST to API via direct or CORS proxies
async function postWithFallback(
  targetUrl: string,
  body: object
): Promise<{ data: any; success: boolean }> {
  // First try: Direct POST
  try {
    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    });
    if (res.ok) {
      const text = await res.text();
      try {
        return { data: JSON.parse(text), success: true };
      } catch {
        return { data: text, success: true };
      }
    }
  } catch {
    // CORS or network error
  }

  // Fallback: Use allorigins for POST
  for (const proxyFn of CORS_PROXIES) {
    try {
      const proxyUrl = proxyFn(targetUrl);
      const res = await fetch(proxyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(20000),
      });
      if (res.ok) {
        const text = await res.text();
        try {
          return { data: JSON.parse(text), success: true };
        } catch {
          return { data: text, success: true };
        }
      }
    } catch {
      continue;
    }
  }

  return { data: null, success: false };
}

export function useVideoDownloader() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'fetching' | 'ready' | 'error' | 'downloading'>('idle');
  const [progress, setProgress] = useState(0);
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [error, setError] = useState('');
  const [fetchingStep, setFetchingStep] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    setUrl('');
    setStatus('idle');
    setProgress(0);
    setVideoData(null);
    setError('');
    setFetchingStep('');
  }, []);

  const clearError = useCallback(() => {
    setError('');
  }, []);

  const safeIncludes = (val: unknown, search: string): boolean => {
    return typeof val === 'string' && val.includes(search);
  };

  const buildQualities = useCallback((rawUrl: string, formats: any[]): QualityOption[] => {
    if (formats && Array.isArray(formats) && formats.length > 0) {
      return formats
        .filter((fmt) => typeof fmt === 'string' && fmt.trim())
        .map((fmt) => ({
          label: fmt,
          quality: fmt,
          downloadUrl: rawUrl,
          format: 'MP4',
          badge: safeIncludes(fmt, '1080') || safeIncludes(fmt, '720') ? 'HD' : safeIncludes(fmt, '4K') || safeIncludes(fmt, '2160') ? '4K' : undefined,
        }));
    }
    return [
      { label: 'HD (Best)', quality: 'best', downloadUrl: rawUrl, format: 'MP4', badge: 'HD' },
      { label: 'SD (720p)', quality: '720p', downloadUrl: rawUrl, format: 'MP4' },
      { label: 'Low (480p)', quality: '480p', downloadUrl: rawUrl, format: 'MP4' },
    ];
  }, []);

  const parseApiResponse = useCallback((result: DownloadResult): VideoData | null => {
    try {
      // Guard: make sure result is a valid object
      if (!result || typeof result !== 'object') return null;

      // Case 1: Standard success response from /info
      if (result.status === 'success') {
        const downloadUrl = result.download_url || '';
        const title = result.video_info?.title || result.title || 'Facebook Video';
        const thumbnail = result.video_info?.thumbnail || result.thumbnail || '';
        const dur = result.video_info?.duration;
        const duration = typeof dur === 'number' && dur > 0
          ? `${Math.floor(dur / 60)}:${String(Math.floor(dur % 60)).padStart(2, '0')}`
          : (result.video_info?.duration_string || '');
        const uploader = result.video_info?.uploader || result.video_info?.author || '';

        if (downloadUrl) {
          return {
            title,
            thumbnail,
            duration,
            uploader,
            qualities: buildQualities(downloadUrl, Array.isArray(result.available_formats) ? result.available_formats : []),
            downloadUrl,
          };
        }
      }

      // Case 2: Response with links object
      if (result.links) {
        const entries = Object.entries(result.links);
        if (entries.length > 0 && entries[0][1]) {
          const [_firstLabel, firstUrl] = entries[0];
          return {
            title: result.title || 'Facebook Video',
            thumbnail: '',
            duration: '',
            uploader: '',
            qualities: entries.map(([label, urlVal]) => ({
              label,
              quality: label,
              downloadUrl: urlVal as string,
              format: 'MP4',
              badge: safeIncludes(label, 'HD') || safeIncludes(label, '1080') || safeIncludes(label, 'best') ? 'HD' : undefined,
            })),
            downloadUrl: firstUrl as string,
          };
        }
      }

      // Case 3: Simple response with url field
      if (result.download_url || (result as any).url || (result as any).video_url) {
        const dlUrl = result.download_url || (result as any).url || (result as any).video_url;
        return {
          title: result.title || 'Facebook Video',
          thumbnail: result.video_info?.thumbnail || '',
          duration: '',
          uploader: result.video_info?.uploader || '',
          qualities: [{ label: 'Best Quality', quality: 'best', downloadUrl: dlUrl, format: 'MP4', badge: 'HD' }],
          downloadUrl: dlUrl,
        };
      }

      return null;
    } catch (e) {
      console.warn('parseApiResponse error:', e);
      return null;
    }
  }, [buildQualities]);

  const processVideo = useCallback(async () => {
    const trimmedUrl = url.trim();
    const { valid, message } = validateFacebookUrl(trimmedUrl);
    if (!valid) {
      setError(message);
      setStatus('error');
      return;
    }

    abortRef.current = new AbortController();
    setError('');
    setStatus('fetching');
    setProgress(10);
    setFetchingStep('Connecting to download server...');
    setVideoData(null);

    try {
      // Step 1: Try to get video info from /info endpoint
      setProgress(25);
      setFetchingStep('Fetching video details...');

      const infoResult = await postWithFallback(`${API_URL}/info`, { url: trimmedUrl, quality: 'best' });

      if (infoResult.success && infoResult.data) {
        try {
          const videoParsed = parseApiResponse(infoResult.data as DownloadResult);
          if (videoParsed) {
            setProgress(100);
            setFetchingStep('');
            setVideoData(videoParsed);
            setStatus('ready');
            return;
          }
        } catch (parseErr) {
          console.warn('Failed to parse /info response:', parseErr);
        }
      }

      // Step 2: Try the /download endpoint directly
      setProgress(50);
      setFetchingStep('Trying alternative download method...');

      const downloadResult = await postWithFallback(`${API_URL}/download`, { url: trimmedUrl, quality: 'best' });

      if (downloadResult.success && downloadResult.data) {
        try {
          const videoParsed = parseApiResponse(downloadResult.data as DownloadResult);
          if (videoParsed) {
            setProgress(100);
            setFetchingStep('');
            setVideoData(videoParsed);
            setStatus('ready');
            return;
          }
        } catch (parseErr) {
          console.warn('Failed to parse /download response:', parseErr);
        }
      }

      // Step 3: Try getting info via GET with URL param (some APIs support this)
      setProgress(65);
      setFetchingStep('Retrying with different method...');

      const getResult = await fetchWithFallback(`${API_URL}/info?url=${encodeURIComponent(trimmedUrl)}`);

      if (getResult.success && getResult.data) {
        try {
          const videoParsed = parseApiResponse(getResult.data as DownloadResult);
          if (videoParsed) {
            setProgress(100);
            setFetchingStep('');
            setVideoData(videoParsed);
            setStatus('ready');
            return;
          }
        } catch (parseErr) {
          console.warn('Failed to parse GET response:', parseErr);
        }
      }

      // If all API methods failed, show helpful fallback
      throw new Error('Could not fetch video from the server. Try pasting the video URL into the direct download link below.');

    } catch (err: any) {
      console.error('Video fetch error:', err);
      setError(err.message || 'Failed to fetch the video. The server might be busy. Please try again.');
      setStatus('error');
      setProgress(0);
      setFetchingStep('');
    }
  }, [url, parseApiResponse, buildQualities]);

  const triggerDownload = useCallback((downloadUrl: string, quality: string) => {
    if (!downloadUrl) return;
    setStatus('downloading');

    const filename = `facebook-video-${quality || 'best'}-${Date.now()}.mp4`;

    // Primary: Open in new tab - most reliable for video URLs
    window.open(downloadUrl, '_blank');

    // Secondary: Try to fetch as blob and download
    fetch(downloadUrl, { mode: 'cors' })
      .then((res) => {
        if (res.ok) return res.blob();
        throw new Error('not ok');
      })
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      })
      .catch(() => {
        // If fetch fails (CORS), the window.open above should have worked
      });
  }, []);

  return {
    url,
    setUrl,
    status,
    progress,
    videoData,
    error,
    fetchingStep,
    processVideo,
    triggerDownload,
    reset,
    clearError,
  };
}
