import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-64px)]">
      {/* Hero */}
      <div className="flex items-center justify-center px-6 pt-24 pb-20">
        <div className="text-center max-w-2xl mx-auto">
          <div className="relative mb-8">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#6c5ce7]/10 rounded-full blur-[100px]" />
            <div className="absolute -top-16 left-1/3 w-48 h-48 bg-[#00cec9]/8 rounded-full blur-[80px]" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-xs font-medium text-[#00cec9] mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00cec9] animate-pulse" />
                Real-time polling
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-5 leading-[1.05]">
                <span className="text-white">Create polls.</span>
                <br />
                <span className="bg-gradient-to-r from-[#5cc0e7] via-[#9beafe] to-[#00cec9] bg-clip-text text-transparent">
                  Get answers.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#6b6b80] font-normal max-w-md mx-auto leading-relaxed">
                Share instantly. Watch results flow in live.
                <br />
                Simple, fast, beautiful.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
            {/* <Link
              href="/login"
              className="group relative px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#6c5ce7] to-[#5a4bd1] text-white font-semibold text-sm shadow-lg shadow-[#6c5ce7]/20 hover:shadow-xl hover:shadow-[#6c5ce7]/30 hover:scale-105 transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-0.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </Link> */}
            <Link
              href="/my-polls"
              className="px-6 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.06] text-[#6b6b80] font-medium text-sm hover:bg-white/[0.08] hover:text-white/80 transition-all duration-300"
            >
              create a poll
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      {/* <div className="max-w-4xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6c5ce7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              ),
              title: "Instant Setup",
              desc: "Create a poll in seconds. No account required to vote.",
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00cec9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18" />
                  <path d="M7 12l4-4 4 4 4-4" />
                </svg>
              ),
              title: "Live Results",
              desc: "Watch votes update in real-time with smooth animations.",
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a29bfe" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              ),
              title: "Easy Sharing",
              desc: "Share a link. Anyone can vote from any device.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="glass-card-light rounded-2xl p-6 hover:bg-white/[0.06] transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-sm font-semibold text-white mb-1.5">{feature.title}</h3>
              <p className="text-xs text-[#6b6b80] leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}
