import { motion } from 'framer-motion'
import LeaderboardContainer from '@components/leaderboard/LeaderboardContainer'
import { fadeInUp } from '@animations/shared/animationVariants'

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 pt-20">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              CodeRanker
            </span>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Compete with developers worldwide. Track your LeetCode progress and GitHub contributions.
          </p>
        </motion.div>

        <LeaderboardContainer />
      </div>
    </div>
  )
}

export default Home