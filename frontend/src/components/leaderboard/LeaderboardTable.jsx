import { AnimatePresence } from 'framer-motion'
import LeaderboardRow from './LeaderboardRow'

const LeaderboardTable = ({ entries = [] }) => {
  // Empty state protection
  if (!entries.length) {
    return (
      <div className="glass-card p-8 text-center text-white/60">
        No leaderboard data available.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto glass-card">
      <table className="min-w-full divide-y divide-white/10">
        {/* TABLE HEADER */}
        <thead className="bg-white/5">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
              Rank
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
              LeetCode
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
              GitHub
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
              Score
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
              Change
            </th>
          </tr>
        </thead>

        {/* TABLE BODY */}
        <tbody className="divide-y divide-white/10">
          <AnimatePresence>
            {entries.map((entry, index) => (
              <LeaderboardRow
                key={entry?.user?._id || index}
                entry={entry}
                index={index}
              />
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  )
}

export default LeaderboardTable
