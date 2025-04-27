#!/bin/bash

list_project_issues() {
    local project_id="${PROJECT_ID}"
    if [ -z "$project_id" ]; then
        print_error "No project configured. Run 'setup' to configure a project."
        return 1
    fi
    print_info "Listing issues for project (ID: $PROJECT_ID)"
    local output
    output=$(gh project item-list "$PROJECT_NUMBER" --owner "${REPO_NAME%%/*}" --limit 1000 2>/dev/null)
    if [ -z "$output" ]; then
        print_warning "No items found or failed to fetch items for the project."
    fi
    printf "%-8s %-50s %-10s %-15s\n" "Issue #" "Title" "State" "Assignee"
    printf "%s\n" "-------------------------------------------------------------------------------"
    echo "$output" | sed -e '1{/TYPE TITLE NUMBER REPOSITORY ID/d}' | while IFS= read -r line; do
        local number title state assignee
        number=$(echo "$line" | awk '{print $(NF-2)}')
        title=$(echo "$line" | awk '{$(NF-3)=""; $(NF-2)=""; $(NF-1)=""; $NF=""; print}' | sed -E 's/^[[:space:]]+//; s/[[:space:]]+$//')
        state=$(gh issue view "$number" --json state -q .state 2>/dev/null)
        assignee=$(gh issue view "$number" --json assignees -q '.assignees[0].login' 2>/dev/null)
        [ -z "$assignee" ] && assignee="Unassigned"
        printf "%-8s %-50s %-10s %-15s\n" "#$number" "$title" "$state" "$assignee"
    done
}

# List repository issues (with optional filters)
