# Project Scope and Detailed Task Breakdown

## Project Overview

Creating a Chrome extension tailored for raffle companies, primarily targeting the UK market. The extension will feature a customizable spinner integrated with Directus for backend data management, built with Next.js, TypeScript, and Tailwind CSS. A complementary marketing website will support documentation and onboarding.

## Project Timeline (April 23 - May 14)

### Week 1: Foundation Setup (April 23 - April 29)

### Daily Breakdown for Week 1 (No Weekends, 6–7 hour workdays)

#### April 23 (Tuesday)

---

- [x] Scope of Work Document (2 hours)

  - [x] Define main components (45 mins)
    - Chrome extension for raffle companies (customizable spinner, CSV input, Directus backend)
    - Marketing and documentation website (Next.js, Tailwind, TypeScript)
  - [x] Outline milestones (45 mins)
    - Week 1: Project foundation and core features
    - Week 2: Feature expansion and documentation
    - Week 3: Testing and launch preparation
  - [x] List specific tasks (30 mins)
    - All project tasks are broken into daily chunks with subtasks and estimates
  - [x] Write Scope Summary (Final step – 15 mins)
    - [x] Include scope recap and work expectations

  ### Scope of Work Summary:

  ```markdown
  This project delivers a Chrome extension for UK raffle companies, featuring a customizable spinner and integration with Directus. The development is structured over three weeks, emphasizing incremental milestones. Each week’s objectives are broken into 6–7 hour weekday work sessions, with clear subtasks and estimated durations to ensure progress and predictability. A companion marketing and onboarding site will be built in parallel.
  ```

---

- [x] Project Rationale Document (1.5 hours)

  - [x] Explain task priority order (45 mins)

    - [x] The project starts with documentation and planning to ensure alignment and clear expectations before implementation.
    - [x] Core functionality is prioritized first (spinner, CSV parsing, Directus setup) to validate the concept early.
    - [x] UI, authentication, and customization follow to enhance usability and prepare for real-world use.
    - [x] Final week focuses on testing, bug fixing, and polish to ensure a stable and presentable release.

  - [x] Describe outcomes and value of each milestone (45 mins)
    - [x] **Week 1: Foundation Setup**  
          Establishes architecture, defines scope, and implements core functionality. This sets the stage for flexible feature growth.
    - [x] **Week 2: Feature Expansion & Documentation**  
          Adds polish, improves usability, and delivers essential user support content for onboarding and comprehension.
    - [x] **Week 3: Testing & Launch Prep**  
          Validates system integrity and prepares the product for public release with marketing and usability in mind.

  ### Project Rationale Summary

  ```markdown
  The project is structured to deliver value incrementally while ensuring long-term maintainability and usability. Prioritizing planning and foundational features early allows for a smoother development process, reduces rework, and ensures all moving parts align with user expectations and business goals.
  ```

---

- [x] Plan Next Steps (1.5 hours)

  - [x] Prioritize Week 1 features (45 mins)

    - [x] Confirm development order: spinner → CSV parsing → Directus setup → website
    - [x] Evaluate which feature is most likely to block others if delayed
      - ⚠ **Spinner Basic Functionality** is the most likely to block progress if delayed.
        - It must be completed before:
          - CSV data structure can be finalized (needs spinner config)
          - Parser output can be tested against real logic
          - Directus preferences can be mapped to something meaningful
        - 📌 Notes added to related tasks:
          - CSV Upload and Parsing Part 1 & 2 – _depends on defined spinner config_
          - Directus Setup – _depends on known spinner settings for saving preferences_

  - [x] Identify dependencies between tasks (45 mins)
    - Spinner → CSV parsing → Directus setup → Docs and Marketing
    - CSV parsing → Documentation
    - Directus setup → Authentication
    - Spinner + Directus + CSV → Test coverage and submission readiness

  ### Plan Next Steps Summary:

  ```markdown
  This task aligns Week 1's development order with actual dependencies between components. It ensures that core technical work proceeds logically and avoids wasted time due to blocked features. A clear, flexible order of operations lets us pivot if needed without derailing the timeline.
  ```

#### April 24 (Wednesday)

- [ ] Spinner Basic Functionality (4 hours)

  - [ ] Define spinner config schema (30 mins)
  - [ ] Set up initial spinner UI with placeholder visuals (1 hour)
  - [ ] Implement basic spin logic (1 hour)
  - [ ] Connect spinner to mock data (30 mins) — depends on: Define spinner config schema
  - [ ] Add basic spinning animation (45 mins)
  - [ ] Test and fix bugs (15 mins)

- [ ] CSV Upload and Parsing – Part 1 (2.5 hours) — depends on: Define spinner config schema
  - [ ] Outline expected formats (30 mins)
  - [ ] Setup file input (1 hour)
  - [ ] Stub parser logic (1 hour)

#### April 25 (Thursday)

- [ ] CSV Upload and Parsing – Part 2 (1.5 hours) — depends on: CSV Part 1

  - [ ] Implement full parsing logic with sample file (1 hour)
  - [ ] Handle edge cases/malformed data (30 mins)

- [ ] Directus Setup for User Settings – Part 1 (3 hours) — depends on: Spinner config, CSV parsed

  - [ ] Create collection schema in Directus (1.5 hours)
  - [ ] Connect project with Directus API (1.5 hours)

- [ ] Directus Setup – Part 2 (2.5 hours) — depends on: Directus Setup Part 1
  - [ ] Stub user preferences save/load (1.5 hours)
  - [ ] Initial Directus config test/debug (1 hour)

#### April 26 (Friday)

- [ ] Landing Page Creation (3 hours) — depends on: Spinner working

  - [ ] Setup layout in Next.js (1 hour)
  - [ ] Add hero section and CTA (2 hours)

- [ ] Initial Documentation Draft (3 hours) — depends on: CSV parsing, Directus, Spinner

  - [ ] Write quick-start guide (1.5 hours)
  - [ ] Outline features and user flow (1.5 hours)

- [ ] Slack day for spillover, fixes, polish (1 hour buffer)

### Week 2: Feature Expansion & Documentation (April 30 - May 6)

- [ ] **Chrome Extension Development**

  - [ ] User Authentication & Configuration Panel (6 hours) — depends on: Directus Setup Part 2
  - [ ] Spinner UI Enhancement & Customization Options (4 hours) — depends on: Spinner Basic Functionality

- [ ] **Website Content**
  - [ ] Expanded Documentation & User Guides (4 hours) — depends on: Initial Documentation Draft
  - [ ] Marketing Content Development (4 hours) — depends on: Landing Page Creation

### Week 3: Testing & Launch Preparation (May 7 - May 14)

- [ ] **Chrome Extension**

  - [ ] Comprehensive Testing and Bug Fixes (6 hours) — depends on: All core extension features
  - [ ] Chrome Web Store Submission Preparation (2 hours) — depends on: Successful testing

- [ ] **Website Finalization**
  - [ ] Launch Marketing Campaign (4 hours) — depends on: Marketing Content
  - [ ] Complete Documentation and Ensure Usability (4 hours) — depends on: Expanded Documentation
