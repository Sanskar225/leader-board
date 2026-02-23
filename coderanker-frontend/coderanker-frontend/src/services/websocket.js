class WebSocketService {
  constructor() {
    this.ws = null
    this.listeners = new Map()
    this.reconnectAttempts = 0
    this.maxReconnects = 5
    this.reconnectDelay = 2000
  }

  connect(token) {
    const WS_URL = import.meta.env.VITE_WS_URL || `ws://${window.location.hostname}:3001`
    this.ws = new WebSocket(`${WS_URL}?token=${token}`)

    this.ws.onopen = () => {
      this.reconnectAttempts = 0
      this.emit('connected', {})
    }

    this.ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        this.emit(data.type, data)
      } catch {}
    }

    this.ws.onclose = () => {
      this.emit('disconnected', {})
      this._reconnect(token)
    }

    this.ws.onerror = () => this.emit('error', {})
  }

  _reconnect(token) {
    if (this.reconnectAttempts < this.maxReconnects) {
      setTimeout(() => {
        this.reconnectAttempts++
        this.connect(token)
      }, this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts))
    }
  }

  subscribe(room) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'subscribe', room }))
    }
  }

  on(event, cb) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set())
    this.listeners.get(event).add(cb)
    return () => this.listeners.get(event)?.delete(cb)
  }

  emit(event, data) {
    this.listeners.get(event)?.forEach(cb => cb(data))
  }

  ping() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'ping' }))
    }
  }

  disconnect() {
    this.ws?.close()
    this.ws = null
  }
}

export default new WebSocketService()
