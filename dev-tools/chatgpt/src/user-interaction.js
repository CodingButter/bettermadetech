import chalk from 'chalk';
import logger from './logger.js';

// Function to safely import readline-sync and handle errors
async function getReadlineSync() {
  try {
    const readline = await import('readline-sync');
    return readline.default;
  } catch (error) {
    console.error(chalk.red('Error loading readline-sync:', error.message));
    // Return a fallback implementation
    return {
      question: (prompt) => {
        console.log(chalk.yellow(`[Non-interactive mode] ${prompt}`));
        return 'default-response';
      },
      keyInYNStrict: (prompt) => {
        console.log(chalk.yellow(`[Non-interactive mode] ${prompt} (Y/N)`));
        return true; // Default to yes
      },
      keyInSelect: (options, prompt) => {
        console.log(chalk.yellow(`[Non-interactive mode] ${prompt}`));
        options.forEach((opt, i) => console.log(`  ${i+1}: ${opt}`));
        return 0; // Default to first option
      }
    };
  }
}

// For ESM top-level await isn't supported in all environments
// Creating a fallback implementation
const readlineFallback = {
  question: (prompt) => {
    console.log(chalk.yellow(`[Non-interactive mode] ${prompt}`));
    return 'default-response';
  },
  keyInYNStrict: (prompt) => {
    console.log(chalk.yellow(`[Non-interactive mode] ${prompt} (Y/N)`));
    return true; // Default to yes
  },
  keyInSelect: (options, prompt) => {
    console.log(chalk.yellow(`[Non-interactive mode] ${prompt}`));
    options.forEach((opt, i) => console.log(`  ${i+1}: ${opt}`));
    return 0; // Default to first option
  }
};

// Import readline-sync using dynamic import for ESM compatibility
let readline = readlineFallback;
import('readline-sync').then(module => {
  readline = module.default;
}).catch(error => {
  console.log(chalk.yellow('Warning: Running in non-interactive mode'));
});

/**
 * Handles direct interaction with the user
 * This module provides tools for ChatGPT to request input from the user
 * or display important information that needs user attention
 */

/**
 * Display an important message to the user with visual emphasis
 * @param {String} message - The message to display to the user
 * @param {Object} options - Display options
 * @param {String} options.type - Message type (info, success, warning, error)
 * @param {Boolean} options.bold - Whether to display in bold
 * @returns {void}
 */
/**
 * Display a message to the user without needing interaction
 */
export function displayUserMessage(message, options = {}) {
  const { type = 'info', bold = false } = options;
  
  let colorFn;
  switch (type) {
    case 'success':
      colorFn = chalk.green;
      break;
    case 'warning':
      colorFn = chalk.yellow;
      break;
    case 'error':
      colorFn = chalk.red;
      break;
    case 'info':
    default:
      colorFn = chalk.cyan;
  }
  
  const formattedMessage = bold ? chalk.bold(colorFn(message)) : colorFn(message);
  
  // Add spacing to make the message stand out
  console.log('');
  console.log(formattedMessage);
  console.log('');
  
  logger.info('User message displayed', { 
    message: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
    type
  });
}

/**
 * Ask the user a question and get a response
 * @param {String} question - The question to ask the user
 * @param {Object} options - Input options
 * @param {Boolean} options.required - Whether an answer is required
 * @param {String} options.defaultValue - Default value if user doesn't provide one
 * @returns {String} - The user's response
 */
export function askUserQuestion(question, options = {}) {
  const { required = false, defaultValue = '' } = options;
  
  logger.info('Asking user question', { 
    question: question.substring(0, 100) + (question.length > 100 ? '...' : ''),
    required,
    hasDefault: !!defaultValue
  });
  
  let formattedQuestion = chalk.cyan(question);
  if (defaultValue) {
    formattedQuestion += chalk.gray(` (default: ${defaultValue}): `);
  } else {
    formattedQuestion += ': ';
  }
  
  let answer = '';
  
  try {
    // Keep asking until we get a non-empty answer if required
    while (!answer && required) {
      answer = readline.question(formattedQuestion) || defaultValue;
      
      if (!answer && required) {
        console.log(chalk.yellow('This field is required. Please provide a response.'));
      }
    }
    
    // If not required, just ask once
    if (!required && !answer) {
      answer = readline.question(formattedQuestion) || defaultValue;
    }
  } catch (error) {
    console.log(chalk.yellow(`[Non-interactive mode] Cannot get user input for: ${question}`));
    answer = defaultValue || 'default-response';
  }
  
  logger.info('User provided answer', { 
    answerLength: answer.length,
    isEmpty: answer.length === 0
  });
  
  return answer;
}

/**
 * Ask the user a yes/no question
 * @param {String} question - The question to ask the user
 * @param {Object} options - Input options
 * @param {Boolean} options.defaultYes - Whether the default answer is Yes
 * @returns {Boolean} - True if the user answered Yes, false otherwise
 */
export function askUserConfirmation(question, options = {}) {
  const { defaultYes = false } = options;
  
  logger.info('Asking user for confirmation', { 
    question: question.substring(0, 100) + (question.length > 100 ? '...' : ''),
    defaultYes
  });
  
  let result = defaultYes;
  
  try {
    result = readline.keyInYNStrict(chalk.cyan(question), { defaultInput: defaultYes ? 'y' : 'n' });
  } catch (error) {
    console.log(chalk.yellow(`[Non-interactive mode] Cannot get confirmation for: ${question}`));
    console.log(chalk.yellow(`Using default value: ${defaultYes ? 'Yes' : 'No'}`));
  }
  
  logger.info('User confirmation result', { result });
  
  return result;
}

/**
 * Ask the user to select from a list of options
 * @param {String} question - The question to ask the user
 * @param {Array<String>} options - The options to choose from
 * @param {Object} promptOptions - Input options
 * @returns {String} - The selected option
 */
export function askUserSelection(question, options, promptOptions = {}) {
  if (!options || options.length === 0) {
    logger.warning('No options provided for user selection');
    return '';
  }
  
  logger.info('Asking user for selection', { 
    question: question.substring(0, 100) + (question.length > 100 ? '...' : ''),
    optionsCount: options.length
  });
  
  console.log(chalk.cyan(question));
  
  let index = 0; // Default to first option
  
  try {
    index = readline.keyInSelect(options, chalk.cyan('Your choice:'), promptOptions);
    
    // If user cancels, return empty string
    if (index === -1) {
      logger.info('User cancelled selection');
      return '';
    }
  } catch (error) {
    console.log(chalk.yellow(`[Non-interactive mode] Cannot get selection for: ${question}`));
    console.log(chalk.yellow(`Options: ${options.join(', ')}`));
    console.log(chalk.yellow(`Using default option: ${options[0]}`));
  }
  
  const selected = options[index];
  
  logger.info('User selection result', { selected, index });
  
  return selected;
}