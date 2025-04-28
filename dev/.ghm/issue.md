# GitHub Project and Issue Management with `gh` CLI — LLM Reference

> This file is written for a Coding LLM to reference when managing GitHub Projects and Issues using the GitHub CLI (`gh`). It includes step-by-step instructions, examples, and command references for the latest GitHub Projects (Projects v2) and Issue management.

---

## Prerequisites

- Ensure the GitHub CLI (`gh`) is installed: [Install Here](https://cli.github.com/).
- Authenticate with `gh auth login` and ensure token scopes include `project` and `repo`:
  ```bash
  gh auth refresh -s project,repo
  gh auth status
  ```

---

# GitHub Project Management

## Listing Projects and Retrieving IDs

```bash
gh project list --owner OWNER
gh project view PROJECT_ID --owner OWNER --format=json
```

---

## Creating, Editing, and Deleting Projects

```bash
gh project create --owner OWNER --title "Project Name"
gh project edit PROJECT_ID --owner OWNER --description "Description Here" --visibility PUBLIC
gh project delete PROJECT_ID --owner OWNER
gh project close PROJECT_ID --owner OWNER
```

---

## Managing Project Items

**Add an Issue/PR to a project:**

```bash
gh project item-add PROJECT_ID --owner OWNER --url https://github.com/OWNER/REPO/issues/123
```

**Create a draft (note) item:**

```bash
gh project item-create PROJECT_ID --owner OWNER --title "Draft Title" --body "Draft Details"
```

**List project items:**

```bash
gh project item-list PROJECT_ID --owner OWNER
```

**Edit project item fields:**

```bash
gh project item-edit --id ITEM_ID --field-id FIELD_ID --project-id PROJECT_ID --text "Value"
```

Other value types:

- Number: `--number 123`
- Date: `--date YYYY-MM-DD`
- Single-select: `--single-select-option-id OPTION_ID`
- Clear a field: `--clear`

**Remove or archive items:**

```bash
gh project item-delete PROJECT_ID --owner OWNER --id ITEM_ID
gh project item-archive PROJECT_ID --owner OWNER --id ITEM_ID
```

---

## Managing Project Fields

**List fields:**

```bash
gh project field-list PROJECT_ID --owner OWNER
```

**Create a custom field:**

```bash
gh project field-create PROJECT_ID --owner OWNER --name "Field Name" --data-type TEXT
```

(Supports: `TEXT`, `NUMBER`, `DATE`, `SINGLE_SELECT`)

**Delete a field:**

```bash
gh project field-delete --id FIELD_ID
```

---

# GitHub Issue Management

## Listing Issues

**List issues in a repository:**

```bash
gh issue list --repo OWNER/REPO
```

Common filters:

- `--state open|closed|all`
- `--label "LabelName"`
- `--assignee USERNAME`
- `--search "keywords"`

Example — list open issues assigned to yourself:

```bash
gh issue list --assignee "@me" --state open
```

---

## Viewing a Specific Issue

```bash
gh issue view ISSUE_NUMBER --repo OWNER/REPO
gh issue view ISSUE_NUMBER --repo OWNER/REPO --web
```

(`--web` opens in browser.)

---

## Creating Issues

```bash
gh issue create --repo OWNER/REPO --title "Issue Title" --body "Issue description."
```

Optional flags:

- `--assignee USERNAME`
- `--label "bug,help wanted"`
- `--project PROJECT_ID`
- `--milestone "MilestoneName"`

Example:

```bash
gh issue create --repo OWNER/REPO --title "Login Bug" --body "User cannot log in." --label "bug" --assignee "@me"
```

---

## Editing Issues

```bash
gh issue edit ISSUE_NUMBER --repo OWNER/REPO --title "New Title" --body "Updated Body"
```

You can also:

- Add/remove labels: `--add-label "Label1,Label2"` or `--remove-label "LabelName"`
- Change assignee: `--add-assignee USERNAME`
- Change milestone: `--milestone "MilestoneName"`

Example — add a new assignee and label:

```bash
gh issue edit 123 --repo OWNER/REPO --add-assignee new-user --add-label "urgent"
```

---

## Closing or Reopening Issues

**Close an issue:**

```bash
gh issue close ISSUE_NUMBER --repo OWNER/REPO
```

**Reopen a closed issue:**

```bash
gh issue reopen ISSUE_NUMBER --repo OWNER/REPO
```

---

# Best Practices for the LLM

- Always **retrieve IDs first** when managing projects, fields, items, and issues.
- Prefer JSON outputs and `--jq` queries for automation.
- Always confirm destructive actions (like deleting a project or field).
- Use `--web` for manual intervention or visual confirmation when necessary.
- Maintain issue hygiene: assign issues to relevant projects, use consistent labels, and keep descriptions clear.

---

> End of LLM reference for GitHub Project and Issue Management using `gh` CLI.
