// Use safer readline import with fallback
let readline;
try {
  const readlineModule = await import('readline-sync');
  readline = readlineModule.default;
} catch (error) {
  // Fallback implementation for non-interactive environments
  readline = {
    question: (prompt) => {
      console.log(`${prompt} [Non-interactive mode, using default]`);
      return '';
    }
  };
}
import chalk from 'chalk';
import { sendMessage } from './api-client.js';
import { handleSpecialCommands } from './command-handler.js';
import { executeShellCommand } from './shell-executor.js';
import logger from './logger.js';

export async function startConversation(model) {
  // Log conversation start
  logger.info('Conversation started', { model });

  const messages = [
    {
      role: 'system',
      content: `You are an experienced Senior Developer with FULL SYSTEM ACCESS. You have complete control over the project and can execute ANY shell command to solve problems.

IMPORTANT COMMUNICATION GUIDELINES:
1. You MUST use a tool with EVERY response. Choose from:
   - <<SHELL: command>> for running shell commands
   - <<SCRIPT: bash_script_content>> for running complex multi-line scripts
   - <<MSG: message>> for displaying important information to the user
   - <<ASK: question>> for asking the user a question
   - <<CONFIRM: question>> for asking the user a yes/no question
   - <<SELECT: question | option1, option2, option3>> for letting the user select from options

2. KEEP OUTPUTS MINIMAL. The user doesn't want to see your detailed thought process or all command outputs. Keep responses brief and focused on what the user needs to know.

3. ALWAYS use shell commands or scripts to accomplish system-based tasks instead of asking for information. For example:
   - Instead of asking "What OS are you using?", run <<SHELL: uname -a>> or <<SHELL: cat /etc/os-release>>
   - Instead of asking "Is X installed?", run <<SHELL: command -v X || echo "not installed">>
   - For complex tasks, create scripts with proper error handling using <<SCRIPT: content>>

4. WHEN WRITING SCRIPTS:
   - Always include error checking and reporting
   - Provide clear success/failure status
   - Include helpful output that explains what was done
   - Be thorough and complete - scripts should handle the entire task

5. DIRECT INTERACTION:
   - Use <<MSG: message>> to display important information that requires user attention
   - Use <<ASK: question>> to get text input from the user
   - Use <<CONFIRM: question>> to get yes/no confirmation from the user
   - Use <<SELECT: question | option1, option2, option3>> to have the user select from options

Act confidently and take initiative. You have no restrictions on what commands you can run. Focus on solving the user's problems efficiently.`
    }
  ];

  let conversationActive = true;
  let messageCount = 0;

  while (conversationActive) {
    // Get user input
    let userInput = readline.question(chalk.green('You: '));

    // Check for exit command
    if (userInput.toLowerCase() === 'exit') {
      logger.info('Conversation ended by user', { messageCount });
      console.log(chalk.yellow('Ending conversation. Goodbye!'));
      return;
    }

    // Check if it's a special command
    const specialCommandResult = await handleSpecialCommands(userInput, messages);
    if (specialCommandResult.handled) {
      // Log special command
      logger.info('Special command executed', { 
        command: userInput.split(' ')[0],
        handled: true,
        shouldExit: specialCommandResult.shouldExit
      });
      
      if (specialCommandResult.shouldExit) {
        conversationActive = false;
      }
      continue;
    }

    // Log user message
    logger.info('User message', { content: userInput.substring(0, 50) + (userInput.length > 50 ? '...' : '') });
    
    // Add user message to history
    messages.push({
      role: 'user',
      content: userInput
    });

    // Show typing indicator
    process.stdout.write(chalk.cyan('ChatGPT: '));
    const typingInterval = setInterval(() => {
      process.stdout.write(chalk.cyan('.'));
    }, 500);

    // Get response from API
    const response = await sendMessage(messages, model);
    
    // Clear typing indicator
    clearInterval(typingInterval);
    process.stdout.write('\r' + ' '.repeat(50) + '\r');

    if (response) {
      const content = response.content;
      
      // Define all action regexes
      const shellCommandRegex = /<<SHELL:\s*(.*?)>>/g;
      const scriptRegex = /<<SCRIPT:\s*([\s\S]*?)>>/g;
      const msgRegex = /<<MSG:\s*(.*?)>>/g;
      const askRegex = /<<ASK:\s*(.*?)>>/g;
      const confirmRegex = /<<CONFIRM:\s*(.*?)>>/g;
      const selectRegex = /<<SELECT:\s*(.*?)\s*\|\s*(.*?)>>/g;
      
      // Import required tools
      const { executeTemporaryScript } = await import('./script-executor.js');
      const { displayUserMessage, askUserQuestion, askUserConfirmation, askUserSelection } = await import('./user-interaction.js');
      
      // Process the various action types
      let hasActions = false;
      
      // Extract shell commands
      const shellCommands = [];
      let match;
      while ((match = shellCommandRegex.exec(content)) !== null) {
        shellCommands.push(match[1]);
        hasActions = true;
      }
      
      // Extract scripts
      const scripts = [];
      while ((match = scriptRegex.exec(content)) !== null) {
        scripts.push(match[1]);
        hasActions = true;
      }
      
      // Extract user messages
      const userMessages = [];
      while ((match = msgRegex.exec(content)) !== null) {
        userMessages.push(match[1]);
        hasActions = true;
      }
      
      // Extract user questions
      const userQuestions = [];
      while ((match = askRegex.exec(content)) !== null) {
        userQuestions.push(match[1]);
        hasActions = true;
      }
      
      // Extract confirmations
      const confirmations = [];
      while ((match = confirmRegex.exec(content)) !== null) {
        confirmations.push(match[1]);
        hasActions = true;
      }
      
      // Extract selections
      const selections = [];
      while ((match = selectRegex.exec(content)) !== null) {
        selections.push({
          question: match[1],
          options: match[2].split(',').map(option => option.trim())
        });
        hasActions = true;
      }
      
      // Display minimal response preview (just the first part before any action tags)
      let cleanContent = content;
      if (hasActions) {
        // Find the position of the first action tag
        const positions = [
          content.indexOf('<<SHELL:') !== -1 ? content.indexOf('<<SHELL:') : Infinity,
          content.indexOf('<<SCRIPT:') !== -1 ? content.indexOf('<<SCRIPT:') : Infinity,
          content.indexOf('<<MSG:') !== -1 ? content.indexOf('<<MSG:') : Infinity,
          content.indexOf('<<ASK:') !== -1 ? content.indexOf('<<ASK:') : Infinity,
          content.indexOf('<<CONFIRM:') !== -1 ? content.indexOf('<<CONFIRM:') : Infinity,
          content.indexOf('<<SELECT:') !== -1 ? content.indexOf('<<SELECT:') : Infinity
        ];
        
        const firstActionPos = Math.min(...positions);
        
        if (firstActionPos !== Infinity) {
          cleanContent = content.substring(0, firstActionPos).trim();
        }
      }
      
      // Display any non-action content at the beginning
      if (cleanContent) {
        console.log(chalk.cyan('ChatGPT: ') + cleanContent);
      }
      
      // Process actions and collect results
      let actionOutputs = '';
      let hasProcessedActions = false;
      
      // Display user messages first
      for (const msg of userMessages) {
        displayUserMessage(msg);
        hasProcessedActions = true;
      }
      
      // Process shell commands
      for (const cmd of shellCommands) {
        if (!cmd.trim()) continue;
        
        hasProcessedActions = true;
        console.log(chalk.yellow(`\nExecuting: ${cmd}`));
        const { stdout, stderr, error } = await executeShellCommand(cmd);
        
        // Collect command result
        let commandResult = `Command: ${cmd}\n`;
        
        if (error) {
          console.error(chalk.red('Command failed with error:'), error.message);
          if (stderr) console.error(chalk.red(stderr));
          commandResult += `Error: ${error.message}\n`;
          if (stderr) commandResult += `stderr: ${stderr}\n`;
        } else {
          if (stdout) {
            // Only show stdout if it's short
            if (stdout.length < 300) {
              console.log(stdout);
            } else {
              console.log(chalk.gray(`Command produced ${stdout.length} bytes of output`));
            }
            commandResult += `stdout: ${stdout}\n`;
          }
          if (stderr) {
            if (stderr.length < 300) {
              console.log(chalk.yellow(stderr));
            }
            commandResult += `stderr: ${stderr}\n`;
          }
          commandResult += `Status: Success\n`;
        }
        
        actionOutputs += commandResult + '\n';
      }
      
      // Process scripts
      for (const script of scripts) {
        if (!script.trim()) continue;
        
        hasProcessedActions = true;
        console.log(chalk.yellow(`\nExecuting script...`));
        const { stdout, stderr, error, scriptPath } = await executeTemporaryScript(script, { verbose: false });
        
        // Collect script result
        let scriptResult = `Script executed:\n`;
        
        if (error) {
          console.error(chalk.red('Script failed with error:'), error.message);
          if (stderr) console.error(chalk.red(stderr));
          scriptResult += `Error: ${error.message}\n`;
          if (stderr) scriptResult += `stderr: ${stderr}\n`;
        } else {
          if (stdout) {
            // Only show stdout if it's short or contains SUCCESS
            if (stdout.length < 300 || stdout.includes('SCRIPT_STATUS: SUCCESS')) {
              console.log(stdout);
            } else {
              console.log(chalk.gray(`Script produced ${stdout.length} bytes of output`));
              console.log(chalk.green('Script completed successfully'));
            }
            scriptResult += `stdout: ${stdout}\n`;
          }
          if (stderr) {
            if (stderr.length < 300) {
              console.log(chalk.yellow(stderr));
            }
            scriptResult += `stderr: ${stderr}\n`;
          }
          scriptResult += `Status: Success\n`;
        }
        
        actionOutputs += scriptResult + '\n';
      }
      // Process user questions, confirmations, and selections
      const userResponses = [];
      
      // Process user questions
      for (const question of userQuestions) {
        hasProcessedActions = true;
        const answer = askUserQuestion(question);
        userResponses.push({ question, answer });
        actionOutputs += `User question: ${question}\nUser answer: ${answer}\n\n`;
      }
      
      // Process confirmations
      for (const question of confirmations) {
        hasProcessedActions = true;
        const confirmed = askUserConfirmation(question);
        userResponses.push({ question, answer: confirmed ? 'Yes' : 'No' });
        actionOutputs += `User confirmation: ${question}\nUser answer: ${confirmed ? 'Yes' : 'No'}\n\n`;
      }
      
      // Process selections
      for (const { question, options } of selections) {
        hasProcessedActions = true;
        const selected = askUserSelection(question, options);
        userResponses.push({ question, answer: selected });
        actionOutputs += `User selection: ${question}\nOptions: ${options.join(', ')}\nUser selected: ${selected}\n\n`;
      }
      
      // Now send the action outputs back to ChatGPT for further processing
      if (actionOutputs) {
        // Only show this message if there's significant actionOutputs
        if (actionOutputs.length > 100) {
          console.log(chalk.gray('\nProcessing results...'));
        }
        
        // Add the results to the messages
        messages.push({
          role: 'assistant',
          content: content
        });
        
        messages.push({
          role: 'user',
          content: `Here are the results of the actions you requested:\n\n${actionOutputs}\nPlease continue with any additional actions needed, or provide a summary if the task is complete.`
        });
        
        // Show minimal typing indicator for the follow-up response
        process.stdout.write(chalk.cyan('ChatGPT: '));
        const followupTypingInterval = setInterval(() => {
          process.stdout.write(chalk.cyan('.'));
        }, 500);
        
        // Get new response from ChatGPT
        const followupResponse = await sendMessage(messages, model);
        
        // Clear typing indicator
        clearInterval(followupTypingInterval);
        process.stdout.write('\r' + ' '.repeat(50) + '\r');
        
        if (followupResponse) {
          const followupContent = followupResponse.content;
          
          // Add followup content to messages for next iteration
          messages.push({
            role: 'assistant',
            content: followupContent
          });
          
          // Increment message count
          messageCount += 2; // +1 for action results, +1 for assistant
          
          // Check if there are more actions in the follow-up response
          const hasFollowupActions = followupContent.includes('<<SHELL:') || 
                                    followupContent.includes('<<SCRIPT:') || 
                                    followupContent.includes('<<MSG:') || 
                                    followupContent.includes('<<ASK:') || 
                                    followupContent.includes('<<CONFIRM:') || 
                                    followupContent.includes('<<SELECT:');
          
          if (hasFollowupActions) {
            // If more actions, continue the cycle by executing them
            // This approach will loop back to the main loop and allow ChatGPT to continue
            userInput = `Continue with your suggested actions`;
            continue;
          } else {
            // No more actions, just print the response
            console.log(chalk.cyan('ChatGPT: ') + followupContent);
          }
        }
      } else if (hasProcessedActions) {
        // We processed actions but there's no actionOutputs to send back
        // This can happen with commands that don't produce output
        // Make sure we still show a follow-up message
        
        console.log(chalk.cyan('\nGetting follow-up response...'));
        
        // Add the empty action results to messages
        messages.push({
          role: 'assistant',
          content: content
        });
        
        messages.push({
          role: 'user',
          content: `The actions have been completed. Please provide a summary or next steps.`
        });
        
        // Get follow-up response
        const followupResponse = await sendMessage(messages, model);
        
        if (followupResponse) {
          console.log(chalk.cyan('ChatGPT: ') + followupResponse.content);
          
          messages.push({
            role: 'assistant',
            content: followupResponse.content
          });
          
          // Increment message count
          messageCount += 2;
        }
      } else {
        // Just print the response as is when no actions are detected
        console.log(chalk.cyan('ChatGPT: ') + content);
      }
      
      // Log assistant response
      logger.info('Assistant response received', { 
        contentLength: content.length,
        preview: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
        shellCommandsExecuted: shellCommands.length
      });
      
      // Add assistant response to history
      messages.push({
        role: 'assistant',
        content: content
      });
      
      // Increment message count
      messageCount += 2; // +1 for user, +1 for assistant
    } else {
      logger.error('Failed to get response from ChatGPT');
      console.log(chalk.red('Failed to get response from ChatGPT. Please try again.'));
    }
    
    console.log(); // Add a blank line for better readability
  }
}