#!/usr/bin/env node

import { Command } from "commander"
import { startConversation } from "./src/conversation.js"
import { askSingleQuestion } from "./src/single-question.js"
import { sendFile } from "./src/file-handler.js"
import { executeShellCommand, executeInteractiveCommand, toggleAutoAccept } from "./src/shell-executor.js"
import { executeTemporaryScript, cleanupTemporaryScripts } from "./src/script-executor.js"
import { displayUserMessage, askUserQuestion, askUserConfirmation, askUserSelection } from "./src/user-interaction.js"
import chalk from "chalk"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"
import logger from "./src/logger.js"

// Get the directory where index.js is located
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables from the same directory as this file
dotenv.config({
  path: path.resolve(__dirname, ".env")
})

// Log startup information
logger.info('ChatGPT CLI starting', {
  nodeVersion: process.version,
  platform: process.platform,
  workingDirectory: process.cwd()
})

// Check if API key is configured
if (!process.env.OPENAI_API_KEY) {
  logger.error('OPENAI_API_KEY not found in environment')
  console.error(chalk.red("Error: OPENAI_API_KEY is not set in .env file"))
  console.error(chalk.yellow("Make sure the .env file exists in: " + __dirname))
  process.exit(1)
} else {
  logger.info('OPENAI_API_KEY found in environment')
}

const program = new Command()

program.name("chatgpt").description("CLI tool to interact with ChatGPT API").version("1.0.0")

program
  .command("chat")
  .description("Start an interactive conversation with ChatGPT")
  .option("-m, --model <model>", "GPT model to use", "gpt-4-turbo")
  .action((options) => {
    logger.info('Command executed: chat', { model: options.model });
    console.log(chalk.cyan("Starting conversation with ChatGPT..."))
    console.log(chalk.gray('Type "exit" or press Ctrl+C to end the conversation'))
    startConversation(options.model)
  })

program
  .command("ask <question>")
  .description("Ask a single question to ChatGPT")
  .option("-m, --model <model>", "GPT model to use", "gpt-4-turbo")
  .action((question, options) => {
    logger.info('Command executed: ask', { 
      model: options.model,
      questionLength: question.length,
      questionPreview: question.substring(0, 50) + (question.length > 50 ? '...' : '')
    });
    console.log(chalk.cyan("Asking ChatGPT: ") + question)
    askSingleQuestion(question, options.model)
  })

// Special case for direct command without 'ask'
program
  .arguments('<question>')
  .description('Ask a question directly without needing the "ask" command')
  .option("-m, --model <model>", "GPT model to use", "gpt-4-turbo")
  .action((question, options) => {
    // Check if the input matches any known command
    const knownCommands = ['ask', 'chat', 'file', 'image', 'shell'];
    const firstWord = question.split(' ')[0];
    
    // If it's not a known command, treat it as a question
    if (!knownCommands.includes(firstWord)) {
      logger.info('Command executed: direct question', { 
        model: options.model,
        questionLength: question.length,
        questionPreview: question.substring(0, 50) + (question.length > 50 ? '...' : '')
      });
      console.log(chalk.cyan("Asking ChatGPT: ") + question);
      askSingleQuestion(question, options.model);
    }
  })

program
  .command("file <filepath>")
  .description("Send a file to ChatGPT for analysis")
  .option(
    "-q, --question <question>",
    "Question about the file",
    "What does this file contain? Please analyze it."
  )
  .option("-m, --model <model>", "GPT model to use", "gpt-4-turbo")
  .action((filepath, options) => {
    logger.info('Command executed: file', { 
      filepath,
      model: options.model,
      questionLength: options.question.length
    });
    console.log(chalk.cyan(`Sending file ${filepath} to ChatGPT...`))
    sendFile(filepath, options.question, options.model)
  })

program
  .command("image <prompt>")
  .description("Generate an image using DALL-E")
  .option("-o, --output <filename>", "Output filename", `image_${Date.now()}.png`)
  .action((prompt, options) => {
    logger.info('Command executed: image', { 
      promptLength: prompt.length,
      outputFile: options.output 
    });
    console.log(chalk.cyan('Generating image from prompt: ') + prompt);
    console.log(chalk.gray(`Output will be saved to: ${options.output}`));
    
    // Show typing indicator
    process.stdout.write(chalk.cyan('Generating image'));
    const typingInterval = setInterval(() => {
      process.stdout.write(chalk.cyan('.'));
    }, 500);
    
    const startTime = Date.now();
    
    // Import the generateImage function directly
    import('./src/api-client.js').then(({ generateImage }) => {
      // Generate the image
      generateImage(prompt, options.output)
        .then(success => {
          // Clear typing indicator
          clearInterval(typingInterval);
          process.stdout.write('\r' + ' '.repeat(50) + '\r');
          
          const duration = Date.now() - startTime;
          
          if (success) {
            logger.info('Image generation completed', {
              outputFile: options.output,
              duration: duration + 'ms'
            });
            console.log(chalk.green(`Image successfully generated and saved to ${options.output}`));
          } else {
            logger.error('Image generation failed');
            console.log(chalk.red('Failed to generate image. Check logs for details.'));
          }
        })
        .catch(error => {
          // Clear typing indicator
          clearInterval(typingInterval);
          process.stdout.write('\r' + ' '.repeat(50) + '\r');
          
          logger.error(`Error generating image: ${error.message}`, {
            stack: error.stack
          });
          console.error(chalk.red('Error generating image:'), error.message);
        });
    });
  })

