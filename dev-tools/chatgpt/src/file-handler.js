import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { sendFileToGPT } from './api-client.js';
import logger from './logger.js';

export async function sendFile(filePath, question, model) {
  try {
    // Log file analysis request
    logger.info('File analysis requested', { 
      filePath, 
      question: question.substring(0, 100) + (question.length > 100 ? '...' : ''),
      model 
    });
    
    // Resolve relative path to absolute path
    const absolutePath = path.resolve(process.cwd(), filePath);
    
    // Check if file exists
    if (!await fs.exists(absolutePath)) {
      logger.error('File not found', { filePath, absolutePath });
      console.error(chalk.red(`Error: File not found: ${filePath}`));
      return;
    }
    
    // Get file stats
    const stats = await fs.stat(absolutePath);
    
    // Log file stats
    logger.info('File stats', {
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime
    });
    
    // Show typing indicator
    process.stdout.write(chalk.cyan('ChatGPT is analyzing the file'));
    const typingInterval = setInterval(() => {
      process.stdout.write(chalk.cyan('.'));
    }, 500);

    // Get response from API
    const response = await sendFileToGPT(filePath, question, model);
    
    // Clear typing indicator
    clearInterval(typingInterval);
    process.stdout.write('\r' + ' '.repeat(50) + '\r');

    if (response) {
      console.log(chalk.cyan('ChatGPT: '));
      console.log(response.content);
      
      // Log successful response
      logger.info('File analysis completed', {
        responseLength: response.content.length
      });
    } else {
      // Log error
      logger.error('Failed to get response for file analysis');
      console.log(chalk.red('Failed to analyze the file with ChatGPT.'));
    }
  } catch (error) {
    // Log error
    logger.error(`Error in file handler: ${error.message}`, {
      stack: error.stack
    });
    console.error(chalk.red('Error processing file:'), error.message);
  }
}

export async function saveResponseToFile(content, outputPath) {
  try {
    // Log save request
    logger.info('Saving response to file', { outputPath });
    
    // Ensure directory exists
    await fs.ensureDir(path.dirname(outputPath));
    
    // Write content to file
    await fs.writeFile(outputPath, content);
    
    // Log success
    logger.info('Response saved successfully', { 
      outputPath, 
      contentLength: content.length 
    });
    
    console.log(chalk.green(`Response saved to ${outputPath}`));
    return true;
  } catch (error) {
    // Log error
    logger.error(`Error saving response to file: ${error.message}`, { 
      outputPath, 
      stack: error.stack 
    });
    
    console.error(chalk.red('Error saving response to file:'), error.message);
    return false;
  }
}