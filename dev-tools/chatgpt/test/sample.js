/**
 * A simple test file for the ChatGPT CLI tool
 * 
 * This file demonstrates a basic JavaScript function that can be
 * analyzed using the ChatGPT CLI tool.
 */

function calculateFactorial(n) {
  if (n < 0) {
    throw new Error('Factorial is not defined for negative numbers');
  }
  
  if (n === 0 || n === 1) {
    return 1;
  }
  
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  
  return result;
}

// Example usage
console.log(calculateFactorial(5)); // Should output: 120