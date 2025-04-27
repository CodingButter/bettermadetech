#!/bin/bash

# GITHUB SETUP AND AUTO-CONFIGURATION
# Main setup function to run the interactive setup
run_setup() {
    print_info "Running interactive setup..."
    auto_configure
    if [ $? -eq 0 ]; then
        print_success "Setup completed successfully!"
    else
        print_error "Setup failed. Please check the error messages above."
        return 1
    fi
}

# ============================================================

# Auto-detect repository and project details, prompt for missing info
auto_configure() {
    print_info "Auto-configuring development tools..."
    # Determine repository (owner/repo)
    if [ -z "$REPO_NAME" ]; then
        REPO_NAME=$(gh repo view --json name,owner -q '.owner.login + "/" + .name' 2>/dev/null)
    fi
    if [ -z "$REPO_NAME" ]; then
        print_error "Could not determine repository. Ensure you're in a GitHub repo directory or provide REPO_NAME."
        return 1
    fi
    print_info "Detected repository: $REPO_NAME"
    local owner="${REPO_NAME%%/*}"
    # Fetch owner node ID (for GraphQL if needed)
    OWNER_NODE_ID=$(gh api "users/$owner" -q '.node_id' 2>/dev/null)
    if [ -z "$OWNER_NODE_ID" ]; then
        print_warning "Could not fetch repository owner node ID (check GitHub CLI authentication)."
    fi

    # Prompt for default assignees if not set
    if [ -z "$DEFAULT_ASSIGNEES" ] || [ -z "$CODER_ASSIGNEE" ] || [ -z "$DESIGNER_ASSIGNEE" ]; then
        echo -e "${BOLD}Configure team assignees:${RESET}"
        read -rp "Enter default assignee(s) (comma-separated usernames) [${DEFAULT_ASSIGNEES:-none}]: " input_default
        if [ -n "$input_default" ]; then DEFAULT_ASSIGNEES="$input_default"; fi
        read -rp "Enter default coder assignee [${CODER_ASSIGNEE:-none}]: " input_coder
        if [ -n "$input_coder" ]; then CODER_ASSIGNEE="$input_coder"; fi
        read -rp "Enter default designer assignee [${DESIGNER_ASSIGNEE:-none}]: " input_designer
        if [ -n "$input_designer" ]; then DESIGNER_ASSIGNEE="$input_designer"; fi
    fi

    # List existing projects and prompt selection
    print_info "Fetching projects for owner: $owner"
    local projects_list projects_array
    projects_list=$(gh project list --owner "$owner" -L 30 2>/dev/null)
    if [ $? -ne 0 ]; then
        print_warning "Unable to fetch existing projects (no projects or insufficient permissions)."
        projects_list=""
    fi
    projects_list=$(echo "$projects_list" | sed -e '1{/^NUMBER TITLE STATE ID$/d}')
    IFS=$'\n' read -r -d '' -a projects_array <<< "$projects_list"
    local project_options=()
    local project_numbers=()
    local project_ids=()
    for line in "${projects_array[@]}"; do
        [ -z "$line" ] && continue
        local num state id title
        num=$(echo "$line" | awk '{print $1}')
        id=$(echo "$line" | awk '{print $NF}')
        state=$(echo "$line" | awk '{print $(NF-1)}')
        title=$(echo "$line" | sed -E 's/^[0-9]+[[:space:]]+//; s/[[:space:]]+[A-Za-z]+[[:space:]]+PVT_[A-Za-z0-9]+$//')
        project_options+=("#$num: $title [$state]")
        project_numbers+=("$num")
        project_ids+=("$id")
    done
    project_options+=("Create a new project")
    echo -e "${BOLD}Select a project:${RESET}"
    PS3="Enter your choice: "
    select opt in "${project_options[@]}"; do
        if [ -z "$opt" ]; then
            print_error "Invalid selection. Enter a number from 1-${#project_options[@]}."
            continue
        fi
        if [[ "$opt" == "Create a new project" ]]; then
            read -rp "Enter a title for the new GitHub Project: " new_title
            if [ -z "$new_title" ]; then
                print_error "Project title cannot be empty."
                return 1
            fi
            create_project "$new_title" "$owner" || return 1
            break
        else
            local idx=$((REPLY-1))
            PROJECT_NUMBER="${project_numbers[$idx]}"
            PROJECT_ID="${project_ids[$idx]}"
            print_info "Using existing project: $opt"
            # Fetch and store field IDs for this project
            fetch_project_fields "$owner" "$PROJECT_NUMBER" || return 1
            save_config
            break
        fi
    done
    print_success "Auto-configuration complete."
}

