import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { executeShellCommand } from './shell-executor.js';
import logger from './logger.js';
import { v4 as uuidv4 } from 'uuid';
import os from 'os';

// Directory for temporary scripts
const TEMP_SCRIPT_DIR = path.join(os.tmpdir(), 'chatgpt-scripts');

// Ensure temp directory exists
fs.ensureDirSync(TEMP_SCRIPT_DIR);

/**
 * Create and execute a temporary bash script
 * @param {String} scriptContent - The bash script content
 * @param {Object} options - Options for script execution
 * @param {Boolean} options.verbose - Whether to show full script output (default: false)
 * @param {Boolean} options.skipConfirmation - Skip confirmation even if auto-accept is off
 * @returns {Promise<{stdout: String, stderr: String, error: Error|null, scriptPath: String}>}
 */
export async function executeTemporaryScript(scriptContent, options = {}) {
  const { verbose = false, skipConfirmation = false } = options;
  
  // Create a unique script name
  const scriptId = uuidv4().substring(0, 8);
  const scriptName = `chatgpt-script-${scriptId}.sh`;
  const scriptPath = path.join(TEMP_SCRIPT_DIR, scriptName);
  
  try {
    // Add error handling wrapper to script
    const wrappedScript = wrapScriptWithErrorHandling(scriptContent);
    
    // Write script to temporary file
    await fs.writeFile(scriptPath, wrappedScript, { mode: 0o755 }); // Make executable
    
    if (verbose) {
      console.log(chalk.cyan(`Created temporary script: ${scriptPath}`));
      console.log(chalk.gray('Script content:'));
      console.log(chalk.gray(wrappedScript));
    } else {
      console.log(chalk.cyan(`Executing script with ID: ${scriptId}...`));
    }
    
    // Execute the script
    const result = await executeShellCommand(`${scriptPath}`, {}, skipConfirmation);
    
    // Clean up temp file if successful
    if (!result.error) {
      await fs.remove(scriptPath);
      if (verbose) {
        console.log(chalk.green(`Removed temporary script: ${scriptPath}`));
      }
    }
    
    return {
      ...result,
      scriptPath
    };
  } catch (error) {
    logger.error(`Script creation/execution error: ${error.message}`, {
      scriptPath,
      error: error.stack
    });
    
    return {
      stdout: '',
      stderr: `Error creating or executing script: ${error.message}`,
      error,
      scriptPath
    };
  }
}

/**
 * Wrap a bash script with error handling and status reporting
 * @param {String} scriptContent - The original script content
 * @returns {String} - The script with added error handling
 */
function wrapScriptWithErrorHandling(scriptContent) {
  return `#!/bin/bash
# Temporary script created by ChatGPT CLI

# Error handling
set -e

# Function to handle errors
handle_error() {
  local line_num=$1
  local command=$2
  local exit_code=$3
  echo "ERROR: Command '$command' failed at line $line_num with exit code $exit_code"
  exit $exit_code
}

# Set error trap
trap 'handle_error $LINENO "$BASH_COMMAND" $?' ERR

# Enable command output for debugging
set -x

# Begin user script
${scriptContent}

# End script with success message
echo ""
echo "SCRIPT_STATUS: SUCCESS"
exit 0
`;
}

/**
 * Lists all temporary scripts
 * @returns {Promise<Array<String>>} - List of script paths
 */
export async function listTemporaryScripts() {
  try {
    const files = await fs.readdir(TEMP_SCRIPT_DIR);
    return files
      .filter(file => file.startsWith('chatgpt-script-') && file.endsWith('.sh'))
      .map(file => path.join(TEMP_SCRIPT_DIR, file));
  } catch (error) {
    logger.error(`Error listing temporary scripts: ${error.message}`);
    return [];
  }
}

/**
 * Cleans up all temporary scripts
 * @returns {Promise<Number>} - Number of scripts removed
 */
export async function cleanupTemporaryScripts() {
  try {
    const scripts = await listTemporaryScripts();
    
    for (const script of scripts) {
      await fs.remove(script);
    }
    
    return scripts.length;
  } catch (error) {
    logger.error(`Error cleaning up temporary scripts: ${error.message}`);
    return 0;
  }
}