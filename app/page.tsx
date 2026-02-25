import Link from "next/link";
import { CheckSquare, ArrowRight, Shield, Zap, Layout } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500/30">
      {/* Hero Section */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-8 h-8 text-blue-500" />
          <span className="text-2xl font-bold tracking-tighter">TaskPro</span>
        </div>
        <div className="flex gap-8 items-center">
          <Link href="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Sign in</Link>
          <Link href="/register" className="text-sm font-medium bg-white text-black px-6 py-2.5 rounded-full hover:bg-gray-200 transition-all font-bold">Get Started</Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-6 uppercase tracking-widest">
            Production Ready Full-Stack App
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1]">
            Manage tasks <br />
            <span className="gradient-text">like a professional.</span>
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-xl leading-relaxed">
            A high-performance task management system built with Next.js 14,
            Prisma, and PostgreSQL. Secure by design, built for scale.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/register"
              className="group bg-blue-600 px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-95"
            >
              Get started for free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="https://github.com"
              className="px-8 py-4 rounded-2xl font-bold text-lg border border-white/10 hover:bg-white/5 transition-all flex items-center justify-center"
            >
              View Documentation
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32">
          {[
            { icon: Shield, title: "JWT Auth", desc: "Custom JWT implementation with HTTP-only cookies and bcrypt hashing." },
            { icon: Zap, title: "Fast & Scalable", desc: "Optimized Prisma queries with proper indexing and server-side pagination." },
            { icon: Layout, title: "Clean UI", desc: "Minimalist dashboard with real-time stats, search, and intuitive filtering." }
          ].map((feature, i) => (
            <div key={i} className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
              <feature.icon className="w-8 h-8 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
