#!/bin/bash

# Direct script to update issue status

PROJECT_ID="PVT_kwHOAJyrsc4A3qvE"
STATUS_FIELD_ID="PVTSSF_lAHOAJyrsc4A3qvEzgsxB-0"
DONE_OPTION_ID="98236657"
ITEM_ID="PVTI_lAHOAJyrsc4A3qvEzgZxaQ4"  # Issue #9 Item ID

echo "Updating issue #9 to Done status..."

gh api graphql -f query="
  mutation {
    updateProjectV2ItemFieldValue(
      input: {
        projectId: \"$PROJECT_ID\",
        itemId: \"$ITEM_ID\",
        fieldId: \"$STATUS_FIELD_ID\",
        value: {
          singleSelectOptionId: \"$DONE_OPTION_ID\"
        }
      }
    ) {
      projectV2Item {
        id
      }
    }
  }
"

echo "Update complete."