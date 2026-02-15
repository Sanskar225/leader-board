class WebSocketService {
  constructor() {
    this.ws = null
    this.listeners = new Map()
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 3000
  }

  connect(token) {
    if (this.ws?.readyState === WebSocket.OPEN) return

    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3001'
    this.ws = new WebSocket(`${wsUrl}?token=${token}`)

    this.ws.onopen = () => {
      console.log('🔌 WebSocket connected')
      this.reconnectAttempts = 0
      this.emit('connection', { status: 'connected' })
    }

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        this.handleMessage(data)
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    this.ws.onclose = () => {
      console.log('WebSocket disconnected')
      this.emit('disconnected', { status: 'disconnected' })
      this.reconnect(token)
    }
  }

  reconnect(token) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      setTimeout(() => {
        console.log(`Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
        this.connect(token)
      }, this.reconnectDelay * this.reconnectAttempts)
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  handleMessage(data) {
    if (this.listeners.has(data.type)) {
      this.listeners.get(data.type).forEach(callback => callback(data))
    }
    if (this.listeners.has('*')) {
      this.listeners.get('*').forEach(callback => callback(data))
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event).add(callback)
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback)
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data))
    }
  }

  send(data) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
      return true
    }
    return false
  }

  subscribe(room) {
    return this.send({ type: 'subscribe', room })
  }

  unsubscribe(room) {
    return this.send({ type: 'unsubscribe', room })
  }

  ping() {
    return this.send({ type: 'ping' })
  }
}

export default new WebSocketService()