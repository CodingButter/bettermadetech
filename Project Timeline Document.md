# Project Scope and Detailed Task Breakdown

## Project Overview

Creating a Chrome extension tailored for raffle companies, primarily targeting the UK market. The extension will feature a customizable spinner integrated with Directus for backend data management, built with Next.js, TypeScript, and Tailwind CSS. A complementary marketing website will support documentation and onboarding.

## Project Timeline (April 23 - May 14)

### Week 1: Foundation Setup (April 23 - April 29)

### Daily Breakdown for Week 1 (No Weekends, 6–7 hour workdays)

#### April 23 (Tuesday) - COMPLETED

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

This project delivers a Chrome extension for UK raffle companies, featuring a customizable spinner and integration with Directus. The development is structured over three weeks, emphasizing incremental milestones. Each week's objectives are broken into 6–7 hour weekday work sessions, with clear subtasks and estimated durations to ensure progress and predictability. A companion marketing and onboarding site will be built in parallel.

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

The project is structured to deliver value incrementally while ensuring long-term maintainability and usability. Prioritizing planning and foundational features early allows for a smoother development process, reduces rework, and ensures all moving parts align with user expectations and business goals.

---

- [ ] Plan Next Steps (1.5 hours)

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

  - [ ] Identify dependencies between tasks (45 mins)
    - [ ] Create dependency map for all Week 1 tasks (20 mins)
    - [ ] Document critical path components (15 mins)
    - [ ] Identify potential bottlenecks (10 mins)

  ### Plan Next Steps Summary:

This task aligns Week 1's development order with actual dependencies between components. It ensures that core technical work proceeds logically and avoids wasted time due to blocked features. A clear, flexible order of operations lets us pivot if needed without derailing the timeline.

#### April 26 (Friday) - CURRENT DAY

- [ ] Shared Components Setup for Extension (2 hours)
  - [ ] Create extension-specific package in packages directory (45 mins)
    - [ ] Setup package.json with dependencies (15 mins)
    - [ ] Configure build tools (vite or webpack) (15 mins)
    - [ ] Add typescript and tailwind configurations (15 mins)
  - [ ] Create spinner UI component package (1 hour 15 mins)
    - [ ] Define component API and types (30 mins)
    - [ ] Create skeleton implementation (30 mins)
    - [ ] Setup test configuration (15 mins)

- [ ] Chrome Extension Foundation Setup (2.5 hours)
  - [ ] Research Chrome extension architecture options (45 mins)
    - [ ] Investigate manifest v3 requirements (15 mins)
    - [ ] Research side panel API implementation (15 mins)
    - [ ] Determine best practice for state management (15 mins)
  - [ ] Create boilerplate extension structure (1 hour)
    - [ ] Setup manifest.json (15 mins)
    - [ ] Create basic folder structure (15 mins)
    - [ ] Configure background script (15 mins)
    - [ ] Setup side panel HTML/JS structure (15 mins)
  - [ ] Create settings page scaffold (45 mins)
    - [ ] Design basic layout (20 mins)
    - [ ] Implement form elements for configuration (25 mins)

- [ ] Extension Local Storage Integration (1 hour)
  - [ ] Create storage utilities (30 mins)
    - [ ] Implement chrome.storage API wrapper (15 mins)
    - [ ] Create typed storage interface (15 mins)
  - [ ] Implement settings persistence (30 mins)
    - [ ] Create settings state management (15 mins)
    - [ ] Connect UI to storage (15 mins)

#### April 27-28 (Weekend) - Buffer day if needed

#### April 29 (Monday)

- [ ] Spinner Basic Functionality (3.5 hours)
  - [ ] Define spinner config schema (30 mins)
    - [ ] Identify required customization options (15 mins)
    - [ ] Create JSON schema for configuration (15 mins)
  - [ ] Set up initial spinner UI with placeholder visuals (1 hour)
    - [ ] Design basic circular spinner component (30 mins)
    - [ ] Implement spinner segments and labels (30 mins)
  - [ ] Implement basic spin logic (1 hour)
    - [ ] Create spin animation controller (30 mins)
    - [ ] Implement winner selection algorithm (30 mins)
  - [ ] Connect spinner to mock data (1 hour)
    - [ ] Create sample data structure (15 mins)
    - [ ] Implement data loading and display (30 mins)
    - [ ] Add visual effects and transitions (15 mins)

