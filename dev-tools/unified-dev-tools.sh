#!/bin/bash
# Main entrypoint

# Source modules
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "$SCRIPT_DIR/scripts/colors.sh"
source "$SCRIPT_DIR/scripts/config.sh"
source "$SCRIPT_DIR/scripts/setup.sh"
source "$SCRIPT_DIR/scripts/issue-management.sh"
source "$SCRIPT_DIR/scripts/bulk-operations.sh"
source "$SCRIPT_DIR/scripts/issues-scripts/list-issues.sh"
source "$SCRIPT_DIR/scripts/help.sh"

# Main execution function
main() {
    ensure_temp_dir
    load_config
    
    case "${1:-help}" in
        setup | config)
            run_setup
            ;;
        create-project)
            create_github_project "$2"
            ;;
        status)
            update_issue_status "$2" "$3"
            ;;
        priority)
            set_issue_priority "$2" "$3"
            ;;
        dates)
            update_issue_dates "$2" "$3" "$4"
            ;;
        assign)
            if [[ "$2" =~ ^[0-9]+$ ]]; then
                assign_issue "$2" "$3"
            else
                bulk_assign "$2" "$3"
            fi
            ;;
        create)
            # Basic issue creation parameters
            local title="$2"
            local labels="$3"
            local milestone="$4"
            local assignee="$5"
            
            # Check if there are additional flags
            if [ $# -gt 5 ]; then
                # Forward all arguments to the specialized script
                "$SCRIPT_DIR/scripts/create_with_properties.sh" "$@"
            else
                # Standard issue creation without additional properties
                create_issue "$title" "$labels" "$milestone" "$assignee"
            fi
            ;;
        list)
            case "$2" in
                project)
                    list_project_issues
                    ;;
                issues | *)
                    # Pass all remaining arguments to list_issues
                    shift 2
                    list_issues "$@"
                    ;;
            esac
            ;;
        bulk)
            case "$2" in
                prioritize)
                    bulk_prioritize "$3"
                    ;;
                assign)
                    bulk_assign "$3" "$4"
                    ;;
                *)
                    print_error "Unknown bulk command: $2"
                    show_command_help bulk
                    exit 1
                    ;;
            esac
            ;;
        help | --help | -h)
            if [ -z "$2" ]; then
                show_help
            else
                show_command_help "$2"
            fi
            ;;
        *)
            print_error "Unknown command: $1"
            show_help
            exit 1
            ;;
    esac
}

# Execute main function with all arguments
main "$@"
