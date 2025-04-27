import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

// Get the directory where this file is located
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const logsDir = path.join(rootDir, 'logs')

// Ensure logs directory exists
fs.ensureDirSync(logsDir)

// Log levels
const LOG_LEVELS = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR'
}

// Get current date in YYYY-MM-DD format
const getDateString = () => {
  const date = new Date()
  return date.toISOString().split('T')[0]
}

// Get current time in HH:MM:SS format
const getTimeString = () => {
  const date = new Date()
  return date.toISOString().split('T')[1].split('.')[0]
}

// Get log file name based on current date
const getLogFileName = () => {
  return `${getDateString()}.log`
}

// Format log message
const formatLogMessage = (level, message, metadata = {}) => {
  const timestamp = `${getDateString()} ${getTimeString()}`
  let metadataStr = ''
  
  if (Object.keys(metadata).length > 0) {
    metadataStr = ' ' + JSON.stringify(metadata)
  }
  
  return `[${timestamp}] [${level}] ${message}${metadataStr}`
}

// Write log to file
const writeToLogFile = (message) => {
  const logFile = path.join(logsDir, getLogFileName())
  fs.appendFileSync(logFile, message + '\n')
}

// Logger functions
export const logger = {
  debug: (message, metadata = {}) => {
    const logMessage = formatLogMessage(LOG_LEVELS.DEBUG, message, metadata)
    writeToLogFile(logMessage)
  },
  
  info: (message, metadata = {}) => {
    const logMessage = formatLogMessage(LOG_LEVELS.INFO, message, metadata)
    writeToLogFile(logMessage)
  },
  
  warning: (message, metadata = {}) => {
    const logMessage = formatLogMessage(LOG_LEVELS.WARNING, message, metadata)
    writeToLogFile(logMessage)
  },
  
  error: (message, metadata = {}) => {
    const logMessage = formatLogMessage(LOG_LEVELS.ERROR, message, metadata)
    writeToLogFile(logMessage)
  },
  
  // Log API request
  apiRequest: (model, messages) => {
    logger.info('API Request', { 
      model, 
      messageCount: messages.length,
      firstUserMessage: messages.find(m => m.role === 'user')?.content?.substring(0, 50) + '...'
    })
  },
  
  // Log API response
  apiResponse: (status, tokens = null, latency = null) => {
    logger.info('API Response', { status, tokens, latency })
  },
  
  // Log command execution
  command: (command, options = {}) => {
    logger.info('Command executed', { command, ...options })
  }
}

export default logger