export function validateFacebookUrl(url: string): { valid: boolean; message: string } {
  const trimmed = url.trim();
  
  if (!trimmed) {
    return { valid: false, message: 'Please paste a Facebook video URL' };
  }

  const patterns = [
    /^https?:\/\/(www\.)?facebook\.com\/.*\/videos\/.+/i,
    /^https?:\/\/(www\.)?facebook\.com\/.*\/video\.php\?.+/i,
    /^https?:\/\/(www\.)?facebook\.com\/.*\/posts\/.+/i,
    /^https?:\/\/(www\.)?fb\.watch\/.+/i,
    /^https?:\/\/fb\.watch\/.+/i,
    /^https?:\/\/(www\.)?facebook\.com\/.+/i,
    /^https?:\/\/fb\.me\/.+/i,
  ];

  const isValidHttp = trimmed.startsWith('http://') || trimmed.startsWith('https://');
  const isFacebookDomain = patterns.some(pattern => pattern.test(trimmed)) || 
    (trimmed.includes('facebook.com') && isValidHttp) ||
    (trimmed.includes('fb.watch') && isValidHttp) ||
    (trimmed.includes('fb.me') && isValidHttp);

  if (!isValidHttp) {
    return { valid: false, message: 'Please enter a complete URL starting with http:// or https://' };
  }

  if (!isFacebookDomain) {
    return { valid: false, message: 'This doesn\'t appear to be a valid Facebook video URL' };
  }

  return { valid: true, message: '' };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
