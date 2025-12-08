export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
      <div className="container mx-auto px-4 text-center">
        {/* Logo & Brand */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-8xl font-bold text-white mb-6 tracking-tight">
            Rank<span className="text-purple-400">ify</span>
          </h1>
          <div className="w-24 h-1 bg-purple-400 mx-auto mb-8"></div>
        </div>

        {/* Coming Soon Message */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-5xl font-bold text-white mb-6">
            Something Great is Coming
          </h2>
          <p className="text-2xl text-gray-300 leading-relaxed">
            We're crafting a powerful SEO platform that will transform how you optimize your website. 
            <span className="block mt-4 text-purple-400 font-semibold">
              Get ready for simplified SEO analysis, actionable insights, and measurable results.
            </span>
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/10 transition-all">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-white mb-3">Precise Analysis</h3>
            <p className="text-gray-300">In-depth SEO audits with actionable recommendations</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/10 transition-all">
            <div className="text-6xl mb-4">⚡</div>
            <h3 className="text-2xl font-bold text-white mb-3">Lightning Fast</h3>
            <p className="text-gray-300">Real-time insights delivered in seconds</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/10 transition-all">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-white mb-3">Clear Reports</h3>
            <p className="text-gray-300">Beautiful dashboards that make sense</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20">
          <p className="text-gray-400 text-lg">
            Launching Soon • Follow our journey
          </p>
        </div>
      </div>
    </div>
  );
}

