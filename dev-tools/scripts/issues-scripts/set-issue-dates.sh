#!/bin/bash

set_issue_dates() {
    local issue_number="$1"
    local start_date="$2"
    local end_date="$3"
    if [ -z "$issue_number" ] || [ -z "$start_date" ] || [ -z "$end_date" ]; then
        print_error "Issue number, start date, and end date are required."
        echo "Usage: $0 dates <issue-number> <start-date> <end-date>"
        return 1
    fi
    # Validate date format
    [[ "$start_date" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]] || { print_error "Start date must be YYYY-MM-DD."; return 1; }
    [[ "$end_date" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]] || { print_error "End date must be YYYY-MM-DD."; return 1; }
    # Update issue body "Due Dates" section
    local issue_body
    issue_body=$(gh issue view "$issue_number" --json body -q .body 2>/dev/null)
    if [[ "$issue_body" == *"## Due Dates"* ]]; then
        issue_body=$(echo "$issue_body" | sed -E "s/Start Date: .*/Start Date: $start_date/; s/End Date: .*/End Date: $end_date/")
    else
        issue_body="${issue_body}\n\n## Due Dates\n- Start Date: $start_date\n- End Date: $end_date"
    fi
    gh issue edit "$issue_number" --body "$issue_body" > /dev/null 2>&1
    # Ensure in project, get item ID
    local owner="${REPO_NAME%%/*}"
    local items_json item_id
    items_json=$(gh project item-list "$PROJECT_NUMBER" --owner "$owner" --format json --limit 1000 2>/dev/null)
    item_id=$(echo "$items_json" | grep -A5 "\"number\": $issue_number" | grep -o '"id": *"PVTI[^"]*' | sed -E 's/"id": *"([^"]*)"/\1/')
    if [ -z "$item_id" ]; then
        local add_out
        add_out=$(gh project item-add "$PROJECT_NUMBER" --owner "$owner" --url "https://github.com/$REPO_NAME/issues/$issue_number" --format json 2>/dev/null)
        item_id=$(echo "$add_out" | grep -o '"id":"PVTI[^"]*' | sed -E 's/"id":"([^"]*)/\1/')
    fi
    if [ -z "$item_id" ]; then
        print_error "Could not find or add issue #$issue_number in project."
        return 1
    fi
    # Update date fields in project
    gh project item-edit "$PROJECT_NUMBER" --owner "$owner" --id "$item_id" --project-id "$PROJECT_ID" --field-id "$START_DATE_FIELD_ID" --date "$start_date" > /dev/null 2>&1
    gh project item-edit "$PROJECT_NUMBER" --owner "$owner" --id "$item_id" --project-id "$PROJECT_ID" --field-id "$END_DATE_FIELD_ID" --date "$end_date" > /dev/null 2>&1
    if [ $? -ne 0 ]; then
        print_error "Failed to update dates for issue #$issue_number."
        return 1
    fi
    print_success "Issue #$issue_number dates updated: Start $start_date, End $end_date."
}

# List all issues and their status in the current project