program
  .command("shell <command>")
  .description("Execute a shell command")
  .option("-i, --interactive", "Run command in interactive mode with real-time output", false)
  .option("-y, --yes", "Auto-accept command without confirmation", false)
  .action(async (command, options) => {
    logger.info('Command executed: shell', { 
      command: command.substring(0, 50) + (command.length > 50 ? '...' : ''),
      interactive: options.interactive,
      autoAccept: options.yes
    });
    
    if (options.interactive) {
      console.log(chalk.cyan('Executing command interactively: ') + command);
      await executeInteractiveCommand(command, {}, options.yes);
    } else {
      console.log(chalk.cyan('Executing command: ') + command);
      const { stdout, stderr, error } = await executeShellCommand(command, {}, options.yes);
      
      if (error) {
        console.error(chalk.red('Command failed with error:'), error.message);
        if (stderr) {
          console.error(chalk.red('stderr:'));
          console.error(stderr);
        }
      } else {
        if (stdout) {
          console.log(chalk.green('Command output:'));
          console.log(stdout);
        }
        if (stderr) {
          console.log(chalk.yellow('stderr:'));
          console.log(stderr);
        }
        console.log(chalk.green('Command executed successfully.'));
      }
    }
  })

program
  .command("auto-accept")
  .description("Toggle auto-accept mode for shell commands")
  .action(() => {
    const newState = toggleAutoAccept();
    
    logger.info('Command executed: auto-accept', { newState });
    
    if (newState) {
      console.log(chalk.green('Auto-accept mode is now ON. Commands will execute without confirmation.'));
    } else {
      console.log(chalk.yellow('Auto-accept mode is now OFF. You will be asked to confirm each command.'));
    }
  })

program
  .command("script")
  .description("Execute a bash script from a file or stdin")
  .argument('<script>', 'The script content or file path')
  .option("-f, --file", "Treat the argument as a file path instead of script content", false)
  .option("-v, --verbose", "Show verbose output", false)
  .option("-y, --yes", "Auto-accept script execution without confirmation", false)
  .action(async (script, options) => {
    logger.info('Command executed: script', { 
      scriptLength: script.length,
      isFile: options.file,
      verbose: options.verbose,
      autoAccept: options.yes
    });
    
    let scriptContent = script;
    
    // If the script is a file, read its contents
    if (options.file) {
      try {
        const fs = await import('fs-extra');
        scriptContent = await fs.readFile(script, 'utf8');
        console.log(chalk.cyan(`Reading script from file: ${script}`));
      } catch (error) {
        console.error(chalk.red(`Error reading script file: ${error.message}`));
        return;
      }
    }
    
    console.log(chalk.cyan('Executing script...'));
    const result = await executeTemporaryScript(scriptContent, { 
      verbose: options.verbose,
      skipConfirmation: options.yes
    });
    
    if (result.error) {
      console.error(chalk.red('Script failed with error:'), result.error.message);
      if (result.stderr) {
        console.error(chalk.red('stderr:'));
        console.error(result.stderr);
      }
    } else {
      if (result.stdout) {
        if (options.verbose || result.stdout.length < 300) {
          console.log(chalk.green('Script output:'));
          console.log(result.stdout);
        } else {
          console.log(chalk.green(`Script produced ${result.stdout.length} bytes of output`));
          
          // Check for SUCCESS markers
          if (result.stdout.includes('SCRIPT_STATUS: SUCCESS')) {
            console.log(chalk.green('Script completed successfully.'));
          }
        }
      }
      console.log(chalk.green('Script executed successfully.'));
    }
  })

program
  .command("cleanup")
  .description("Clean up temporary script files")
  .action(async () => {
    logger.info('Command executed: cleanup');
    
    const count = await cleanupTemporaryScripts();
    console.log(chalk.green(`Cleaned up ${count} temporary script files.`));
  })

program.parse(process.argv)

// If no arguments, show help
if (!process.argv.slice(2).length) {
  logger.info('No command specified, showing help');
  program.outputHelp()
}

// Log program exit
process.on('exit', () => {
  logger.info('ChatGPT CLI exiting');
});

// Log uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught exception: ${err.message}`, {
    stack: err.stack,
    name: err.name
  });
  console.error(chalk.red('An unexpected error occurred:'), err.message);
  process.exit(1);
});
