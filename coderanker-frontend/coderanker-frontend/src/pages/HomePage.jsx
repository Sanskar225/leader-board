import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { leaderboardAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import TopPerformers from '../components/TopPerformers'
import { formatNumber } from '../utils/helpers'
import { Code2, Trophy, Zap, Github, Code, Users, TrendingUp, ArrowRight, Star, RefreshCw } from 'lucide-react'

export default function HomePage() {
  const { isAuthenticated } = useAuth()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    leaderboardAPI.getStats().then(({ data }) => setStats(data.data)).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background layers */}
        <div className="absolute inset-0 grid-bg opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-b from-void via-void/80 to-void" />
        
        {/* Animated orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-gold/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 mb-8 fade-up fade-up-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
            <span className="text-xs font-mono text-accent-glow tracking-widest">LIVE RANKINGS · REAL DATA</span>
          </div>

          {/* Main heading */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight fade-up fade-up-2">
            <span className="text-text-primary">RANK YOUR</span>
            <br />
            <span className="relative">
              <span className="neon-purple">CODING</span>
              <span className="text-text-primary"> POWER</span>
            </span>
          </h1>

          <p className="text-text-secondary text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed fade-up fade-up-3">
            The definitive competitive leaderboard combining{' '}
            <span className="text-cyan font-medium">LeetCode mastery</span>{' '}
            with{' '}
            <span className="text-accent font-medium">GitHub activity</span>{' '}
            into a single score that defines elite developers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center fade-up fade-up-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="btn-primary px-8 py-3 text-sm relative z-10">
                  <span className="relative z-10 flex items-center gap-2">
                    View Dashboard <ArrowRight size={16} />
                  </span>
                </Link>
                <Link to="/leaderboard" className="btn-ghost px-8 py-3 text-sm">
                  See Rankings
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn-primary px-8 py-3 text-sm relative z-10">
                  <span className="relative z-10 flex items-center gap-2">
                    Start Ranking Free <ArrowRight size={16} />
                  </span>
                </Link>
                <Link to="/leaderboard" className="btn-ghost px-8 py-3 text-sm">
                  View Leaderboard
                </Link>
              </>
            )}
          </div>

          {/* Live stats strip */}
          {stats && (
            <div className="mt-16 flex flex-wrap justify-center gap-8 fade-up fade-up-4">
              {[
                { label: 'Ranked Devs', value: stats.totalUsers, icon: <Users size={14} /> },
                { label: 'Total Score Points', value: stats.totalScore, icon: <Star size={14} /> },
                { label: 'Avg Score', value: stats.averageScore, icon: <TrendingUp size={14} /> },
              ].map(({ label, value, icon }) => (
                <div key={label} className="text-center">
                  <div className="flex items-center justify-center gap-1.5 text-text-muted text-xs font-mono mb-1">
                    {icon} {label}
                  </div>
                  <div className="font-mono text-2xl font-bold text-text-primary">
                    {formatNumber(value)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="w-5 h-8 border border-text-muted rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-text-muted rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Top Performers */}
      <section className="py-24 relative">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Trophy size={16} className="text-gold" />
              <span className="text-xs font-mono text-gold tracking-widest">HALL OF FAME</span>
            </div>
            <h2 className="font-display text-3xl font-bold text-text-primary">TOP PERFORMERS</h2>
          </div>
          <TopPerformers />
        </div>
      </section>

      {/* How scoring works */}
      <section className="py-24 relative">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-xs font-mono text-accent tracking-widest">ALGORITHM</span>
            <h2 className="font-display text-3xl font-bold text-text-primary mt-2">HOW SCORING WORKS</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LeetCode */}
            <div className="panel p-6 border-cyan/20 hover:border-cyan/40 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-cyan/10">
                  <Code size={20} className="text-cyan" />
                </div>
                <div>
                  <div className="font-display text-sm font-bold text-text-primary">LEETCODE SCORE</div>
                  <div className="text-xs text-text-muted">70% of total score</div>
                </div>
              </div>
              <div className="space-y-2 text-sm text-text-secondary">
                {[
                  ['Easy Problems', '+1 pt each'],
                  ['Medium Problems', '+3 pts each'],
                  ['Hard Problems', '+5 pts each'],
                  ['Total Solved', '+2 pts each'],
                  ['LeetCode Rank', '-0.01 pt each (lower is better)'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between items-center">
                    <span>{k}</span>
                    <span className="font-mono text-cyan text-xs">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* GitHub */}
            <div className="panel p-6 border-accent/20 hover:border-accent/40 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Github size={20} className="text-accent" />
                </div>
                <div>
                  <div className="font-display text-sm font-bold text-text-primary">GITHUB SCORE</div>
                  <div className="text-xs text-text-muted">30% of total score</div>
                </div>
              </div>
              <div className="space-y-2 text-sm text-text-secondary">
                {[
                  ['Public Repos', '+5 pts each'],
                  ['Total Stars', '+10 pts each'],
                  ['Total Forks', '+3 pts each'],
                  ['Followers', '+2 pts each'],
                  ['Contributions', '+0.1 pts each'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between items-center">
                    <span>{k}</span>
                    <span className="font-mono text-accent text-xs">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-xs font-mono text-text-muted tracking-widest">FEATURES</span>
            <h2 className="font-display text-3xl font-bold text-text-primary mt-2">BUILT FOR ELITE DEVS</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: '⚡', title: 'Real-Time Updates', desc: 'WebSocket-powered live leaderboard that updates as developers grind.' },
              { icon: '🔄', title: 'Auto-Sync', desc: 'Scheduled cron jobs keep your GitHub and LeetCode stats always fresh.' },
              { icon: '📊', title: 'Deep Analytics', desc: 'Radar charts, score breakdowns, and tier rankings for every profile.' },
              { icon: '⚔️', title: 'Head-to-Head', desc: 'Compare yourself against any other developer across all metrics.' },
              { icon: '🏆', title: 'Tier System', desc: 'Six tiers from Novice to Legendary based on your percentile ranking.' },
              { icon: '🔐', title: 'JWT Auth', desc: 'Secure token-based authentication with auto-refresh and safe sessions.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="panel p-5 hover:border-accent/20 transition-all group">
                <div className="text-2xl mb-3">{icon}</div>
                <div className="font-display text-sm font-bold text-text-primary mb-2 group-hover:text-accent-glow transition-colors">{title}</div>
                <div className="text-xs text-text-muted leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!isAuthenticated && (
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-accent/10 to-accent/5" />
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="max-w-2xl mx-auto px-4 text-center relative z-10">
            <h2 className="font-display text-4xl font-bold text-text-primary mb-4">
              READY TO RANK?
            </h2>
            <p className="text-text-secondary mb-8">
              Join thousands of developers competing for the top spot. Link your GitHub and LeetCode accounts and see where you stand.
            </p>
            <Link to="/register" className="btn-primary px-10 py-4 text-sm relative z-10 inline-flex items-center gap-2">
              <span className="relative z-10">Create Free Account</span>
              <ArrowRight size={16} className="relative z-10" />
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Code2 size={16} className="text-accent" />
            <span className="font-display text-sm text-text-muted">CODERANKER</span>
          </div>
          <div className="text-xs text-text-muted font-mono">
            Built with Node.js · MongoDB · React · WebSockets
          </div>
        </div>
      </footer>
    </div>
  )
}
