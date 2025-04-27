import chalk from 'chalk';
import fs from 'fs-extra';
import readline from 'readline-sync';
import path from 'path';
import { saveResponseToFile } from './file-handler.js';
import { generateImage } from './api-client.js';
import { toggleAutoAccept, autoAcceptCommands } from './shell-executor.js';
import logger from './logger.js';

export async function handleSpecialCommands(input, messages) {
  // Check if input is a command
  if (!input.startsWith('/')) {
    return { handled: false };
  }

  const parts = input.trim().split(' ');
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);

  switch (command) {
    case '/help':
      logger.info('Command executed: /help');
      showHelp();
      return { handled: true };
      
    case '/clear':
      logger.info('Command executed: /clear', { messagesCleared: messages.length - 1 });
      clearConversation(messages);
      return { handled: true };
      
    case '/save':
      logger.info('Command executed: /save', { filename: args[0] });
      await saveConversation(messages, args[0]);
      return { handled: true };
      
    case '/load':
      if (args.length === 0) {
        logger.warning('Command executed: /load with no filename');
        console.log(chalk.red('Please specify a file to load'));
        return { handled: true };
      }
      logger.info('Command executed: /load', { filename: args[0] });
      await loadFile(args[0], messages);
      return { handled: true };

    case '/image':
      if (args.length === 0) {
        logger.warning('Command executed: /image with no prompt');
        console.log(chalk.red('Please specify an image prompt'));
        return { handled: true };
      }
      logger.info('Command executed: /image', { promptLength: args.join(' ').length });
      await generateImageCommand(args.join(' '));
      return { handled: true };
      
    case '/auto-accept':
      const newState = toggleAutoAccept();
      logger.info('Command executed: /auto-accept', { newState });
      if (newState) {
        console.log(chalk.green('Auto-accept mode is now ON. Commands will execute without confirmation.'));
      } else {
        console.log(chalk.yellow('Auto-accept mode is now OFF. You will be asked to confirm each command.'));
      }
      return { handled: true };
      
    case '/shell':
      if (args.length === 0) {
        logger.warning('Command executed: /shell with no command');
        console.log(chalk.red('Please specify a shell command to execute'));
        return { handled: true };
      }
      logger.info('Command executed: /shell', { command: args.join(' ') });
      
      // Import shell executor dynamically
      const { executeShellCommand } = await import('./shell-executor.js');
      
      const shellCommand = args.join(' ');
      console.log(chalk.cyan(`Executing shell command: ${shellCommand}`));
      
      const { stdout, stderr, error } = await executeShellCommand(shellCommand);
      
      if (error) {
        console.error(chalk.red('Command failed with error:'), error.message);
        if (stderr) console.error(chalk.red(stderr));
      } else {
        if (stdout) console.log(stdout);
        if (stderr) console.log(chalk.yellow(stderr));
        console.log(chalk.green('Command executed successfully.'));
      }
      
      return { handled: true };
    
    case '/script':
      if (args.length === 0) {
        logger.warning('Command executed: /script with no content');
        console.log(chalk.red('Please provide a script to execute'));
        return { handled: true };
      }
      
      logger.info('Command executed: /script', { scriptLength: args.join(' ').length });
      
      // Import script executor dynamically
      const { executeTemporaryScript } = await import('./script-executor.js');
      
      const scriptContent = args.join(' ');
      console.log(chalk.cyan('Creating and executing temporary script...'));
      
      const scriptResult = await executeTemporaryScript(scriptContent, { verbose: false });
      
      if (scriptResult.error) {
        console.error(chalk.red('Script failed with error:'), scriptResult.error.message);
        if (scriptResult.stderr) console.error(chalk.red(scriptResult.stderr));
      } else {
        if (scriptResult.stdout) {
          if (scriptResult.stdout.length < 300 || scriptResult.stdout.includes('SCRIPT_STATUS: SUCCESS')) {
            console.log(scriptResult.stdout);
          } else {
            console.log(chalk.gray(`Script produced ${scriptResult.stdout.length} bytes of output`));
            console.log(chalk.green('Script completed successfully'));
          }
        }
      }
      
      return { handled: true };
      
    case '/exit':
      logger.info('Command executed: /exit');
      console.log(chalk.yellow('Ending conversation. Goodbye!'));
      return { handled: true, shouldExit: true };
      
    default:
      logger.warning('Unknown command executed', { command });
      console.log(chalk.yellow(`Unknown command: ${command}. Type /help for available commands.`));
      return { handled: true };
  }
}

function showHelp() {
  console.log(chalk.cyan('\nAvailable commands:'));
  console.log(chalk.cyan('/help') + ' - Show this help message');
  console.log(chalk.cyan('/clear') + ' - Clear the current conversation history');
  console.log(chalk.cyan('/save [filename]') + ' - Save the conversation to a file');
  console.log(chalk.cyan('/load <filename>') + ' - Load a file into the conversation');
  console.log(chalk.cyan('/image <prompt>') + ' - Generate an image based on a prompt');
  console.log(chalk.cyan('/shell <command>') + ' - Execute a shell command');
  console.log(chalk.cyan('/script <bash-script>') + ' - Create and execute a temporary script');
  console.log(chalk.cyan('/auto-accept') + ' - Toggle auto-accept mode for shell commands');
  console.log(chalk.cyan('/exit') + ' - End the conversation\n');
  
  // Show current auto-accept status
  const status = autoAcceptCommands ? 
    chalk.green('ON (commands will execute without confirmation)') : 
    chalk.yellow('OFF (you will be asked to confirm each command)');
  console.log(chalk.cyan('Auto-accept mode is currently: ') + status + '\n');
}

