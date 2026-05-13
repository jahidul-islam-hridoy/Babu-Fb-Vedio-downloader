import { Zap, Shield, Smartphone, Globe, Star, Clock } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Lightning Fast',
      description: 'Process and download videos in seconds with our optimized servers worldwide.'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Safe & Secure',
      description: 'No malware, no data collection. Your privacy is our top priority.'
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: 'Works Everywhere',
      description: 'Compatible with all devices - phones, tablets, laptops, and desktop computers.'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'No Registration',
      description: 'Start downloading immediately without creating an account or signing up.'
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'HD Quality',
      description: 'Download in original quality up to 4K. Choose from multiple resolution options.'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Unlimited Downloads',
      description: 'No daily limits or restrictions. Download as many videos as you want, for free.'
    },
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-3">
          Why Choose <span className="gradient-text">FBVideo Downloader</span>?
        </h2>
        <p className="text-gray-400 text-center mb-14 max-w-xl mx-auto">
          The most reliable and feature-rich Facebook video downloading tool on the web
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="glass-card rounded-2xl p-6 hover:border-fb-blue/30 transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-fb-blue/10 rounded-xl flex items-center justify-center text-fb-blue-light mb-4 group-hover:bg-fb-blue/20 group-hover:scale-110 transition-all">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Supported Content Types */}
        <div className="mt-16 glass-card rounded-2xl p-8">
          <h3 className="text-xl font-bold text-center mb-8">All Facebook Content Types Supported</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'Regular Videos', 'Reels', 'Stories', 'Live Videos', 'Album Videos',
              'Shared Videos', 'Profile Videos', 'Page Videos', 'Group Videos',
              'Watch Videos', 'Short Videos', 'Video Posts'
            ].map((type) => (
              <span
                key={type}
                className="px-4 py-2 bg-dark-600/50 border border-dark-500/50 rounded-full text-sm text-gray-300 hover:bg-fb-blue/10 hover:border-fb-blue/30 hover:text-fb-blue-light transition-all cursor-default"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
