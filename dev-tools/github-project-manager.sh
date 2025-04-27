#!/bin/bash

# GitHub Project Manager Script
# This script helps manage GitHub projects, issues, and statuses

# Constants
OWNER_NODE_ID="MDQ6VXNlcjEwMjY3NTY5"
REPO_NAME="CodingButter/bettermadetech"

# BetterMadeTech Project Constants
PROJECT_ID="PVT_kwHOAJyrsc4A3qvE"
STATUS_FIELD_ID="PVTSSF_lAHOAJyrsc4A3qvEzgsxB-0"
TODO_OPTION_ID="f75ad846"
IN_PROGRESS_OPTION_ID="47fc9ee4"
DONE_OPTION_ID="98236657"

# Create a new project
create_project() {
    local title="$1"
    
    echo "Creating project: $title"
    
    response=$(gh api graphql -f query='
      mutation {
        createProjectV2(
          input: {
            ownerId: "'"$OWNER_NODE_ID"'",
            title: "'"$title"'"
          }
        ) {
          projectV2 {
            id
            url
          }
        }
      }')
    
    echo "Response: $response"
    
    # Manual extraction of project ID and URL (without jq)
    project_id=$(echo "$response" | grep -o '"id":"[^"]*"' | grep -o 'PVT_[^"]*' | head -1)
    project_url=$(echo "$response" | grep -o '"url":"[^"]*"' | grep -o 'https://[^"]*' | head -1)
    
    echo "Project created with ID: $project_id"
    echo "Project URL: $project_url"
    
    # Return the project ID
    echo "$project_id"
}

# Add a Status field to a project
add_status_field() {
    local project_id="$1"
    
    echo "Adding Status field to project $project_id"
    
    response=$(gh api graphql -f query='
      mutation {
        createProjectV2Field(
          input: {
            projectId: "'"$project_id"'",
            dataType: SINGLE_SELECT,
            name: "Status",
            singleSelectOptions: [
              { name: "Todo", description: "Not started", color: BLUE },
              { name: "In Progress", description: "Work has begun", color: YELLOW },
              { name: "Done", description: "Completed", color: GREEN }
            ]
          }
        ) {
          projectV2Field {
            ... on ProjectV2SingleSelectField {
              id
              name
              options {
                name
                id
              }
            }
          }
        }
      }')
    
    echo "Response: $response"
    
    # Manual extraction of field ID and option IDs (without jq)
    field_id=$(echo "$response" | grep -o '"id":"PVTSSF_[^"]*"' | grep -o 'PVTSSF_[^"]*' | head -1)
    
    echo "Status field created with ID: $field_id"
    
    # Extract option IDs
    todo_pattern='"name":"Todo"[^}]*"id":"([^"]*)"'
    in_progress_pattern='"name":"In Progress"[^}]*"id":"([^"]*)"'
    done_pattern='"name":"Done"[^}]*"id":"([^"]*)"'
    
    if [[ $response =~ $todo_pattern ]]; then
        todo_id="${BASH_REMATCH[1]}"
    fi
    
    if [[ $response =~ $in_progress_pattern ]]; then
        in_progress_id="${BASH_REMATCH[1]}"
    fi
    
    if [[ $response =~ $done_pattern ]]; then
        done_id="${BASH_REMATCH[1]}"
    fi
    
    echo "Todo ID: $todo_id"
    echo "In Progress ID: $in_progress_id"
    echo "Done ID: $done_id"
    
    # Return field ID and option IDs as a comma-separated string
    echo "$field_id,$todo_id,$in_progress_id,$done_id"
}

# Add an issue to a project
add_issue_to_project() {
    local project_id="$1"
    local issue_number="$2"
    local default_status="${3:-todo}"  # Default to "todo" if not specified
    
    echo "Adding issue #$issue_number to project $project_id"
    
    # First get the issue node ID
    issue_response=$(gh api repos/$REPO_NAME/issues/$issue_number)
    issue_node_id=$(echo "$issue_response" | grep -o '"node_id":"[^"]*"' | grep -o 'I_[^"]*' | head -1)
    
    echo "Issue node ID: $issue_node_id"
    
    # Add issue to project
    response=$(gh api graphql -f query='
      mutation {
        addProjectV2ItemById(
          input: {
            projectId: "'"$project_id"'",
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
    
    # Set default status
    if [ "$project_id" = "$PROJECT_ID" ]; then
        # Get option ID based on status
        local option_id
        case "$default_status" in
            todo)
                option_id="$TODO_OPTION_ID"
                ;;
            in-progress)
                option_id="$IN_PROGRESS_OPTION_ID"
                ;;
            done)
                option_id="$DONE_OPTION_ID"
                ;;
            *)
                option_id="$TODO_OPTION_ID"  # Default to Todo
                ;;
        esac
        
        # Update status
        update_issue_status "$PROJECT_ID" "$item_id" "$STATUS_FIELD_ID" "$option_id"
        echo "Issue #$issue_number status set to $default_status"
    fi
    
    # Return the item ID
    echo "$item_id"
}

# Update an issue's status in a project
update_issue_status() {
    local project_id="$1"
    local item_id="$2"
    local field_id="$3"
    local option_id="$4"
    
    echo "Updating item $item_id status to option $option_id"
    
    response=$(gh api graphql -f query='
      mutation {
        updateProjectV2ItemFieldValue(
          input: {
            projectId: "'"$project_id"'",
            itemId: "'"$item_id"'",
            fieldId: "'"$field_id"'",
            value: { 
              singleSelectOptionId: "'"$option_id"'" 
            }
          }
        ) {
          projectV2Item {
            id
          }
        }
      }')
    
    echo "Response: $response"
    echo "Status updated successfully"
}

# List all issues and their status in a project
list_project_issues() {
    local project_id="$1"
    
    echo "Listing issues for project $project_id"
    
    response=$(gh api graphql -f query='
      query {
        node(id: "'"$project_id"'") {
          ... on ProjectV2 {
            items(first: 100) {
              nodes {
                id
                fieldValues(first: 10) {
                  nodes {
                    ... on ProjectV2ItemFieldSingleSelectValue {
                      name
                      field {
                        ... on ProjectV2SingleSelectField {
                          name
                        }
                      }
                    }
                  }
                }
                content {
                  ... on Issue {
                    number
                    title
                    state
                  }
                }
              }
            }
          }
        }
      }')
    
    echo "Response: $response"
    echo "Please examine the response to see issues and their statuses"
}

# Get issue item ID in BetterMadeTech project
get_issue_item_id() {
    local issue_number="$1"
    local default_status="${2:-todo}"  # Default to "todo" if not specified
    
    echo "Getting item ID for issue #$issue_number in BetterMadeTech project"
    
    response=$(gh api graphql -f query='
      query {
        node(id: "'"$PROJECT_ID"'") {
          ... on ProjectV2 {
            items(first: 100) {
              nodes {
                id
                content {
                  ... on Issue {
                    number
                  }
                }
              }
            }
          }
        }
      }')
    
    echo "Response: $response"
    
    # Look for the item with the matching issue number
    pattern='"number":'"$issue_number"'[^}]*}'
    if [[ $response =~ $pattern ]]; then
        # Extract the item ID from the matched pattern
        item_pattern='"id":"(PVTI_[^"]*)"'
        if [[ ${BASH_REMATCH[0]} =~ $item_pattern ]]; then
            item_id="${BASH_REMATCH[1]}"
            echo "Found item ID: $item_id for issue #$issue_number"
            echo "$item_id"
            return 0
        fi
    fi
    
    echo "Issue #$issue_number not found in project, adding it now..."
    
    # If not found, add it to the project
    item_id=$(add_issue_to_project "$PROJECT_ID" "$issue_number" "$default_status")
    echo "$item_id"
}

# Set issue status in BetterMadeTech project
set_issue_status() {
    local issue_number="$1"
    local status="$2"  # "todo", "in-progress", "done", or "archived"
    
    # Convert status string to option ID
    local option_id
    case "$status" in
        todo)
            option_id="$TODO_OPTION_ID"
            ;;
        in-progress)
            option_id="$IN_PROGRESS_OPTION_ID"
            ;;
        done)
            option_id="$DONE_OPTION_ID"
            ;;
        archived)
            # For now, using DONE_OPTION_ID since we don't have an archived ID defined
            # You may want to add a proper ARCHIVED_OPTION_ID constant
            option_id="$DONE_OPTION_ID"
            ;;
        *)
            echo "Invalid status: $status. Use 'todo', 'in-progress', 'done', or 'archived'"
            return 1
            ;;
    esac
    
    # Get item ID for the issue, passing the status in case the issue needs to be added
    item_id=$(get_issue_item_id "$issue_number" "$status")
    if [ -z "$item_id" ]; then
        echo "Failed to get item ID for issue #$issue_number"
        return 1
    fi
    
    # Update status
    update_issue_status "$PROJECT_ID" "$item_id" "$STATUS_FIELD_ID" "$option_id"
    echo "Issue #$issue_number status set to $status"
}

