import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useFilterStore } from '@store/filter.store'
import { useDebounce } from '@hooks/useDebounce'
import { FaSearch } from 'react-icons/fa'

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const { filters, setFilters } = useFilterStore()
  const debouncedSearch = useDebounce(searchTerm, 500)

  useEffect(() => {
    setFilters({ search: debouncedSearch })
  }, [debouncedSearch])

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative flex-1 max-w-md"
    >
      <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" />
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
      />
    </motion.div>
  )
}

export default SearchBar