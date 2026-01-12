import type { App, Plugin } from 'vue'

/**
 * Formatters Plugin
 * Provides global formatting methods for time and delays
 */

export interface FormattersPlugin {
  $formatTime: (date: string | Date) => string
  $formatDelay: (seconds: number) => string
  $formatDelayClass: (seconds: number) => string
  $relativeTime: (date: string | Date) => string
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $formatTime: (date: string | Date) => string
    $formatDelay: (seconds: number) => string
    $formatDelayClass: (seconds: number) => string
    $relativeTime: (date: string | Date) => string
  }
}

const formatTime = (date: string | Date): string => {
  if (!date) return '-'
  
  const d = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(d.getTime())) {
    // If it's just a time string like "19:09"
    if (typeof date === 'string' && /^\d{2}:\d{2}$/.test(date)) {
      return date
    }
    return '-'
  }
  
  return d.toLocaleTimeString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatDelay = (seconds: number): string => {
  if (seconds === 0) return 'Punktualnie'
  
  const absSeconds = Math.abs(seconds)
  const minutes = Math.floor(absSeconds / 60)
  const remainingSeconds = absSeconds % 60
  
  let timeStr = ''
  if (minutes > 0) {
    timeStr = `${minutes} min`
    if (remainingSeconds > 0) {
      timeStr += ` ${remainingSeconds}s`
    }
  } else {
    timeStr = `${remainingSeconds}s`
  }
  
  return seconds > 0 ? `+${timeStr}` : `-${timeStr}`
}

const formatDelayClass = (seconds: number): string => {
  if (seconds <= 0) return 'delay-on-time'
  if (seconds <= 180) return 'delay-slight' // 3 minutes
  return 'delay-late'
}

const relativeTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(d.getTime())) return '-'
  
  const now = new Date()
  const diffMs = d.getTime() - now.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  
  if (diffMins < 0) return 'Odjechał'
  if (diffMins === 0) return 'Teraz'
  if (diffMins === 1) return 'Za 1 min'
  if (diffMins < 60) return `Za ${diffMins} min`
  
  const hours = Math.floor(diffMins / 60)
  return `Za ${hours}h ${diffMins % 60}min`
}

export const formattersPlugin: Plugin = {
  install(app: App) {
    app.config.globalProperties.$formatTime = formatTime
    app.config.globalProperties.$formatDelay = formatDelay
    app.config.globalProperties.$formatDelayClass = formatDelayClass
    app.config.globalProperties.$relativeTime = relativeTime
  }
}

// Export functions for use in composition API
export { formatTime, formatDelay, formatDelayClass, relativeTime }
