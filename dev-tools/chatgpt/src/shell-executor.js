import { exec } from 'child_process';
import chalk from 'chalk';
import logger from './logger.js';

// Global setting for auto-accepting commands without confirmation
export let autoAcceptCommands = false;

// Toggle auto-accept mode
export function toggleAutoAccept() {
  autoAcceptCommands = !autoAcceptCommands;
  return autoAcceptCommands;
}

/**
 * Execute a shell command and return the result
 * @param {String} command - The shell command to execute
 * @param {Object} options - Optional parameters for execution
 * @param {Boolean} skipConfirmation - Skip confirmation even if auto-accept is off
 * @returns {Promise<{stdout: String, stderr: String, error: Error|null}>}
 */
export async function executeShellCommand(command, options = {}, skipConfirmation = false) {
  const startTime = Date.now();
  
  // Log the command request
  logger.info('Shell command requested', { 
    command: command.substring(0, 100) + (command.length > 100 ? '...' : ''),
    cwd: options.cwd || process.cwd(),
    autoAccept: autoAcceptCommands
  });
  
  // If auto-accept is off and skipConfirmation is false, prompt for confirmation
  let shouldExecute = true;
  
  if (!autoAcceptCommands && !skipConfirmation) {
    try {
      // Use readline-sync for confirmation
      const readline = await import('readline-sync');
      const confirm = readline.default.keyInYNStrict(
        chalk.yellow(`\nDo you want to execute this command? `) + 
        chalk.white(`${command}`) + 
        chalk.yellow(` (Y/N)`)
      );
      
      shouldExecute = confirm;
    } catch (error) {
      console.log(chalk.yellow('[Non-interactive mode] Using auto-accept for command:'));
      console.log(chalk.white(command));
      shouldExecute = true;
    }
    
    if (!shouldExecute) {
      logger.info('Command execution rejected by user', { command });
      return { 
        stdout: "Command execution cancelled by user.", 
        stderr: "", 
        error: new Error("Command cancelled by user") 
      };
    }
  }
  
  return new Promise((resolve) => {
    exec(command, { 
      ...options,
      maxBuffer: 10 * 1024 * 1024 // 10MB buffer for large outputs
    }, (error, stdout, stderr) => {
      const duration = Date.now() - startTime;
      
      // Log command execution result
      if (error) {
        logger.error(`Shell command failed: ${error.message}`, {
          command,
          exitCode: error.code,
          duration: `${duration}ms`,
        });
      } else {
        logger.info('Shell command succeeded', {
          command: command.substring(0, 100) + (command.length > 100 ? '...' : ''),
          duration: `${duration}ms`,
          outputSize: stdout.length + stderr.length,
        });
      }
      
      resolve({ stdout, stderr, error });
    });
  });
}

/**
 * Execute a shell command and display the output in real time
 * @param {String} command - The shell command to execute 
 * @param {Object} options - Optional parameters for execution
 * @param {Boolean} skipConfirmation - Skip confirmation even if auto-accept is off
 * @returns {Promise<{success: Boolean, error: Error|null}>}
 */
export function executeInteractiveCommand(command, options = {}, skipConfirmation = false) {
  return new Promise(async (resolve) => {
    logger.info('Interactive shell command started', { 
      command: command.substring(0, 100) + (command.length > 100 ? '...' : ''),
      autoAccept: autoAcceptCommands
    });
    
    // If auto-accept is off and skipConfirmation is false, prompt for confirmation
    let shouldExecute = true;
    
    if (!autoAcceptCommands && !skipConfirmation) {
      // Use readline-sync for confirmation
      const readline = await import('readline-sync');
      const confirm = readline.default.keyInYNStrict(
        chalk.yellow(`\nDo you want to execute this interactive command? `) + 
        chalk.white(`${command}`) + 
        chalk.yellow(` (Y/N)`)
      );
      
      shouldExecute = confirm;
      
      if (!shouldExecute) {
        logger.info('Interactive command execution rejected by user', { command });
        return resolve({ 
          success: false, 
          error: new Error("Command cancelled by user") 
        });
      }
    }
    
    console.log(chalk.cyan(`Executing: ${command}`));
    
    const childProcess = exec(command, options);
    
    childProcess.stdout.on('data', (data) => {
      process.stdout.write(data);
    });
    
    childProcess.stderr.on('data', (data) => {
      process.stderr.write(chalk.red(data));
    });
    
    childProcess.on('close', (code) => {
      if (code === 0) {
        logger.info('Interactive shell command completed successfully', { command, exitCode: code });
        console.log(chalk.green(`\nCommand completed successfully (exit code: ${code})`));
        resolve({ success: true, error: null });
      } else {
        logger.error('Interactive shell command failed', { command, exitCode: code });
        console.log(chalk.red(`\nCommand failed with exit code: ${code}`));
        resolve({ success: false, error: new Error(`Command failed with exit code: ${code}`) });
      }
    });
  });
}