export default function Footer() {
  return (
    <footer className="border-t border-dark-600/50 py-12 px-4 sm:px-6 lg:px-8 mt-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-fb-blue to-fb-blue-light rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
              </div>
              <span className="text-lg font-bold gradient-text">FBVideo</span>
              <span className="text-lg font-bold text-white/40">Downloader</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              The fastest and most reliable way to download Facebook videos in HD quality. Free forever, no registration required.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#downloader" className="hover:text-fb-blue-light transition-colors">Video Downloader</a></li>
              <li><a href="#how-it-works" className="hover:text-fb-blue-light transition-colors">How It Works</a></li>
              <li><a href="#features" className="hover:text-fb-blue-light transition-colors">Features</a></li>
              <li><a href="#faq" className="hover:text-fb-blue-light transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-fb-blue-light transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-fb-blue-light transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-fb-blue-light transition-colors">DMCA</a></li>
              <li><a href="#" className="hover:text-fb-blue-light transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-dark-600/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © 2025 FBVideo Downloader. All rights reserved. Not affiliated with Meta/Facebook.
          </p>
          <p className="text-xs text-gray-600">
            Made with ❤️ for the community
          </p>
        </div>
      </div>
    </footer>
  );
}