- [ ] CSV Upload and Parsing (3 hours)
  - [ ] Outline expected formats (30 mins)
    - [ ] Define required and optional columns (15 mins)
    - [ ] Create sample valid CSV files (15 mins)
  - [ ] Setup file input and validation (1 hour)
    - [ ] Create drag-and-drop interface (30 mins)
    - [ ] Implement basic validation checks (30 mins)
  - [ ] Implement parsing logic (1 hour 30 mins)
    - [ ] Create CSV parser with proper error handling (45 mins)
    - [ ] Map CSV data to spinner data structure (45 mins)

#### April 30 (Tuesday)

- [ ] Directus Setup Preparation (2 hours)
  - [ ] Research Directus API requirements (1 hour)
    - [ ] Identify authentication methods (20 mins)
    - [ ] Research collection structure options (20 mins)
    - [ ] Plan API integration approach (20 mins)
  - [ ] Document Directus schema design (1 hour)
    - [ ] Define user settings schema (30 mins)
    - [ ] Define saved configurations schema (30 mins)

- [ ] Directus Setup Implementation (4.5 hours)
  - [ ] Create collection schema in Directus (1.5 hours)
    - [ ] Setup user collection (30 mins)
    - [ ] Setup spinner configurations collection (30 mins)
    - [ ] Setup saved CSV data collection (30 mins)
  - [ ] Connect extension with Directus API (3 hours)
    - [ ] Create API client package in packages directory (1 hour)
    - [ ] Implement authentication flow (1 hour)
    - [ ] Create data fetching service (1 hour)

#### May 1 (Wednesday)

- [ ] Settings Page Integration with Directus (3.5 hours)
  - [ ] Connect settings UI to Directus (2 hours)
    - [ ] Implement settings save functionality (1 hour)
    - [ ] Implement settings load functionality (1 hour)
  - [ ] Add user authentication UI (1.5 hours)
    - [ ] Create login/register forms (45 mins)
    - [ ] Implement session management (45 mins)

- [ ] Integration Testing (3 hours)
  - [ ] Test Spinner with CSV data (1 hour)
    - [ ] Verify correct parsing and display (30 mins)
    - [ ] Test with various CSV formats (30 mins)
  - [ ] Test Directus integration (1 hour)
    - [ ] Verify save/load functionality (30 mins)
    - [ ] Test authentication flow (30 mins)
  - [ ] End-to-end testing (1 hour)
    - [ ] Test complete user flow (30 mins)
    - [ ] Document and fix any issues (30 mins)

#### May 2 (Thursday)

- [ ] Landing Page Creation (3.5 hours)
  - [ ] Create new Next.js app in apps directory (45 mins)
    - [ ] Setup with shared UI components (30 mins)
    - [ ] Configure shared theme (15 mins)
  - [ ] Implement landing page design (2 hours 45 mins)
    - [ ] Create responsive layout structure (45 mins)
    - [ ] Implement navigation (30 mins)
    - [ ] Design hero section with key messaging (45 mins)
    - [ ] Add feature highlights section (45 mins)

- [ ] Initial Documentation Draft (3 hours)
  - [ ] Setup documentation structure in docs app (1 hour)
    - [ ] Configure shared components from UI package (30 mins)
    - [ ] Create documentation page templates (30 mins)
  - [ ] Create content (2 hours)
    - [ ] Write quick-start guide (45 mins)
    - [ ] Document spinner configuration options (45 mins)
    - [ ] Create FAQ section (30 mins)

### Week 2: Feature Expansion & Chrome Extension Polish (May 3 - May 9)

#### May 3 (Friday)

- [ ] Spinner UI Enhancement (3.5 hours)
  - [ ] Add advanced customization options (2 hours)
    - [ ] Implement color scheme customization using shared theme components (1 hour)
    - [ ] Add logo/image upload functionality (1 hour)
  - [ ] Improve spinner visual design (1.5 hours)
    - [ ] Enhance segment styling with shared design tokens (45 mins)
    - [ ] Add winner highlight effects (45 mins)

- [ ] Chrome Extension Side Panel Optimization (3 hours)
  - [ ] Improve panel open/close performance (1.5 hours)
    - [ ] Optimize initial load time (45 mins)
    - [ ] Implement state persistence (45 mins)
  - [ ] Enhance user experience (1.5 hours)
    - [ ] Add keyboard shortcuts (30 mins)
    - [ ] Implement responsive layout for different screen sizes (1 hour)

#### May 6 (Monday)

- [ ] User Authentication & Security (3.5 hours)
  - [ ] Create shared authentication package (1.5 hours)
    - [ ] Implement token storage and management (45 mins)
    - [ ] Create secure authentication utilities (45 mins)
  - [ ] Implement secure authentication flow (2 hours)
    - [ ] Connect to Directus authentication (1 hour)
    - [ ] Create secure token refresh mechanism (1 hour)

