import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const DifficultyChart = ({ data }) => {
  const COLORS = ['#10b981', '#f59e0b', '#ef4444']

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      return (
        <div className="glass-card p-3">
          <p className="text-sm text-white/60">{payload[0].name}</p>
          <p className="text-lg font-bold text-white">
            {payload[0].value} solved
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            isAnimationActive={true}
            animationDuration={1000}
          >
            {data?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default DifficultyChart