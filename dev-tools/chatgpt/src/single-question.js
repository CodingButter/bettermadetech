import { sendMessage } from './api-client.js';
import { executeShellCommand } from './shell-executor.js';
import chalk from 'chalk';
import logger from './logger.js';

export async function askSingleQuestion(question, model) {
  try {
    // Log question
    logger.info('Single question mode started', { 
      model,
      questionLength: question.length,
      questionPreview: question.substring(0, 50) + (question.length > 50 ? '...' : '')
    });
    
    // Prepare messages array with senior developer system prompt
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
      },
      {
        role: 'user',
        content: question
      }
    ];

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
      
      // Check if the response contains shell commands to execute
      const shellCommandRegex = /<<SHELL:\s*(.*?)>>/g;
      let match;
      let processedContent = content;
      
      const shellCommands = [];
      while ((match = shellCommandRegex.exec(content)) !== null) {
        shellCommands.push(match[1]);
      }
      
      // If there are shell commands, execute them sequentially and feed output back to ChatGPT
      if (shellCommands.length > 0) {
        console.log(chalk.cyan('ChatGPT: ') + processedContent.replace(shellCommandRegex, (_, cmd) => {
          return chalk.cyan(`\n\nExecuting command: ${cmd}\n`);
        }));
        
        // Execute each shell command, collect outputs, and add them to conversation
        let commandOutputs = '';
        let hasProcessedActions = false;
        
        for (const cmd of shellCommands) {
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
          
          commandOutputs += commandResult + '\n';
        }
        
        // Now send the command outputs back to ChatGPT for further processing
        if (commandOutputs) {
          console.log(chalk.cyan('\nSending command results to ChatGPT for further processing...'));
          
          // Add the command results to the messages
          messages.push({
            role: 'assistant',
            content: content
          });
          
          messages.push({
            role: 'user',
            content: `Here are the results of the commands you asked me to run:\n\n${commandOutputs}\nPlease continue with any additional commands needed to complete the task, or provide a summary if the task is complete.`
          });
          
          // Show typing indicator for follow-up
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
            
            // Check if there are more shell commands to execute
            const moreShellCommands = [];
            let match;
            const newRegex = /<<SHELL:\s*(.*?)>>/g;
            while ((match = newRegex.exec(followupContent)) !== null) {
              moreShellCommands.push(match[1]);
            }
            
            if (moreShellCommands.length > 0) {
              // We have more commands to execute
              console.log(chalk.cyan('ChatGPT has more commands to execute:'));
              console.log(chalk.cyan('ChatGPT: ') + followupContent.replace(newRegex, (_, cmd) => {
                return chalk.cyan(`\n\nExecuting command: ${cmd}\n`);
              }));
              
              // Execute each additional shell command
              let moreOutputs = '';
              for (const cmd of moreShellCommands) {
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
                
                moreOutputs += commandResult + '\n';
              }
              
              // Add followupContent to messages and continue recursively
              messages.push({
                role: 'assistant',
                content: followupContent
              });
              
              // Add the new command results and ask for more if needed
              if (moreOutputs) {
                messages.push({
                  role: 'user',
                  content: `Here are the results of your additional commands:\n\n${moreOutputs}\nPlease continue with any additional commands needed to complete the task, or provide a summary if the task is complete.`
                });
                
                // Recursive call to get next set of commands (if any)
                console.log(chalk.cyan('\nSending additional command results to ChatGPT...'));
                
                // Show typing indicator for next follow-up
                process.stdout.write(chalk.cyan('ChatGPT: '));
                const nextTypingInterval = setInterval(() => {
                  process.stdout.write(chalk.cyan('.'));
                }, 500);
                
                // Get new response from ChatGPT
                const nextResponse = await sendMessage(messages, model);
                
                // Clear typing indicator
                clearInterval(nextTypingInterval);
                process.stdout.write('\r' + ' '.repeat(50) + '\r');
                
                if (nextResponse) {
                  const nextContent = nextResponse.content;
                  
                  // Check if there are more shell commands to execute
                  const hasMoreCommands = nextContent.includes('<<SHELL:');
                  
                  if (!hasMoreCommands) {
                    // No more commands, just print the final response
                    console.log(chalk.cyan('ChatGPT (Complete): ') + nextContent);
                  } else {
                    // There are more commands - continue the pattern...
                    // In a production system, this would be refactored to a loop
                    // to avoid excessive nesting and repetition
                    console.log(chalk.cyan('ChatGPT (Continues): ') + nextContent);
                    
                    // Add another turn to the conversation
                    messages.push({
                      role: 'assistant',
                      content: nextContent
                    });
                    
                    // Execute next round of commands (simplified for this example)
                    const finalCommands = [];
                    let finalMatch;
                    while ((finalMatch = newRegex.exec(nextContent)) !== null) {
                      finalCommands.push(finalMatch[1]);
                    }
                    
                    if (finalCommands.length > 0) {
                      console.log(chalk.cyan('Executing final round of commands...'));
                      
                      // Execute final commands
                      for (const cmd of finalCommands) {
                        console.log(chalk.yellow(`\nExecuting: ${cmd}`));
                        const { stdout, stderr, error } = await executeShellCommand(cmd);
                        
                        if (error) {
                          console.error(chalk.red('Command failed with error:'), error.message);
                          if (stderr) console.error(chalk.red(stderr));
                        } else {
                          if (stdout) console.log(stdout);
                          if (stderr) console.log(chalk.yellow(stderr));
                        }
                      }
                      
                      console.log(chalk.green('\nTask completed with multiple command iterations.'));
                    }
                  }
                }
              }
            } else {
              // No more commands, just print the final response
              console.log(chalk.cyan('ChatGPT (Complete): ') + followupContent);
            }
          }
        }
      } else if (hasProcessedActions) {
        // We processed actions but there's no commandOutputs to send back
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
        const followupTypingInterval = setInterval(() => {
          process.stdout.write(chalk.cyan('.'));
        }, 500);
        
        const followupResponse = await sendMessage(messages, model);
        
        clearInterval(followupTypingInterval);
        process.stdout.write('\r' + ' '.repeat(50) + '\r');
        
        if (followupResponse) {
          console.log(chalk.cyan('ChatGPT: ') + followupResponse.content);
        }
      } else {
        // Just print the response as is
        console.log(chalk.cyan('ChatGPT: ') + content);
      }
      
      // Log response
      logger.info('Single question response received', { 
        contentLength: content.length,
        preview: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
        shellCommandsExecuted: shellCommands.length
      });
    } else {
      logger.error('Failed to get response from ChatGPT in single question mode');
      console.log(chalk.red('Failed to get response from ChatGPT. Please try again.'));
    }
  } catch (error) {
    logger.error(`Error in single question mode: ${error.message}`, {
      stack: error.stack
    });
    console.error(chalk.red('Error:'), error.message);
  }
}