# Main execution logic
main() {
    case "$1" in
        create-project)
            create_project "$2"
            ;;
        add-status-field)
            add_status_field "$2"
            ;;
        add-issue)
            if [ -z "$3" ]; then
                # Use BetterMadeTech project by default with 'todo' status
                add_issue_to_project "$PROJECT_ID" "$2" "todo"
            elif [ -z "$4" ]; then
                # Use BetterMadeTech project with provided status
                add_issue_to_project "$PROJECT_ID" "$2" "$3"
            else
                # Custom project and issue number (status as 4th param)
                add_issue_to_project "$2" "$3" "$4"
            fi
            ;;
        update-status)
            update_issue_status "$2" "$3" "$4" "$5"
            ;;
        list-issues)
            list_project_issues "$2"
            ;;
        set-status)
            # Usage: set-status <issue-number> <status>
            set_issue_status "$2" "$3"
            ;;
        list-bettertech-issues)
            list_project_issues "$PROJECT_ID"
            ;;
        setup)
            echo "Setting up a new project with issues..."
            project_id=$(create_project "$2")
            field_info=$(add_status_field "$project_id")
            
            # Parse field_info
            IFS=',' read -r field_id todo_id in_progress_id done_id <<< "$field_info"
            
            # Add issues to project
            shift 2
            for issue_number in "$@"; do
                item_id=$(add_issue_to_project "$project_id" "$issue_number")
                # Default status is Todo
                update_issue_status "$project_id" "$item_id" "$field_id" "$todo_id"
            done
            
            echo "Project setup complete."
            echo "Project ID: $project_id"
            echo "Status Field ID: $field_id"
            echo "Todo Option ID: $todo_id"
            echo "In Progress Option ID: $in_progress_id"
            echo "Done Option ID: $done_id"
            ;;
        *)
            echo "Usage: $0 [command] [options]"
            echo "Commands:"
            echo "  set-status <issue-number> <status>         Set issue status (todo, in-progress, done, archived)"
            echo "  list-bettertech-issues                     List all issues in BetterMadeTech project"
            echo "  add-issue <issue-number> [status]          Add issue to BetterMadeTech project with optional status (defaults to todo)"
            echo ""
            echo "Advanced commands:"
            echo "  create-project <title>                     Create a new project"
            echo "  add-status-field <project-id>              Add Status field to project"
            echo "  update-status <project-id> <item-id> <field-id> <option-id>  Update issue status"
            echo "  list-issues <project-id>                   List all issues in project"
            echo "  setup <project-title> <issue-numbers...>   Setup a full project with issues"
            exit 1
            ;;
    esac
}

# Run the main function with all arguments
main "$@"