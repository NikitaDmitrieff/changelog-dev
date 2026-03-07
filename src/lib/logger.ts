type LogLevel = 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  module: string
  message: string
  [key: string]: unknown
}

function log(entry: LogEntry) {
  const output = JSON.stringify({
    ...entry,
    timestamp: new Date().toISOString(),
  })

  switch (entry.level) {
    case 'error':
      console.error(output)
      break
    case 'warn':
      console.warn(output)
      break
    default:
      console.info(output)
  }
}

export function createLogger(module: string) {
  return {
    info(message: string, data?: Record<string, unknown>) {
      log({ level: 'info', module, message, ...data })
    },
    warn(message: string, data?: Record<string, unknown>) {
      log({ level: 'warn', module, message, ...data })
    },
    error(message: string, data?: Record<string, unknown>) {
      log({ level: 'error', module, message, ...data })
    },
  }
}
