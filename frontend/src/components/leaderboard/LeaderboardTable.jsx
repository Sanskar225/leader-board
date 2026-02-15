import { motion, AnimatePresence } from 'framer-motion'
import { useWindowSize } from '@hooks/useWindowSize'
import { FixedSizeList } from 'react-window'
import LeaderboardRow from './LeaderboardRow'

const LeaderboardTable = ({ entries }) => {
  const { height } = useWindowSize()
  const rowHeight = 72 // px
  const listHeight = Math.min(entries.length * rowHeight, height * 0.6)

  const Row = ({ index, style }) => {
    const entry = entries[index]
    return (
      <div style={style}>
        <LeaderboardRow entry={entry} index={index} />
      </div>
    )
  }

  if (entries.length > 100) {
    return (
      <FixedSizeList

        height={listHeight}
        itemCount={entries.length}
        itemSize={rowHeight}
        width="100%"
      >
        {Row}
      </FixedSizeList>
    )
  }

  return (
    <table className="min-w-full divide-y divide-white/10">
      <thead className="bg-white/5">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Rank</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">User</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">LeetCode</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">GitHub</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Score</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Change</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/10">
        <AnimatePresence>
          {entries.map((entry, index) => (
            <LeaderboardRow
              key={entry.user?._id}
              entry={entry}
              index={index}
            />
          ))}
        </AnimatePresence>
      </tbody>
    </table>
  )
}

export default LeaderboardTable