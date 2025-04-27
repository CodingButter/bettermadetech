#!/bin/bash

# CONFIGURATION MANAGEMENT
# ============================================================

# Set configuration paths
TEMP_DIR="$SCRIPT_DIR/.temp"
CONFIG_FILE="$TEMP_DIR/config.sh"

# Ensure temporary directory exists and update .gitignore
ensure_temp_dir() {
    if [ ! -d "$TEMP_DIR" ]; then
        mkdir -p "$TEMP_DIR"
        print_info "Created configuration directory: $TEMP_DIR"
    fi

    # Add .temp to .gitignore in repository root if possible
    local repo_root gitignore pattern
    repo_root="$(git rev-parse --show-toplevel 2>/dev/null)"
    if [ -n "$repo_root" ]; then
        gitignore="$repo_root/.gitignore"
        if [ "$SCRIPT_DIR" = "$repo_root" ]; then
            pattern=".temp"
        else
            local rel_dir
            rel_dir="${SCRIPT_DIR#$repo_root/}"
            pattern="$rel_dir/.temp"
        fi
        if [ -f "$gitignore" ]; then
            if ! grep -qxF "$pattern" "$gitignore"; then
                echo -e "\n# Dev Tools temp directory\n$pattern" >> "$gitignore"
                print_info "Added '$pattern' to .gitignore"
            fi
        else
            echo -e "# Dev Tools temp directory\n$pattern" > "$gitignore"
            print_info "Created .gitignore and added '$pattern'"
        fi
    fi
}

# Load configuration from file if it exists
load_config() {
    if [ -f "$CONFIG_FILE" ]; then
        print_info "Loading configuration from $CONFIG_FILE"
        # shellcheck disable=SC1090
        source "$CONFIG_FILE"
    fi
}

# Save current configuration to file
save_config() {
    ensure_temp_dir
    print_info "Saving configuration to $CONFIG_FILE"
    cat > "$CONFIG_FILE" << EOF
# BetterMadeTech Dev Tools Configuration
# Auto-generated on $(date)

# Repository Information
OWNER_NODE_ID="$OWNER_NODE_ID"
REPO_NAME="$REPO_NAME"

# Project Information
PROJECT_ID="$PROJECT_ID"
PROJECT_NUMBER="$PROJECT_NUMBER"
STATUS_FIELD_ID="$STATUS_FIELD_ID"
TODO_OPTION_ID="$TODO_OPTION_ID"
IN_PROGRESS_OPTION_ID="$IN_PROGRESS_OPTION_ID"
DONE_OPTION_ID="$DONE_OPTION_ID"
START_DATE_FIELD_ID="$START_DATE_FIELD_ID"
END_DATE_FIELD_ID="$END_DATE_FIELD_ID"
PRIORITY_FIELD_ID="$PRIORITY_FIELD_ID"

# Priority Option IDs
HIGH_PRIORITY_OPTION_ID="$HIGH_PRIORITY_OPTION_ID"
MEDIUM_PRIORITY_OPTION_ID="$MEDIUM_PRIORITY_OPTION_ID"
LOW_PRIORITY_OPTION_ID="$LOW_PRIORITY_OPTION_ID"

# Team Configuration
DEFAULT_ASSIGNEES="$DEFAULT_ASSIGNEES"
CODER_ASSIGNEE="$CODER_ASSIGNEE"
DESIGNER_ASSIGNEE="$DESIGNER_ASSIGNEE"
EOF
    print_success "Configuration saved."
}

# ============================================================