#!/bin/bash

# Script to create new GitHub issues with start and end dates

# Constants
PROJECT_ID="PVT_kwHOAJyrsc4A3qvE"
START_DATE_FIELD_ID="PVTF_lAHOAJyrsc4A3qvEzgsxCDA"
END_DATE_FIELD_ID="PVTF_lAHOAJyrsc4A3qvEzgsxCDE"
TODO_OPTION_ID="f75ad846"

# Function to create a new issue with dates
create_issue_with_dates() {
    local title="$1"
    local body="$2"
    local label="$3"
    local start_date="$4"
    local end_date="$5"
    
    echo "Creating issue: $title"
    
    # Create the issue
    issue_response=$(gh issue create --title "$title" --body "$body" --label "$label")
    issue_number=$(echo "$issue_response" | grep -o '[0-9]*$')
    
    echo "Issue #$issue_number created: $issue_response"
    
    # Get the issue node ID
    issue_info=$(gh api repos/CodingButter/bettermadetech/issues/$issue_number)
    issue_node_id=$(echo "$issue_info" | grep -o '"node_id":"[^"]*"' | grep -o 'I_[^"]*' | head -1)
    
    echo "Issue node ID: $issue_node_id"
    
    # Add issue to project
    response=$(gh api graphql -f query='
      mutation {
        addProjectV2ItemById(
          input: {
            projectId: "'"$PROJECT_ID"'",
            contentId: "'"$issue_node_id"'"
          }
        ) {
          item {
            id
          }
        }
      }')
    
    echo "Response: $response"
    
    # Extract item ID manually
    item_id=$(echo "$response" | grep -o '"id":"PVTI_[^"]*"' | grep -o 'PVTI_[^"]*' | head -1)
    
    echo "Issue #$issue_number added to project with item ID: $item_id"
    
    # Set status to Todo
    status_response=$(gh api graphql -f query='
      mutation {
        updateProjectV2ItemFieldValue(
          input: {
            projectId: "'"$PROJECT_ID"'",
            itemId: "'"$item_id"'",
            fieldId: "PVTSSF_lAHOAJyrsc4A3qvEzgsxB-0",
            value: { 
              singleSelectOptionId: "'"$TODO_OPTION_ID"'" 
            }
          }
        ) {
          projectV2Item {
            id
          }
        }
      }')
    
    echo "Status response: $status_response"
    
    # Set start date
    start_date_response=$(gh api graphql -f query='
      mutation {
        updateProjectV2ItemFieldValue(
          input: {
            projectId: "'"$PROJECT_ID"'",
            itemId: "'"$item_id"'",
            fieldId: "'"$START_DATE_FIELD_ID"'",
            value: { 
              date: "'"$start_date"'" 
            }
          }
        ) {
          projectV2Item {
            id
          }
        }
      }')
    
    echo "Start date response: $start_date_response"
    
    # Set end date
    end_date_response=$(gh api graphql -f query='
      mutation {
        updateProjectV2ItemFieldValue(
          input: {
            projectId: "'"$PROJECT_ID"'",
            itemId: "'"$item_id"'",
            fieldId: "'"$END_DATE_FIELD_ID"'",
            value: { 
              date: "'"$end_date"'" 
            }
          }
        ) {
          projectV2Item {
            id
          }
        }
      }')
    
    echo "End date response: $end_date_response"
    
    echo "Issue #$issue_number created with start date $start_date and end date $end_date"
}

# Usage example
if [ $# -lt 5 ]; then
    echo "Usage: $0 \"Issue Title\" \"Issue Body\" \"Label\" \"Start Date (YYYY-MM-DD)\" \"End Date (YYYY-MM-DD)\""
    echo "Example: $0 \"Implement Login Feature\" \"We need to implement a secure login feature\" \"enhancement\" \"2025-06-01\" \"2025-06-07\""
    exit 1
fi

create_issue_with_dates "$1" "$2" "$3" "$4" "$5"