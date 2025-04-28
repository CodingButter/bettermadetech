# GitHub Project Management with `gh` CLI — LLM Reference

> This file is written for a Coding LLM to reference when managing GitHub Projects using the GitHub CLI (`gh`). It includes step-by-step instructions, examples, and command references for the latest GitHub Projects (Projects v2).

---

## Prerequisites

- Ensure the GitHub CLI (`gh`) is installed: [Install Here](https://cli.github.com/).
- Authenticate with `gh auth login` and ensure token scopes include `project`:
  ```bash
  gh auth refresh -s project
  gh auth status
  ```

---

## Listing Projects and Retrieving IDs

List projects owned by a user or org:

```bash
gh project list --owner OWNER
```

- Replace `OWNER` with GitHub username, org name, or `@me` (for authenticated user).
- Output includes project `NUMBER`, `TITLE`, `STATE`, and `ID`.
- Use `NUMBER` and `OWNER` as `PROJECT_ID` in future commands.

Retrieve full project metadata:

```bash
gh project view PROJECT_ID --owner OWNER --format=json
```

---

## Creating a New Project

Create a project under a user or organization:

```bash
gh project create --owner OWNER --title "Project Name"
```

Update project description and visibility:

```bash
gh project edit PROJECT_ID --owner OWNER --description "Description Here" --visibility PUBLIC
```

Visibility options: `PUBLIC` or `PRIVATE`.

---

## Viewing Project Details

View project overview:

```bash
gh project view PROJECT_ID --owner OWNER
```

Open the project in a web browser:

```bash
gh project view PROJECT_ID --owner OWNER --web
```

---

## Adding Items to a Project

**Adding an existing Issue/PR:**

```bash
gh project item-add PROJECT_ID --owner OWNER --url https://github.com/OWNER/REPO/issues/123
```

**Creating a draft (note) item:**

```bash
gh project item-create PROJECT_ID --owner OWNER --title "Draft Title" --body "Draft Details"
```

**Listing project items:**

```bash
gh project item-list PROJECT_ID --owner OWNER
```

---

## Managing Project Fields

**List all fields:**

```bash
gh project field-list PROJECT_ID --owner OWNER
```

**Get JSON output of fields:**

```bash
gh project field-list PROJECT_ID --owner OWNER --format=json
```

**Query a field ID using `jq`:**

```bash
gh project field-list PROJECT_ID --owner OWNER --format=json --jq '.fields[] | select(.name == "Field Name").id'
```

**Create a new custom field:**

```bash
gh project field-create PROJECT_ID --owner OWNER --name "Field Name" --data-type TYPE
```

- `TYPE` can be `TEXT`, `NUMBER`, `DATE`, or `SINGLE_SELECT`.

**Add a single-select field with options:**

```bash
gh project field-create PROJECT_ID --owner OWNER --name "Priority" --data-type SINGLE_SELECT --single-select-options "Low,Medium,High"
```

**Delete a field:**

```bash
gh project field-delete --id FIELD_ID
```

---

## Updating Project Items

**Edit a field value on an item:**

```bash
gh project item-edit --id ITEM_ID --field-id FIELD_ID --project-id PROJECT_ID --text "New Value"
```

Other field types:

- Number: `--number 123`
- Date: `--date YYYY-MM-DD`
- Single-select option: `--single-select-option-id OPTION_ID`
- Iteration: `--iteration-id ITERATION_ID`

**Clear a field:**

```bash
gh project item-edit --id ITEM_ID --field-id FIELD_ID --project-id PROJECT_ID --clear
```

**Edit draft item title/body:**

```bash
gh project item-edit --id ITEM_ID --title "New Title" --body "New Body Text"
```

---

## Removing or Archiving Items

**Remove an item from a project:**

```bash
gh project item-delete PROJECT_ID --owner OWNER --id ITEM_ID
```

**Archive an item instead of deleting:**

```bash
gh project item-archive PROJECT_ID --owner OWNER --id ITEM_ID
```

---

## Closing or Deleting a Project

**Close (archive) a project:**

```bash
gh project close PROJECT_ID --owner OWNER
```

**Delete a project permanently:**

```bash
gh project delete PROJECT_ID --owner OWNER
```

---

## Notes for the LLM

- Always retrieve IDs first before modifying items or fields.
- When working with select fields, retrieve option IDs separately if needed.
- Use `--format=json` and `--jq` filtering when automating or scripting.
- Deleting a project or field is irreversible; use with caution.
- GitHub Projects (v2) is flexible but requires IDs for most CLI operations.

---

> End of LLM reference for GitHub Project Management via `gh` CLI.
