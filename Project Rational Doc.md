## Project Rationale Document

### Purpose

This document serves as a companion reference to the Project Timeline. Its goal is to explain the _why_ behind every major task and milestone. It outlines how each component fits into the broader product strategy, what it should accomplish, and what is required for it to be considered complete. Use this when starting any major task to clarify your focus and reduce ambiguity.

---

### Scope of Work Document

**Why it exists:**  
Before building anything, you need to understand what you’re building. This document defines the overall vision and the boundaries of the project. It breaks the work into logical pieces, helping you stay aligned with your goals and avoid scope creep.

**Completion expectations:**

- Define the main project components and tools (Chrome extension, website, stack choices).
- Outline all milestones and when they’re expected to be delivered.
- Break down weekly goals into daily, time-estimated tasks.
- Include a written scope summary that captures the entire intent in a few paragraphs.

---

### Project Rationale Document

**Why it exists:**  
It’s not enough to know _what_ you’re doing—you need to know _why_. This document ensures your workflow reflects priorities and dependencies, not just tasks on a list. It helps you make smart tradeoffs if you're low on time or something takes longer than planned.

**Completion expectations:**

- Clearly explain the logic behind the order of development (e.g., build core features before UI polish).
- Define what value each weekly milestone delivers (technical validation, usability, market readiness).
- Include a summary that explains your staged approach to development.

---

### Plan Next Steps

**Why it exists:**  
This task bridges planning and execution. It lays out the sequence in which tasks should be tackled to prevent rework or dead ends. Think of it like setting up a scaffolding before you start building.

**Completion expectations:**

- Prioritize Week 1 features based on dependency and impact.
- Document which features depend on others (e.g., spinner config must exist before CSV parsing is useful).
- Annotate dependent tasks in the timeline for visibility.
- Result should be a clear, logical sequence of development tasks to minimize blockers.

---

### Review and Adjust Timeline

**Why it exists:**  
No plan survives contact with reality. This task forces you to reflect and adapt after your first round of implementation. It's there to keep you on track, not to make you feel like you're falling behind.

**Completion expectations:**

- Compare actual progress to projected time blocks.
- Rebalance remaining time if something took longer or went faster than expected.
- Adjust future time estimates or break up any tasks that proved more complex than expected.
- Leave notes about what shifted and why.

---

### Spinner Basic Functionality

**Why it exists:**  
The spinner is the core experience of the extension—it’s the part users interact with directly. This task gets the MVP version of that experience running so everything else can build around it.

**Completion expectations:**

- A basic UI that simulates spinning and randomly selects a result.
- No need for full styling yet—focus on functionality.
- Reads test/mock data for now, not actual CSV uploads.
- Includes basic animation (not final polish).
- Tested to confirm it outputs consistently random results.
- Must be completed before CSV parsing, Directus setup, and documentation.

---

### CSV Upload & Parsing

**Why it exists:**  
Raffle companies often manage participant data in CSVs. Uploading and interpreting that data is essential to making the spinner useful in the real world.

**Completion expectations:**

- User can upload a CSV.
- The system parses and maps relevant columns (e.g., name, ticket number).
- Handles edge cases: missing headers, extra columns, malformed rows.
- Results are transformed into a usable format by the spinner.
- Depends on spinner config being defined first.

---

### Directus Setup for User Settings

**Why it exists:**  
You need somewhere to store user preferences (e.g., spinner behavior, previously uploaded files, UI themes). Directus provides an easy-to-integrate backend for this.

**Completion expectations:**

- Set up a collection in Directus for user data.
- Create API connection between the extension and Directus.
- Save and retrieve settings for individual users.
- Stub out real login/auth—no need for secure sessions yet.
- Depends on spinner configuration and CSV structure.

---

### Landing Page Creation

**Why it exists:**  
Even the best product needs a front door. This page is what raffle companies will see when they first learn about your extension. It’s also where you’ll point marketing links.

**Completion expectations:**

- Basic responsive layout with logo/title, CTA, and brief product value props.
- Doesn’t need full navigation yet—just enough to promote and validate interest.
- Linked to any available documentation or screenshots.
- Best built after spinner UI is functional for accurate previews.

---

### Initial Documentation Draft

**Why it exists:**  
Even simple tools confuse people if they don’t know how to use them. Good docs lower support costs and raise adoption.

**Completion expectations:**

- A quick-start guide with setup steps and screenshots (or placeholder images).
- Written in markdown or similar, intended for the marketing site.
- Includes FAQ-style bullets for expected questions.
- Linked from the landing page if possible.
- Depends on basic spinner, CSV parsing, and Directus setup being functional.

---

### Summary

This document keeps your head clear when the to-do list gets overwhelming. You’re not just building software—you’re building confidence, clarity, and momentum. Refer to this often to stay grounded in the _why_ behind the _what_.
