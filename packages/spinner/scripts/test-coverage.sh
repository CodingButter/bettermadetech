#!/bin/bash

# Test coverage script for spinner package
# Runs all tests and generates a coverage report

# Make sure script fails on any error
set -e

echo "Running all spinner package tests with coverage..."

# Run Jest with coverage
npx jest --coverage

# Output summary of coverage results
echo ""
echo "======================="
echo "Test Coverage Summary"
echo "======================="
echo "Check the coverage report for detailed information."
echo "Report location: ./coverage/lcov-report/index.html"

# Check for minimum coverage threshold (80%)
COVERAGE=$(cat coverage/coverage-summary.json | grep -o '"pct": [0-9]*\.[0-9]*' | head -1 | grep -o '[0-9]*\.[0-9]*')
COVERAGE_INT=${COVERAGE%.*}

echo "Total coverage: $COVERAGE%"

if [ "$COVERAGE_INT" -lt 80 ]; then
  echo "❌ Coverage is below 80%. Please add more tests."
  exit 1
else
  echo "✅ Coverage is above 80%. Good job!"
fi