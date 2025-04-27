#!/bin/bash

# Source our color utilities for nice formatting
source "$(dirname "$0")/scripts/colors.sh"

# Quick script to check and fix a specific issue
issue_number="$1"

if [ -z "$issue_number" ]; then
  print_error "Please provide an issue number"
  echo "Usage: $0 <issue_number>"
  exit 1
fi

print_info "Checking issue #$issue_number..."

# Get the issue body
body=$(gh issue view $issue_number --json body -q '.body')
echo "$body" | grep -A1 "## Status"

print_info "Would you like to update the status? (y/n)"
read -r answer

if [ "$answer" = "y" ]; then
  print_info "Choose new status:"
  echo "1. Todo"
  echo "2. In Progress"
  echo "3. Done"
  read -r status_choice
  
  case $status_choice in
    1) new_status="Todo" ;;
    2) new_status="In Progress" ;;
    3) new_status="Done" ;;
    *) print_error "Invalid choice"; exit 1 ;;
  esac
  
  # Check if there's a proper "Current Status: X" line
  if echo "$body" | grep -q '## Status'; then
    if echo "$body" | grep -q 'Current Status:'; then
      # Replace the status
      new_body=$(echo "$body" | sed 's/Current Status: .*/Current Status: '"$new_status"'/')
    else
      # Add status line after ## Status
      new_body=$(echo "$body" | sed 's/## Status/## Status\nCurrent Status: '"$new_status"'/')
    fi
  else
    # Add status section at the end
    new_body="${body}\n\n## Status\nCurrent Status: $new_status"
  fi
  
  # Update the issue
  echo "$new_body" > /tmp/issue_update.txt
  gh issue edit $issue_number --body-file /tmp/issue_update.txt
  rm /tmp/issue_update.txt
  
  print_success "Issue #$issue_number updated with status '$new_status'"
else
  print_info "No changes made"
fi