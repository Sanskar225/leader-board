import { motion } from 'framer-motion'
import { useFilterStore } from '@store/filter.store'

const FilterBar = () => {
  const { filters, setFilters } = useFilterStore()

  const platforms = [
    { value: 'all', label: 'All' },
    { value: 'leetcode', label: 'LeetCode' },
    { value: 'github', label: 'GitHub' },
  ]

  const sortOptions = [
    { value: 'rank', label: 'Rank' },
    { value: 'totalScore', label: 'Score' },
    { value: 'leetCodeScore', label: 'LeetCode' },
    { value: 'githubScore', label: 'GitHub' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex gap-4"
    >
      {/* Platform Filter */}
      <select
        value={filters.platform}
        onChange={(e) => setFilters({ platform: e.target.value })}
        className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
      >
        {platforms.map((p) => (
          <option key={p.value} value={p.value} className="bg-slate-800">
            {p.label}
          </option>
        ))}
      </select>

      {/* Sort By */}
      <select
        value={filters.sortBy}
        onChange={(e) => setFilters({ sortBy: e.target.value })}
        className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
      >
        {sortOptions.map((s) => (
          <option key={s.value} value={s.value} className="bg-slate-800">
            Sort by {s.label}
          </option>
        ))}
      </select>

      {/* Order Toggle */}
      <button
        onClick={() => setFilters({ order: filters.order === 'asc' ? 'desc' : 'asc' })}
        className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors"
      >
        {filters.order === 'asc' ? '↑' : '↓'}
      </button>
    </motion.div>
  )
}

export default FilterBar