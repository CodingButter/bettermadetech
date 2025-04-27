#!/bin/bash

create_issue() {
    local title="$1"
    local labels="$2"
    local milestone="$3"
    local assignee="$4"
    
    # Validate required fields
    if [ -z "$title" ]; then
        print_error "Missing title for issue creation."
        echo "Usage: $0 create <title> [labels] [milestone] [assignee]"
        return 1
    fi
    
    # Determine assignee if not specified
    if [ -z "$assignee" ]; then
        if [[ "$title" =~ (UI|UX|design|visual|theme|color|3D|image|icon|logo|brand|layout|style|aesthetic|animation) ]]; then
            assignee="$DESIGNER_ASSIGNEE"
        else
            assignee="$CODER_ASSIGNEE"
        fi
    fi
    
    # Construct issue body with just the description
    local body="## Description
$title"
    
    print_info "Creating GitHub issue: $title"
    
    # Focus on the most basic functionality first
    local issue_url
    
    # Create the issue with minimal features
    issue_url=$(gh issue create --title "$title" --body "$body" -R "$REPO_NAME" 2>/dev/null)
    
    # If issue creation was successful
    if [ $? -eq 0 ] && [[ "$issue_url" =~ /issues/ ]]; then
        local issue_number
        issue_number=$(echo "$issue_url" | grep -o -E '/issues/[0-9]+' | sed 's#/issues/##')
        
        # Try to apply labels if provided (but don't fail if they don't exist)
        if [ -n "$labels" ]; then
            print_info "Trying to apply labels: $labels"
            gh issue edit "$issue_number" --add-label "$labels" -R "$REPO_NAME" > /dev/null 2>&1 || print_warning "Some labels may not exist and weren't applied"
        fi
        
        # Set assignee if provided
        if [ -n "$assignee" ]; then
            print_info "Assigning issue to: $assignee"
            gh issue edit "$issue_number" --add-assignee "$assignee" -R "$REPO_NAME" > /dev/null 2>&1 || print_warning "Could not assign to $assignee"
        fi
    fi
    
    if [ $? -ne 0 ] || [[ ! "$issue_url" =~ /issues/ ]]; then
        print_error "Failed to create issue. Please check your inputs and GitHub CLI authentication."
        return 1
    fi
    
    local issue_number
    issue_number=$(echo "$issue_url" | grep -o -E '/issues/[0-9]+' | sed 's#/issues/##')
    print_success "Issue #$issue_number created: $issue_url"
    
    if [ -n "$assignee" ]; then
        print_info "Assigned to $assignee."
    fi
    
    # Add to project if configured
    if [ -n "$PROJECT_NUMBER" ] && [ -n "$PROJECT_ID" ]; then
        local owner="${REPO_NAME%%/*}"
        print_info "Adding issue #$issue_number to project #$PROJECT_NUMBER"
        
        # Add to project
        gh project item-add "$PROJECT_NUMBER" --owner "$owner" --url "$issue_url" > /dev/null 2>&1
        
        if [ $? -eq 0 ]; then
            print_success "Issue #$issue_number added to project."
        else
            print_warning "Failed to add issue to project. Additional details may need to be set manually."
        fi
    fi
    
    # Output just the issue number so it can be captured by the caller
    echo "$issue_number"
    return 0
}

# Update the status of an issue (and ensure it's in the project)
