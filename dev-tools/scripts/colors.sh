#!/bin/bash
# Color utilities - WSL/Windows compatible

# Try to detect if we're in a Windows environment
if [[ "$(uname -r)" == *microsoft* ]] || [[ "$(uname -r)" == *Microsoft* ]]; then
  # We're in WSL - use special handling for Windows terminals
  RED=$(printf '\033[31m')
  GREEN=$(printf '\033[32m')
  YELLOW=$(printf '\033[33m')
  BLUE=$(printf '\033[34m')
  BOLD=$(printf '\033[1m')
  RESET=$(printf '\033[0m')
else
  # On Linux/Mac, use regular ANSI
  RED="\033[31m"
  GREEN="\033[32m"
  YELLOW="\033[33m"
  BLUE="\033[34m"
  BOLD="\033[1m"
  RESET="\033[0m"
fi

print_error()    { printf "${RED}ERROR:${RESET} %s\n" "$*"; }
print_warning()  { printf "${YELLOW}WARNING:${RESET} %s\n" "$*"; }
print_success()  { printf "${GREEN}%s${RESET}\n" "$*"; }
print_info()     { printf "${BLUE}%s${RESET}\n" "$*"; }
