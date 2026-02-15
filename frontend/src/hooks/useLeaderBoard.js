import { useQuery, useQueryClient } from '@tanstack/react-query'
import { leaderboardService } from '@services/leaderboard.service'
import { useLeaderboardStore } from '@store/leaderboard.store'
import { useFilterStore } from '@store/filter.store'
import { useEffect } from 'react'
import websocket from '@services/websocket.service'
import { useDebounce } from './useDebounce'

export const useLeaderboard = () => {
  const queryClient = useQueryClient()
  const { filters } = useFilterStore()
  const { pagination, setLeaderboard, setPagination } = useLeaderboardStore()

  const debouncedSearch = useDebounce(filters.search, 500)

  const queryParams = {
    page: pagination.page,
    limit: pagination.limit,
    sortBy: filters.sortBy,
    order: filters.order,
    search: debouncedSearch,
    platform: filters.platform,
  }

  const {
    data,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['leaderboard', queryParams],
    queryFn: () => leaderboardService.getLeaderboard(queryParams),
    staleTime: 30000,
    keepPreviousData: true,
  })

  // Get top performers separately
  const topPerformersQuery = useQuery({
    queryKey: ['leaderboard-top'],
    queryFn: () => leaderboardService.getTopPerformers(3),
    staleTime: 60000,
  })

  useEffect(() => {
    if (data?.data) {
      setLeaderboard(data.data.leaderboard)
      setPagination(data.data.pagination)
    }
  }, [data])

  // WebSocket real-time updates
  useEffect(() => {
    const handleLeaderboardUpdate = (data) => {
      if (data.type === 'leaderboard_update') {
        setLeaderboard(data.data)
        queryClient.invalidateQueries(['leaderboard'])
      }
    }

    websocket.on('leaderboard_update', handleLeaderboardUpdate)
    return () => websocket.off('leaderboard_update', handleLeaderboardUpdate)
  }, [])

  // Prefetch next page
  useEffect(() => {
    if (pagination.page < pagination.pages) {
      const nextParams = {
        ...queryParams,
        page: pagination.page + 1,
      }
      queryClient.prefetchQuery({
        queryKey: ['leaderboard', nextParams],
        queryFn: () => leaderboardService.getLeaderboard(nextParams),
      })
    }
  }, [pagination.page, queryParams])

  const goToPage = (page) => {
    setPagination({ ...pagination, page })
  }

  return {
    leaderboard: data?.data?.leaderboard || [],
    pagination: data?.data?.pagination || pagination,
    topPerformers: topPerformersQuery.data?.data || [],
    isLoading,
    isFetching,
    error,
    refetch,
    goToPage,
  }
}