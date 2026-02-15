import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const GrowthChart = ({ data }) => {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    if (data?.length) {
      setChartData(data)
    }
  }, [data])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="glass-card p-3">
          <p className="text-sm text-white/60">{label}</p>
          <p className="text-lg font-bold text-white">
            {payload[0].value} pts
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-64 w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
          
          <XAxis 
            dataKey="date" 
            stroke="#ffffff60"
            tick={{ fill: '#ffffff60', fontSize: 12 }}
          />
          
          <YAxis 
            stroke="#ffffff60"
            tick={{ fill: '#ffffff60', fontSize: 12 }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Area
            type="monotone"
            dataKey="score"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#colorScore)"
            isAnimationActive={true}
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

export default GrowthChart