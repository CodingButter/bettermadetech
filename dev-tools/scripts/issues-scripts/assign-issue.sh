#!/bin/bash

assign_issue() {
    local issue_number="$1"
    local assignee="$2"
    if [ -z "$issue_number" ]; then
        print_error "Issue number is required for assignment."
        echo "Usage: $0 assign <issue-number> <assignee>"
        return 1
    fi
    if [ -z "$assignee" ]; then
        # Prompt for assignee if not provided
        echo -e "${BOLD}No assignee provided. Select an assignee:${RESET}"
        local assignees_list=()
        IFS=',' read -ra defaults <<< "$DEFAULT_ASSIGNEES"
        for a in "${defaults[@]}"; do [ -n "$a" ] && assignees_list+=("$a"); done
        if [ -n "$CODER_ASSIGNEE" ]; then assignees_list+=("$CODER_ASSIGNEE"); fi
        if [ -n "$DESIGNER_ASSIGNEE" ]; then assignees_list+=("$DESIGNER_ASSIGNEE"); fi
        assignees_list+=("none")
        PS3="Assignee: "
        select choice in "${assignees_list[@]}"; do
            if [ -z "$choice" ]; then
                print_error "Invalid selection."
                continue
            fi
            if [ "$choice" = "none" ]; then
                assignee=""
            else
                assignee="$choice"
            fi
            break
        done
    fi
    if [ -z "$assignee" ]; then
        # Remove all assignees if "none" selected
        gh issue edit "$issue_number" --remove-assignee "$(gh issue view "$issue_number" --json assignees -q '.assignees[].login')" > /dev/null 2>&1
        print_info "Issue #$issue_number left unassigned."
    else
        gh issue edit "$issue_number" --add-assignee "$assignee" > /dev/null 2>&1
        if [ $? -eq 0 ]; then
            print_success "Issue #$issue_number assigned to $assignee."
        else
            print_error "Failed to assign issue #$issue_number to $assignee."
            return 1
        fi
    fi
}

# Create a new issue with full details and add to project
