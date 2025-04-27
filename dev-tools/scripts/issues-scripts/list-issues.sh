#!/bin/bash

list_issues() {
    # Default values
    local state="open"
    local limit=20
    local assignee=""
    local label=""
    
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case "$1" in
            -s|--state)
                state="$2"
                shift 2
                ;;
            -L|--limit)
                limit="$2"
                shift 2
                ;;
            -a|--assignee)
                assignee="$2"
                shift 2
                ;;
            -l|--label)
                label="$2"
                shift 2
                ;;
            *)
                # If not a flag, assume positional arguments in the order: state, limit, assignee, label
                if [[ -z "$state" || "$state" == "open" ]]; then
                    state="$1"
                elif [[ "$limit" -eq 20 ]]; then
                    if [[ "$1" =~ ^[0-9]+$ ]]; then
                        limit="$1"
                    fi
                elif [[ -z "$assignee" ]]; then
                    assignee="$1"
                elif [[ -z "$label" ]]; then
                    label="$1"
                fi
                shift
                ;;
        esac
    done
    
    print_info "Listing issues (state: $state, max: $limit${assignee:+, assignee: $assignee}${label:+, label: $label})"
    gh issue list -R "$REPO_NAME" -s "$state" -L "$limit" ${assignee:+-a "$assignee"} ${label:+-l "$label"}
}

# ============================================================