# Create a new GitHub project and set it up with required fields
create_project() {
    local title="$1"
    local owner="$2"
    if [ -z "$title" ]; then
        print_error "Project title is required."
        return 1
    fi
    [ -z "$owner" ] && owner="${REPO_NAME%%/*}"
    print_info "Creating project '$title' for owner '$owner'..."
    local project_json
    project_json=$(gh project create --owner "$owner" --title "$title" --format json 2>/dev/null)
    if [ $? -ne 0 ] || [ -z "$project_json" ]; then
        print_error "Failed to create project. Ensure you have permissions and try again."
        return 1
    fi
    # Parse project ID and number from JSON
    PROJECT_ID=$(echo "$project_json" | grep -o '"id":"PVT[^"]*' | sed -E 's/"id":"([^"]*)/\1/')
    PROJECT_NUMBER=$(echo "$project_json" | grep -o '"number":[0-9]*' | sed -E 's/"number":([0-9]*)/\1/')
    if [ -z "$PROJECT_ID" ] || [ -z "$PROJECT_NUMBER" ]; then
        print_error "Unexpected response from project creation (missing ID/number)."
        return 1
    fi
    print_info "Project created (Number: $PROJECT_NUMBER, ID: $PROJECT_ID). Setting up fields..."
    # Create required fields
    gh project field-create "$PROJECT_NUMBER" --owner "$owner" --name "Status" --data-type SINGLE_SELECT --single-select-options "Todo,In Progress,Done" --format json > /dev/null 2>&1
    gh project field-create "$PROJECT_NUMBER" --owner "$owner" --name "Priority" --data-type SINGLE_SELECT --single-select-options "High,Medium,Low" --format json > /dev/null 2>&1
    gh project field-create "$PROJECT_NUMBER" --owner "$owner" --name "Start Date" --data-type DATE --format json > /dev/null 2>&1
    gh project field-create "$PROJECT_NUMBER" --owner "$owner" --name "End Date" --data-type DATE --format json > /dev/null 2>&1
    # Fetch field and option IDs for the new project
    fetch_project_fields "$owner" "$PROJECT_NUMBER" || return 1
    # Link project to current repository (for GitHub UI convenience)
    gh project link "$PROJECT_NUMBER" --owner "$owner" --repo "${REPO_NAME#*/}" > /dev/null 2>&1
    print_info "Linked project #$PROJECT_NUMBER to repository $REPO_NAME."
    save_config
    print_success "Project '$title' created and configured successfully."
}

# Fetch field IDs and option IDs for a given project number
fetch_project_fields() {
    local owner_login="$1"
    local proj_number="$2"
    if [ -z "$owner_login" ] || [ -z "$proj_number" ]; then
        print_error "Owner login and project number are required to fetch fields."
        return 1
    fi
    local fields_json
    fields_json=$(gh project field-list "$proj_number" --owner "$owner_login" --format json 2>/dev/null)
    if [ $? -ne 0 ] || [ -z "$fields_json" ]; then
        print_error "Failed to retrieve fields for project $proj_number. Check your access."
        return 1
    fi
    # Extract field IDs by name
    STATUS_FIELD_ID=$(echo "$fields_json" | grep -o -P '"name": ?"Status".+?"id": ?"[^"]+"' | sed -E 's/.*"id": ?"([^"]+)".*/\1/')
    PRIORITY_FIELD_ID=$(echo "$fields_json" | grep -o -P '"name": ?"Priority".+?"id": ?"[^"]+"' | sed -E 's/.*"id": ?"([^"]+)".*/\1/')
    START_DATE_FIELD_ID=$(echo "$fields_json" | grep -o -P '"name": ?"Start Date".+?"id": ?"[^"]+"' | sed -E 's/.*"id": ?"([^"]+)".*/\1/')
    END_DATE_FIELD_ID=$(echo "$fields_json" | grep -o -P '"name": ?"End Date".+?"id": ?"[^"]+"' | sed -E 's/.*"id": ?"([^"]+)".*/\1/')
    # Extract option IDs for select fields
    TODO_OPTION_ID=$(echo "$fields_json" | grep -o -P '"name": ?"Todo".+?"id": ?"[^"]+"' | sed -E 's/.*"id": ?"([^"]+)".*/\1/')
    IN_PROGRESS_OPTION_ID=$(echo "$fields_json" | grep -o -P '"name": ?"In Progress".+?"id": ?"[^"]+"' | sed -E 's/.*"id": ?"([^"]+)".*/\1/')
    DONE_OPTION_ID=$(echo "$fields_json" | grep -o -P '"name": ?"Done".+?"id": ?"[^"]+"' | sed -E 's/.*"id": ?"([^"]+)".*/\1/')
    HIGH_PRIORITY_OPTION_ID=$(echo "$fields_json" | grep -o -P '"name": ?"High".+?"id": ?"[^"]+"' | sed -E 's/.*"id": ?"([^"]+)".*/\1/')
    MEDIUM_PRIORITY_OPTION_ID=$(echo "$fields_json" | grep -o -P '"name": ?"Medium".+?"id": ?"[^"]+"' | sed -E 's/.*"id": ?"([^"]+)".*/\1/')
    LOW_PRIORITY_OPTION_ID=$(echo "$fields_json" | grep -o -P '"name": ?"Low".+?"id": ?"[^"]+"' | sed -E 's/.*"id": ?"([^"]+)".*/\1/')
    return 0
}

# Main setup function to run the interactive setup
run_setup() {
    print_info "Running interactive setup..."
    auto_configure
    if [ $? -eq 0 ]; then
        print_success "Setup completed successfully!"
    else
        print_error "Setup failed. Please check the error messages above."
        return 1
    fi
}

# ============================================================