function clearConversation(messages) {
  // Keep only the system message
  const systemMessage = messages.find(msg => msg.role === 'system');
  const messageCount = messages.length;
  
  messages.length = 0;
  if (systemMessage) {
    messages.push(systemMessage);
  }
  
  logger.info('Conversation history cleared', { 
    messagesRemoved: messageCount - 1
  });
  
  console.log(chalk.green('Conversation history cleared.'));
}

async function saveConversation(messages, filename) {
  try {
    const defaultFilename = `conversation_${new Date().toISOString().replace(/:/g, '-')}.json`;
    const outputFilename = filename || defaultFilename;
    
    const conversationData = {
      date: new Date().toISOString(),
      messages: messages.filter(msg => msg.role !== 'system') // Exclude system message
    };
    
    logger.info('Saving conversation to file', { 
      filename: outputFilename,
      messageCount: conversationData.messages.length
    });
    
    await saveResponseToFile(
      JSON.stringify(conversationData, null, 2), 
      outputFilename
    );
  } catch (error) {
    logger.error(`Error saving conversation: ${error.message}`, {
      stack: error.stack
    });
    console.error(chalk.red('Error saving conversation:'), error.message);
  }
}

async function loadFile(filename, messages) {
  try {
    // Resolve relative path to absolute path
    const absolutePath = path.resolve(process.cwd(), filename);
    
    logger.info('Loading file', { 
      filename,
      absolutePath
    });
    
    if (!await fs.exists(absolutePath)) {
      logger.error('File not found during load', { filename, absolutePath });
      console.error(chalk.red(`File not found: ${filename}`));
      return;
    }
    
    // Get file stats
    const stats = await fs.stat(absolutePath);
    
    // Log file stats
    logger.info('File stats for loaded file', {
      size: stats.size,
      modified: stats.mtime
    });
    
    const content = await fs.readFile(absolutePath, 'utf8');
    
    // Automatically determine if it's a conversation JSON or a regular file
    if (filename.endsWith('.json')) {
      try {
        const conversationData = JSON.parse(content);
        if (Array.isArray(conversationData.messages)) {
          logger.info('Loading conversation from JSON file', {
            messageCount: conversationData.messages.length,
            conversationDate: conversationData.date
          });
          
          // Append loaded messages to current conversation
          for (const message of conversationData.messages) {
            messages.push(message);
          }
          console.log(chalk.green(`Loaded conversation from ${filename}`));
          return;
        }
      } catch (e) {
        logger.warning('JSON file is not a valid conversation format', { error: e.message });
        // Not a valid conversation JSON, treat as regular file
      }
    }
    
    // Ask user for a question about the file
    const question = readline.question(chalk.green('What would you like to ask about this file? '));
    
    logger.info('Question asked about loaded file', {
      question: question.substring(0, 100) + (question.length > 100 ? '...' : '')
    });
    
    // Add file content to messages
    messages.push({
      role: 'user',
      content: `Here is the content of the file "${path.basename(filename)}":\n\n${content}\n\n${question}`
    });
    
    console.log(chalk.green(`Loaded file ${filename} and added to conversation.`));
  } catch (error) {
    logger.error(`Error loading file: ${error.message}`, {
      filename,
      stack: error.stack
    });
    console.error(chalk.red('Error loading file:'), error.message);
  }
}

async function generateImageCommand(prompt) {
  try {
    logger.info('Image generation requested', { 
      promptLength: prompt.length,
      promptPreview: prompt.substring(0, 50) + (prompt.length > 50 ? '...' : '')
    });
    
    console.log(chalk.cyan('Generating image from prompt: ') + prompt);
    
    // Ask for output filename
    const defaultFilename = `image_${Date.now()}.png`;
    const filename = readline.question(
      chalk.green(`Enter output filename (default: ${defaultFilename}): `)
    ) || defaultFilename;
    
    logger.info('Image output filename selected', { filename });
    
    // Show typing indicator
    process.stdout.write(chalk.cyan('Generating image'));
    const typingInterval = setInterval(() => {
      process.stdout.write(chalk.cyan('.'));
    }, 500);
    
    const startTime = Date.now();
    
    // Generate the image
    const success = await generateImage(prompt, filename);
    
    const duration = Date.now() - startTime;
    
    // Clear typing indicator
    clearInterval(typingInterval);
    process.stdout.write('\r' + ' '.repeat(50) + '\r');
    
    if (success) {
      logger.info('Image generation completed', {
        filename,
        duration: duration + 'ms'
      });
    } else {
      logger.error('Image generation failed');
    }
    
  } catch (error) {
    logger.error(`Error generating image: ${error.message}`, {
      stack: error.stack
    });
    console.error(chalk.red('Error generating image:'), error.message);
  }
}