# ChatGPT CLI with Enhanced Shell Access

A command-line interface for interacting with ChatGPT during development with complete shell integration, script execution, and system control.

## Features

- 💬 Interactive chat with ChatGPT (senior developer mode)
- 🖥️ Execute ANY shell command directly through ChatGPT responses
- 📜 Create and run temporary bash scripts with error handling
- 💬 Allow ChatGPT to interact directly with the user
- 📄 Send files for analysis
- 📝 Ask single questions
- 🖼️ Generate images with DALL-E
- 💾 Save and load conversations
- 🔄 Clear conversation history

## Installation

1. Clone this repository or navigate to the project directory
2. Run `npm install` to install dependencies
3. Make sure your `.env` file contains a valid `OPENAI_API_KEY`
4. Install globally (optional): `npm install -g .`

## Usage

### Basic Commands

```bash
# Start an interactive chat session
chatgpt chat

# Ask a single question
chatgpt ask "How do I create a React component?"

# Ask directly without the "ask" command 
chatgpt "Install ffmpeg for me"

# Send a file for analysis
chatgpt file path/to/file.js --question "What does this code do?"

# Generate an image with DALL-E
chatgpt image "A cyberpunk robot coding at a computer" --output robot.png

# Execute a shell command directly
chatgpt shell "ls -la"

# Execute an interactive shell command with real-time output
chatgpt shell -i "npm install express"

# Create and run a temporary script
chatgpt script "echo 'Hello World'; ls -la"

# Toggle auto-accept mode for shell commands
chatgpt auto-accept
```

### Chat Mode Special Commands

When in chat mode, you can use the following commands:

- `/help` - Show available commands
- `/clear` - Clear conversation history
- `/save [filename]` - Save the conversation to a file
- `/load <filename>` - Load a file into the conversation
- `/image <prompt>` - Generate an image with DALL-E
- `/shell <command>` - Execute a shell command directly
- `/script <script>` - Create and execute a temporary script
- `/auto-accept` - Toggle auto-accept mode for shell commands
- `/exit` - End the conversation

## ChatGPT Tools

ChatGPT can use the following special tools to interact with the system and user:

```
<<SHELL: command>>         # Execute a shell command
<<SCRIPT: bash_script>>    # Create and run a temporary script
<<MSG: message>>           # Display an important message to the user
<<ASK: question>>          # Ask the user a question and get input
<<CONFIRM: question>>      # Ask for yes/no confirmation
<<SELECT: question | opt1, opt2, opt3>>  # Let user select from options
```

## Examples

```bash
# Create a full React component
chatgpt "Create a React form component with validation"

# Install and configure software
chatgpt "Install and configure Nginx as a reverse proxy"

# System diagnostics
chatgpt "Check my system for performance issues"
```

## Script Mode

The script command allows you to run multi-line bash scripts:

```bash
# Run a script from inline content
chatgpt script "for i in {1..5}; do echo \$i; done"

# Run a script from a file
chatgpt script -f path/to/script.sh

# Show verbose output including script content
chatgpt script -v "echo 'Hello World'"

# Skip confirmation prompt
chatgpt script -y "sudo apt update && sudo apt upgrade -y"
```

## Security Considerations

⚠️ **IMPORTANT SECURITY WARNING** ⚠️

This tool allows ChatGPT to execute **ANY** shell command on your system. It has full access to your files, system configuration, and network. There are NO restrictions on what commands can be run. Use this tool only in controlled environments where you understand the security implications.

## Environment Variables

Create a `.env` file with:

```
OPENAI_API_KEY=your_api_key_here
```