- [ ] Configuration Panel Enhancements (3 hours)
  - [ ] Add preset management (1.5 hours)
    - [ ] Implement save/load configuration presets (45 mins)
    - [ ] Create preset sharing functionality (45 mins)
  - [ ] Improve configuration UI (1.5 hours)
    - [ ] Add real-time preview using shared components (45 mins)
    - [ ] Implement form validation (45 mins)

#### May 7 (Tuesday)

- [ ] Website Content Expansion (3.5 hours)
  - [ ] Add detailed documentation pages (2 hours)
    - [ ] Create advanced usage guides (1 hour)
    - [ ] Add troubleshooting section (1 hour)
  - [ ] Improve marketing content (1.5 hours)
    - [ ] Add testimonials section (placeholder) (45 mins)
    - [ ] Create pricing page (if applicable) (45 mins)

- [ ] Integration Testing and Bug Fixes (3 hours)
  - [ ] Conduct thorough testing of all features (1.5 hours)
  - [ ] Fix identified issues (1.5 hours)

#### May 8 (Wednesday)

- [ ] Advanced CSV Features (3.5 hours)
  - [ ] Add column mapping interface (1.5 hours)
    - [ ] Create dynamic field mapping UI (45 mins)
    - [ ] Implement header detection (45 mins)
  - [ ] Implement data transformation options (2 hours)
    - [ ] Add filtering capabilities (1 hour)
    - [ ] Create data sorting options (1 hour)

- [ ] User Experience Improvements (3 hours)
  - [ ] Add onboarding tooltips/walkthrough (1.5 hours)
  - [ ] Implement error messages and notifications (1.5 hours)

#### May 9 (Thursday)

- [ ] Documentation Finalization (3 hours)
  - [ ] Complete all user guides (1.5 hours)
  - [ ] Create video tutorial content plan (1.5 hours)

- [ ] Buffer time for Week 2 (3.5 hours)
  - [ ] Address any outstanding issues (1.5 hours)
  - [ ] Implement additional polish items (2 hours)

### Week 3: Testing & Launch Preparation (May 10 - May 14)

#### May 10 (Friday)

- [ ] Comprehensive Testing (6.5 hours)
  - [ ] Browser compatibility testing (2 hours)
    - [ ] Test on Chrome stable (45 mins)
    - [ ] Test on Chrome beta (if applicable) (45 mins)
    - [ ] Document any browser-specific issues (30 mins)
  - [ ] Performance testing (2 hours)
    - [ ] Test with large CSV files (1 hour)
    - [ ] Optimize loading and animation performance (1 hour)
  - [ ] Security audit (1.5 hours)
    - [ ] Review authentication implementation (45 mins)
    - [ ] Check for data exposure risks (45 mins)
  - [ ] Fix critical issues (1 hour)

#### May 13 (Monday)

- [ ] Chrome Web Store Preparation (3.5 hours)
  - [ ] Create store listing assets (2 hours)
    - [ ] Design icon and promotional images (1 hour)
    - [ ] Write compelling store description (1 hour)
  - [ ] Prepare package for submission (1.5 hours)
    - [ ] Configure final manifest settings (45 mins)
    - [ ] Bundle and package extension (45 mins)

- [ ] Website Finalization (3 hours)
  - [ ] Final content review and improvements (1.5 hours)
  - [ ] SEO optimization (1.5 hours)

#### May 14 (Tuesday)

- [ ] Launch Marketing Campaign (3.5 hours)
  - [ ] Create launch announcement materials (2 hours)
  - [ ] Set up analytics tracking (1.5 hours)

- [ ] Final Testing and Submission (3 hours)
  - [ ] Complete pre-launch checklist (1.5 hours)
  - [ ] Submit to Chrome Web Store (1.5 hours)

## Daily Task Summary

### April 26 (Friday) - TODAY
- Shared Components Setup for Extension (2 hours)
- Chrome Extension Foundation Setup (2.5 hours)
- Extension Local Storage Integration (1 hour)

### April 29 (Monday)
- Spinner Basic Functionality (3.5 hours)
- CSV Upload and Parsing (3 hours)

### April 30 (Tuesday)
- Directus Setup Preparation (2 hours)
- Directus Setup Implementation (4.5 hours)

### May 1 (Wednesday)
- Settings Page Integration with Directus (3.5 hours)
- Integration Testing (3 hours)

### May 2 (Thursday)
- Landing Page Creation (3.5 hours)
- Initial Documentation Draft (3 hours)

### Week 2-3 continue with feature expansion, polish, testing and launch preparation