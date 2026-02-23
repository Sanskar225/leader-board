import React from 'react'
import { Link } from 'react-router-dom'
import { Code2 } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 text-center px-4">
        <div className="font-display text-[120px] md:text-[200px] font-bold leading-none text-transparent bg-clip-text bg-gradient-to-b from-accent/40 to-transparent select-none">
          404
        </div>
        <h1 className="font-display text-2xl font-bold text-text-primary -mt-4 mb-4">RANK NOT FOUND</h1>
        <p className="text-text-muted mb-8 max-w-sm mx-auto">
          This page doesn't exist on the leaderboard. Get back in the arena.
        </p>
        <Link to="/" className="btn-primary px-8 py-3 inline-flex items-center gap-2 relative z-10 text-sm">
          <span className="relative z-10 flex items-center gap-2">
            <Code2 size={16} /> Back to Home
          </span>
        </Link>
      </div>
    </div>
  )
}
