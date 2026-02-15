import { useLeaderboard } from '@hooks/useLeaderboard'
import { useFilterStore } from '@store/filter.store'
import Podium from './Podium'
import LeaderboardTable from './LeaderboardTable'
import SearchBar from '../filters/SearchBar'
import FilterBar from '../filters/FilterBar'
import { motion } from 'framer-motion'
import { fadeInUp } from '@animations/shared/animationVariants'

const LeaderboardContainer = () => {
  const { leaderboard, topPerformers, isLoading, pagination, goToPage } = useLeaderboard()
  const { filters } = useFilterStore()

  return (
    <div className="space-y-8">
      {/* Podium */}
      <motion.div variants={fadeInUp} initial="initial" animate="animate">
        <Podium topPerformers={topPerformers} />
      </motion.div>

      {/* Filters */}
      <motion.div variants={fadeInUp} initial="initial" animate="animate" transition={{ delay: 0.1 }}>
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <SearchBar />
          <FilterBar />
        </div>
      </motion.div>

      {/* Leaderboard Table */}
      <motion.div variants={fadeInUp} initial="initial" animate="animate" transition={{ delay: 0.2 }}>
        <div className="glass-card overflow-hidden">
          {isLoading ? (
            <div className="p-8 space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <LeaderboardTable entries={leaderboard} />
              
              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className="flex justify-center gap-2 p-4 border-t border-white/10">
                  <button
                    onClick={() => goToPage(pagination.page - 1)}
                    disabled={!pagination.hasPrev}
                    className="px-4 py-2 bg-white/5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-white/60">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => goToPage(pagination.page + 1)}
                    disabled={!pagination.hasNext}
                    className="px-4 py-2 bg-white/5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default LeaderboardContainer