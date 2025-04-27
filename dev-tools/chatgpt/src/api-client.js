import OpenAI from "openai"
import fs from "fs-extra"
import chalk from "chalk"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"
import logger from "./logger.js"

// Get the directory where this file is located
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

// Load environment variables from the root directory
dotenv.config({ path: path.resolve(rootDir, '.env') })

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * Send a message to ChatGPT and get a response
 * @param {Array} messages - Array of message objects {role, content}
 * @param {String} model - The model to use
 */
export async function sendMessage(messages, model = "gpt-4-turbo") {
  try {
    // Log the API request
    logger.apiRequest(model, messages)
    
    const startTime = Date.now()
    const response = await openai.chat.completions.create({
      model: model,
      messages: messages,
      temperature: 0.7,
    })
    const latency = Date.now() - startTime
    
    // Log the API response
    logger.apiResponse('success', response.usage?.total_tokens, latency)
    
    return response.choices[0].message
  } catch (error) {
    // Log the error
    logger.error(`OpenAI API Error: ${error.message}`, {
      statusCode: error.response?.status,
      data: error.response?.data
    })
    
    console.error(chalk.red("Error communicating with OpenAI API:"), error.message)
    if (error.response) {
      console.error(chalk.red("Response status:"), error.response.status)
      console.error(chalk.red("Response data:"), error.response.data)
    }
    return null
  }
}

/**
 * Send a file to ChatGPT with a question
 * @param {String} filePath - Path to the file
 * @param {String} question - Question about the file
 * @param {String} model - The model to use
 */
export async function sendFileToGPT(filePath, question, model = "gpt-4-turbo") {
  try {
    // Check if file exists
    if (!(await fs.exists(filePath))) {
      console.error(chalk.red(`Error: File not found: ${filePath}`))
      return null
    }

    // Read file content
    const fileContent = await fs.readFile(filePath, "utf8")
    const fileName = filePath.split("/").pop()

    // Prepare messages
    const messages = [
      {
        role: "system",
        content:
          "You are a helpful assistant that analyzes files. Provide clear and concise explanations.",
      },
      {
        role: "user",
        content: `Here is the content of the file "${fileName}":\n\n${fileContent}\n\n${question}`,
      },
    ]

    return await sendMessage(messages, model)
  } catch (error) {
    console.error(chalk.red("Error processing file:"), error.message)
    return null
  }
}

/**
 * Handle image generation
 * @param {String} prompt - The image prompt
 * @param {String} outputPath - Where to save the image
 */
export async function generateImage(prompt, outputPath) {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    })

    const imageUrl = response.data[0].url

    // Download the image
    const imageResponse = await fetch(imageUrl)
    const blob = await imageResponse.blob()
    const buffer = Buffer.from(await blob.arrayBuffer())

    // Save the image
    await fs.writeFile(outputPath, buffer)
    console.log(chalk.green(`Image saved to ${outputPath}`))

    return true
  } catch (error) {
    console.error(chalk.red("Error generating image:"), error.message)
    return false
  }
}
