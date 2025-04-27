#!/bin/bash

# Script to update start and end dates for GitHub issues in the project

PROJECT_ID="PVT_kwHOAJyrsc4A3qvE"
START_DATE_FIELD_ID="PVTF_lAHOAJyrsc4A3qvEzgsxCDA"
END_DATE_FIELD_ID="PVTF_lAHOAJyrsc4A3qvEzgsxCDE"

# Function to update a date field for an item
update_date_field() {
    local project_id="$1"
    local item_id="$2"
    local field_id="$3"
    local date="$4"
    
    echo "Updating item $item_id field $field_id to date $date"
    
    response=$(gh api graphql -f query='
      mutation {
        updateProjectV2ItemFieldValue(
          input: {
            projectId: "'"$project_id"'",
            itemId: "'"$item_id"'",
            fieldId: "'"$field_id"'",
            value: { 
              date: "'"$date"'" 
            }
          }
        ) {
          projectV2Item {
            id
          }
        }
      }')
    
    echo "Response: $response"
    echo "Date updated successfully"
}

# Update both start and end dates for an issue
update_issue_dates() {
    local item_id="$1"
    local start_date="$2"
    local end_date="$3"
    
    update_date_field "$PROJECT_ID" "$item_id" "$START_DATE_FIELD_ID" "$start_date"
    update_date_field "$PROJECT_ID" "$item_id" "$END_DATE_FIELD_ID" "$end_date"
}

echo "Updating issue dates in the project..."

# Completed tasks (April 23-27, 2025)
update_issue_dates "PVTI_lAHOAJyrsc4A3qvEzgZxXr4" "2025-04-24" "2025-04-24" # Issue 1: Create basic structure for packages/spinner
update_issue_dates "PVTI_lAHOAJyrsc4A3qvEzgZxXr0" "2025-04-24" "2025-04-24" # Issue 2: Create SpinnerBase abstract class
update_issue_dates "PVTI_lAHOAJyrsc4A3qvEzgZxXrw" "2025-04-25" "2025-04-25" # Issue 3: Migrate spinner components to packages/spinner
update_issue_dates "PVTI_lAHOAJyrsc4A3qvEzgZxXrs" "2025-04-25" "2025-04-25" # Issue 4: WebSpinnerClient for web application
update_issue_dates "PVTI_lAHOAJyrsc4A3qvEzgZxXro" "2025-04-25" "2025-04-25" # Issue 5: DocsSpinnerClient for documentation site
update_issue_dates "PVTI_lAHOAJyrsc4A3qvEzgZxXrk" "2025-04-25" "2025-04-25" # Issue 6: ExtensionSpinnerClient for Chrome extension
update_issue_dates "PVTI_lAHOAJyrsc4A3qvEzgZxXrg" "2025-04-26" "2025-04-26" # Issue 7: Create test suite and integration tests for spinner package
update_issue_dates "PVTI_lAHOAJyrsc4A3qvEzgZxXrc" "2025-04-26" "2025-04-26" # Issue 8: Documentation and cleanup for spinner refactor
update_issue_dates "PVTI_lAHOAJyrsc4A3qvEzgZxaQ4" "2025-04-26" "2025-04-26" # Issue 9: Improve spinner package documentation
update_issue_dates "PVTI_lAHOAJyrsc4A3qvEzgZxaRs" "2025-04-26" "2025-04-26" # Issue 10: Optimize spinner package performance
update_issue_dates "PVTI_lAHOAJyrsc4A3qvEzgZxc0o" "2025-04-27" "2025-04-27" # Issue 12: Set up Fumadocs-based documentation site
update_issue_dates "PVTI_lAHOAJyrsc4A3qvEzgZxc1I" "2025-04-27" "2025-04-27" # Issue 13: Create spinner package documentation
update_issue_dates "PVTI_lAHOAJyrsc4A3qvEzgZxc1g" "2025-04-27" "2025-04-27" # Issue 14: Create migration guide for spinner refactor
update_issue_dates "PVTI_lAHOAJyrsc4A3qvEzgZxg0Q" "2025-04-27" "2025-04-27" # Issue 16: Modern landing page for documentation site
update_issue_dates "PVTI_lAHOAJyrsc4A3qvEzgZxhVs" "2025-04-27" "2025-04-27" # Issue 17: Add favicon and metadata to docs site
update_issue_dates "PVTI_lAHOAJyrsc4A3qvEzgZxiA8" "2025-04-27" "2025-04-27" # Issue 18: Fix TypeScript errors in @repo/spinner package
update_issue_dates "PVTI_lAHOAJyrsc4A3qvEzgZxiBU" "2025-04-27" "2025-04-27" # Issue 19: Fix dynamic import in web app
update_issue_dates "PVTI_lAHOAJyrsc4A3qvEzgZxiCI" "2025-04-27" "2025-04-27" # Issue 20: Fix ESLint error in docs app
update_issue_dates "PVTI_lAHOAJyrsc4A3qvEzgZxiCs" "2025-04-27" "2025-04-27" # Issue 21: Fix TypeScript error in extension Options.tsx
update_issue_dates "PVTI_lAHOAJyrsc4A3qvEzgZxjGE" "2025-04-27" "2025-04-27" # Issue 23: Fix extension build process

# Current tasks (April 30-May 12, 2025)
update_issue_dates "PVTI_lAHOAJyrsc4A3qvEzgZxjvY" "2025-04-30" "2025-05-01" # Issue 25: Shared Components Setup for Extension
update_issue_dates "PVTI_lAHOAJyrsc4A3qvEzgZxjv8" "2025-05-01" "2025-05-02" # Issue 26: Chrome Extension Foundation Setup
update_issue_dates "PVTI_lAHOAJyrsc4A3qvEzgZxjwU" "2025-05-02" "2025-05-03" # Issue 27: Extension Local Storage Integration
update_issue_dates "PVTI_lAHOAJyrsc4A3qvEzgZxjxM" "2025-05-05" "2025-05-05" # Issue 28: Spinner Basic Functionality
update_issue_dates "PVTI_lAHOAJyrsc4A3qvEzgZxjx4" "2025-05-06" "2025-05-08" # Issue 29: CSV Upload and Parsing
update_issue_dates "PVTI_lAHOAJyrsc4A3qvEzgZxaSc" "2025-05-08" "2025-05-10" # Issue 11: Improve spinner accessibility
update_issue_dates "PVTI_lAHOAJyrsc4A3qvEzgZxc2o" "2025-05-10" "2025-05-12" # Issue 15: Clean up unused code from previous spinner implementation

# Upcoming tasks (May 13-May 31, 2025)
update_issue_dates "PVTI_lAHOAJyrsc4A3qvEzgZxjyU" "2025-05-13" "2025-05-13" # Issue 30: Directus Setup Preparation
update_issue_dates "PVTI_lAHOAJyrsc4A3qvEzgZxjy8" "2025-05-14" "2025-05-15" # Issue 31: Directus Setup Implementation
update_issue_dates "PVTI_lAHOAJyrsc4A3qvEzgZxjzc" "2025-05-16" "2025-05-17" # Issue 32: Settings Page Integration with Directus
update_issue_dates "PVTI_lAHOAJyrsc4A3qvEzgZxj0w" "2025-05-18" "2025-05-19" # Issue 33: Integration Testing
update_issue_dates "PVTI_lAHOAJyrsc4A3qvEzgZxj1E" "2025-05-20" "2025-05-20" # Issue 34: Landing Page Creation
update_issue_dates "PVTI_lAHOAJyrsc4A3qvEzgZxj1Y" "2025-05-23" "2025-05-24" # Issue 35: Spinner UI Enhancement
update_issue_dates "PVTI_lAHOAJyrsc4A3qvEzgZxj18" "2025-05-25" "2025-05-26" # Issue 36: Chrome Extension Side Panel Optimization
update_issue_dates "PVTI_lAHOAJyrsc4A3qvEzgZxj2U" "2025-05-27" "2025-05-27" # Issue 37: User Experience Improvements
update_issue_dates "PVTI_lAHOAJyrsc4A3qvEzgZxj2w" "2025-05-28" "2025-05-29" # Issue 38: Comprehensive Testing
update_issue_dates "PVTI_lAHOAJyrsc4A3qvEzgZxj3I" "2025-05-30" "2025-05-30" # Issue 39: Chrome Web Store Preparation
update_issue_dates "PVTI_lAHOAJyrsc4A3qvEzgZxj3w" "2025-05-31" "2025-05-31" # Issue 40: Website Finalization & Launch

# Test issue
update_issue_dates "PVTI_lAHOAJyrsc4A3qvEzgZxieY" "2025-04-27" "2025-04-27" # Issue 22: Test issue for status workflow

echo "All issue dates have been updated."