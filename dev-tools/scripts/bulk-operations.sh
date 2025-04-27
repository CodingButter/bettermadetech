#!/bin/bash

# BULK OPERATIONS
# ============================================================

# Bulk assign issues based on mode
bulk_assign() {
    local mode="$1"
    local target_user="$2"
    local owner="${REPO_NAME%%/*}"
    case "$mode" in
        auto)
            print_info "Auto-assigning issues to coder/designer based on content..."
            local issues_json
            issues_json=$(gh issue list -R "$REPO_NAME" -s open -L 100 --json number,title 2>/dev/null)
            if [ -z "$issues_json" ]; then
                print_error "Failed to retrieve issues."
                return 1
            fi
            echo "$issues_json" | grep -o '"number":[0-9]*' | cut -d':' -f2 | while read -r num; do
                local title
                title=$(echo "$issues_json" | grep -A1 "\"number\":$num" | grep -o '"title":"[^"]*' | sed 's/"title":"//')
                local assign_to="$CODER_ASSIGNEE"
                if [[ "$title" =~ (UI|UX|design|visual|theme|color|3D|image|icon|logo|brand|layout|style|aesthetic|animation) ]]; then
                    assign_to="$DESIGNER_ASSIGNEE"
                fi
                if [ -n "$assign_to" ]; then
                    gh issue edit "$num" --add-assignee "$assign_to" > /dev/null 2>&1
                    echo "Issue #$num -> $assign_to"
                else
                    echo "Issue #$num -> [no default assignee configured]"
                fi
            done
            print_success "Auto-assignment complete."
            ;;
        lists)
            print_info "Manually assigning each open issue..."
            local issues
            IFS=$'\n' read -r -d '' -a issues <<< "$(gh issue list -R "$REPO_NAME" -s open -L 100 --json number,title -q '.[] | (.number|tostring) + " " + .title' 2>/dev/null)"
            for entry in "${issues[@]}"; do
                [ -z "$entry" ] && continue
                local inum ititle
                inum="${entry%% *}"
                ititle="${entry#* }"
                echo -e "\nIssue #$inum: $ititle"
                # Choose assignee for this issue
                local users=()
                IFS=',' read -ra defaults <<< "$DEFAULT_ASSIGNEES"
                for u in "${defaults[@]}"; do [ -n "$u" ] && users+=("$u"); done
                if [ -n "$CODER_ASSIGNEE" ]; then users+=("$CODER_ASSIGNEE"); fi
                if [ -n "$DESIGNER_ASSIGNEE" ]; then users+=("$DESIGNER_ASSIGNEE"); fi
                users+=("skip")
                PS3="Assign issue #$inum to: "
                select u in "${users[@]}"; do
                    if [ -z "$u" ]; then
                        print_error "Invalid selection."
                        continue
                    fi
                    if [ "$u" != "skip" ]; then
                        gh issue edit "$inum" --add-assignee "$u" > /dev/null 2>&1
                        print_success "Assigned #$inum to $u."
                    else
                        print_info "Skipped issue #$inum."
                    fi
                    break
                done
            done
            print_success "Manual issue assignment complete."
            ;;
        unassigned)
            if [ -z "$target_user" ]; then
                print_error "Please specify a user to assign all unassigned issues to."
                echo "Usage: $0 assign unassigned <user>"
                return 1
            fi
            print_info "Assigning all unassigned open issues to $target_user..."
            gh issue list -R "$REPO_NAME" -L 100 -s open -a none --json number -q '.[].number' 2>/dev/null | while read -r num; do
                gh issue edit "$num" --add-assignee "$target_user" > /dev/null 2>&1 && echo "Issue #$num -> $target_user"
            done
            print_success "All unassigned issues have been assigned to $target_user."
            ;;
        *)
            print_error "Unknown bulk assign mode: $mode"
            return 1
            ;;
    esac
}

# Bulk prioritize issues based on mode
bulk_prioritize() {
    local mode="$1"
    case "$mode" in
        auto)
            print_info "Auto-prioritizing issues..."
            local issues
            IFS=$'\n' read -r -d '' -a issues <<< "$(gh issue list -R "$REPO_NAME" -s open -L 100 --json number,title,labels -q '.[] | (.number|tostring) + " " + .title + " ||| " + ([.labels[].name] | join(","))' 2>/dev/null)"
            for entry in "${issues[@]}"; do
                [ -z "$entry" ] && continue
                local inum segment labels_text priority
                inum="${entry%% *}"
                segment="${entry#* }"
                labels_text="${segment#*||| }"
                priority="medium"
                if [[ "$segment" =~ [Uu]rgent ]] || [[ "$labels_text" =~ high ]]; then
                    priority="high"
                elif [[ "$segment" =~ [Ll]ow\ priority ]] || [[ "$labels_text" =~ low ]]; then
                    priority="low"
                fi
                set_issue_priority "$inum" "$priority"
            done
            print_success "Auto-prioritization complete."
            ;;
        lists)
            print_info "Manually prioritizing each open issue..."
            local issues_list
            IFS=$'\n' read -r -d '' -a issues_list <<< "$(gh issue list -R "$REPO_NAME" -s open -L 100 --json number,title -q '.[] | (.number|tostring) + " " + .title' 2>/dev/null)"
            for entry in "${issues_list[@]}"; do
                [ -z "$entry" ] && continue
                local inum ititle
                inum="${entry%% *}"
                ititle="${entry#* }"
                echo -e "\nIssue #$inum: $ititle"
                PS3="Set priority for issue #$inum: "
                select level in "high" "medium" "low" "skip"; do
                    if [ -z "$level" ]; then
                        print_error "Invalid selection."
                        continue
                    fi
                    if [ "$level" != "skip" ]; then
                        set_issue_priority "$inum" "$level"
                    else
                        print_info "Skipped issue #$inum."
                    fi
                    break
                done
            done
            print_success "Manual prioritization complete."
            ;;
        *)
            print_error "Unknown bulk prioritize mode: $mode"
            return 1
            ;;
    esac
}

# ============================================================