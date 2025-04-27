#!/usr/bin/env node

import { generateImage } from '../src/api-client.js';
import path from 'path';

const prompt = `Design a modern, appealing mascot called "CodeBot" for a CLI coding assistant tool. 
CodeBot is a sleek, modern robot with a humanoid shape but tech-inspired features. 
It has a polished silver chassis with blue light accents that glow when processing information.
CodeBot's eyes are friendly and expressive, and it wears a utility belt with programming gadgets.
The mascot should look approachable, helpful, and tech-savvy - perfect for representing a 
command-line tool that assists with coding, answers questions, and generates content.
Make it cartoon-style, cute but professional, with a command prompt icon visible somewhere in the design.`;

// The path where the image will be saved
const outputPath = path.resolve(process.cwd(), 'images', 'codebot_mascot.png');

console.log('Generating CodeBot mascot image...');
console.log('This may take a minute or two...');

// Generate the image
generateImage(prompt, outputPath)
  .then(success => {
    if (success) {
      console.log('Mascot generation complete!');
      console.log(`Image saved to: ${outputPath}`);
    } else {
      console.error('Failed to generate mascot image.');
    }
  })
  .catch(error => {
    console.error('Error:', error.message);
  });