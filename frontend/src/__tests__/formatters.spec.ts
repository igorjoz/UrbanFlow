import { describe, it, expect } from 'vitest'
import { formatTime, formatDelay, formatDelayClass, relativeTime } from '../plugins/formatters'

describe('formatTime', () => {
  it('should format Date objects correctly', () => {
    const date = new Date('2024-01-15T14:30:00')
    expect(formatTime(date)).toMatch(/14:30/)
  })

  it('should format date strings correctly', () => {
    expect(formatTime('2024-01-15T14:30:00')).toMatch(/14:30/)
  })

  it('should return time string as-is if already formatted', () => {
    expect(formatTime('19:09')).toBe('19:09')
  })

  it('should return "-" for invalid input', () => {
    expect(formatTime('')).toBe('-')
    expect(formatTime('invalid')).toBe('-')
  })
})

describe('formatDelay', () => {
  it('should format zero delay as "Punktualnie"', () => {
    expect(formatDelay(0)).toBe('Punktualnie')
  })

  it('should format positive delays with + prefix', () => {
    expect(formatDelay(60)).toBe('+1 min')
    expect(formatDelay(90)).toBe('+1 min 30s')
    expect(formatDelay(30)).toBe('+30s')
    expect(formatDelay(180)).toBe('+3 min')
  })

  it('should format negative delays with - prefix', () => {
    expect(formatDelay(-60)).toBe('-1 min')
    expect(formatDelay(-30)).toBe('-30s')
  })
})

describe('formatDelayClass', () => {
  it('should return "delay-on-time" for on-time or early', () => {
    expect(formatDelayClass(0)).toBe('delay-on-time')
    expect(formatDelayClass(-60)).toBe('delay-on-time')
  })

  it('should return "delay-slight" for small delays (≤3min)', () => {
    expect(formatDelayClass(60)).toBe('delay-slight')
    expect(formatDelayClass(180)).toBe('delay-slight')
  })

  it('should return "delay-late" for large delays (>3min)', () => {
    expect(formatDelayClass(181)).toBe('delay-late')
    expect(formatDelayClass(600)).toBe('delay-late')
  })
})

describe('relativeTime', () => {
  it('should return "Teraz" for current time', () => {
    const now = new Date()
    expect(relativeTime(now)).toBe('Teraz')
  })

  it('should return "Odjechał" for past times', () => {
    const past = new Date(Date.now() - 60000)
    expect(relativeTime(past)).toBe('Odjechał')
  })

  it('should return minutes for near future', () => {
    const future = new Date(Date.now() + 5 * 60000)
    expect(relativeTime(future)).toMatch(/Za \d+ min/)
  })

  it('should return "-" for invalid input', () => {
    expect(relativeTime('invalid')).toBe('-')
  })
})
