# ChatGPT CLI with Shell Access - Usage Guide

This document provides detailed usage examples for the ChatGPT CLI tool with full shell command access.

## Getting Started

Make sure you have set up your API key in the `.env` file:

```
OPENAI_API_KEY=your_api_key_here
```

⚠️ **IMPORTANT SECURITY WARNING** ⚠️

This tool allows ChatGPT to execute **ANY** shell command on your system. It has full access to your files, system configuration, and network. There are NO restrictions on what commands can be run. Use this tool only in controlled environments where you understand the security implications.

## Command Examples

### Interactive Chat

Start an interactive chat session with a senior developer who has full system access:

```bash
chatgpt chat
```

During an interactive session, you can:
- Type your questions or statements naturally
- Use special commands (start with `/`)
- ChatGPT can execute shell commands directly in its responses using `<<SHELL: command>>`
- End the session by typing `exit` or pressing Ctrl+C

### Ask a Single Question

```bash
# Basic question using "ask" command
chatgpt ask "What is the best way to handle errors in JavaScript?"

# Direct question without the "ask" command
chatgpt "Install ffmpeg for me"

# Ask to perform a task that requires shell commands
chatgpt "Create a new React component for a login form"

# Ask for system diagnostic information
chatgpt "Check my system's resource usage and top processes"

# With a specific model
chatgpt "Explain React hooks" -m gpt-3.5-turbo
```

### Execute Shell Commands Directly

```bash
# Simple shell command
chatgpt shell "ls -la"

# Chain multiple commands
chatgpt shell "df -h && free -m"

# Interactive commands with real-time output (e.g., installations)
chatgpt shell -i "npm install express"

# Complex system operations
chatgpt shell "find . -type f -name '*.js' | xargs grep 'import React'"

# Automatically accept command without confirmation
chatgpt shell -y "apt-get update"

# Toggle auto-accept mode globally
chatgpt auto-accept
```

### Analyze Files

```bash
# Analyze a file with the default question
chatgpt file ./src/App.js

# Analyze with a specific question
chatgpt file ./test/sample.js --question "What does this function do? Is there a more efficient implementation?"
```

### Generate Images

Generate an image using DALL-E directly from the command line:

```bash
# Basic image generation with default output filename
chatgpt image "A futuristic city with flying cars and neon lights"

# Specify the output filename
chatgpt image "A cute robot mascot for a coding assistant" --output mascot.png
```

## Special Commands in Chat Mode

### Help

Display available commands:

```
/help
```

### Shell Commands

Execute any shell command directly:

```
/shell ls -la
```

```
/shell git status
```

```
/shell npm install express
```

### Auto-Accept Toggle

Toggle whether shell commands require confirmation:

```
/auto-accept
```

When auto-accept is ON, shell commands will execute immediately without asking for confirmation. When OFF, you'll be prompted to confirm each command before execution.

You can also run a single command with auto-accept from the command line:

```bash
chatgpt shell -y "apt update && apt upgrade"
```

### Clear Conversation

Reset the conversation history (keeps the system prompt):

```
/clear
```

### Save Conversation

Save the current conversation to a JSON file:

```
/save
```

Save to a specific filename:

```
/save my_conversation.json
```

### Load File or Conversation

Load a previously saved conversation:

```
/load my_conversation.json
```

Load a code file to ask about:

```
/load ./src/component.jsx
```
After loading a file, you'll be prompted to enter a question about it.

### Generate Images

Generate an image using DALL-E:

```
/image a beautiful mountain landscape at sunset with a cabin
```

You'll be prompted to provide a filename for the generated image.

### Exit

End the conversation:

```
/exit
```

## Automatic Shell Command Execution

In both chat mode and single question mode, ChatGPT can automatically detect when a task requires shell commands. It will use a special format to indicate commands that should be executed:

```
<<SHELL: command_here>>
```

For example, if you ask:
```
Help me setup a basic Express.js project
```

ChatGPT might respond with:
```
I'll help you set up a basic Express.js project.

First, let's create a project directory:

<<SHELL: mkdir -p express-app>>

Now, let's navigate to that directory and initialize a new Node.js project:

<<SHELL: cd express-app && npm init -y>>

Next, install Express:

<<SHELL: cd express-app && npm install express>>

Let's create a basic server file:

<<SHELL: echo 'const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});' > express-app/index.js>>

Your Express app is ready! To start it:

<<SHELL: cd express-app && node index.js>>
```

These commands will be automatically executed and their output will be shown in the conversation.

## Tips for Effective Use

1. **Be specific** in your questions to get more accurate answers
2. **Share context** when asking about code or concepts
3. **Use file analysis** for complex code questions
4. **Save important conversations** for future reference
5. **Try different models** for different types of tasks:
   - `gpt-4-turbo` (default) for complex reasoning
   - `gpt-3.5-turbo` for faster, simpler responses
6. **Leverage shell access** for tasks requiring system interaction:
   - Creating and modifying files
   - Installing dependencies
   - Running diagnostics
   - Debugging environment issues
7. **Be careful with destructive commands** - review commands before they run
8. **Use interactive mode** (`-i` flag) for commands with user prompts