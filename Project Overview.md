# Winner Spinner by BetterMadeTech

## Project Overview

Winner Spinner is a customizable, brandable Chrome extension designed to revolutionize the way independent raffle companies reveal winners during live events. Rather than scrolling through spreadsheets or relying on basic randomizers, Winner Spinner transforms the winning moment into a dynamic, visual experience — without influencing the outcome itself.

Our software **does not select** the winning ticket; it simply **displays** the pre-determined winner in an exciting, engaging, and professional way.

---

## Purpose and Vision

The raffle industry thrives on excitement, anticipation, and trust. Yet, the tools most independent raffle companies use today — Google Sheets, basic random.org lists, or cookie-cutter tumblers from larger platforms like WhatsNot — fail to elevate the moment where it matters most: **the winner reveal.**

Winner Spinner exists to:

- Enhance the professionalism and perceived legitimacy of independent raffles.
- Offer customizable, brand-specific displays that help companies **stand out**.
- Create shareable, memorable moments during live streams that drive **customer retention and marketing content**.
- Modernize a dated and visually flat winner announcement process without disrupting the trusted workflows companies already use.

---

## Core Functionality

- **Display Only:**  
  Winner Spinner does not modify or influence the selection of winners. Companies use their existing trusted method (such as Google's random number generator) to determine the winner. Our tool is strictly for enhancing the visual reveal.

- **CSV File Integration:**  
  Companies upload a CSV containing their participant and ticket data. This data is parsed and ready for rapid winner lookup and presentation.

- **Brand Customization:**  
  Each raffle company can customize:

  - Spinner colors
  - Logo placement
  - Background visuals
  - Spinner sound effects (optional future feature)

- **Lightweight Installation:**  
  As a Chrome extension, Winner Spinner is easy to install, easy to configure, and ready to run on platforms like Facebook Live or Twitch without complicated setup.

- **Performance Optimized:**  
  Built using Next.js, TailwindCSS, and TypeScript for speed, responsiveness, and reliability.

---

## Technology Stack

### Frontend
- **Chrome Extension:** Built with TypeScript, React, and TailwindCSS
- **Web Application:** Next.js for landing page, documentation, and demo
- **3D Spinner Component:** Custom React-based component with optimized animations

### Backend
- **Directus:** Headless CMS for configuration storage and user management
- **API Integration:** RESTful API for data exchange between extension and backend

### Infrastructure
- **Monorepo Structure:** Using Turborepo for efficient cross-package development
- **Shared Component Library:** Reusable UI components across all platforms
- **Documentation:** Fumadocs-based documentation site

### Testing
- **Jest and React Testing Library:** For component and integration testing
- **Cross-platform Testing:** Ensuring functionality across browsers and devices
- **Performance Testing:** Optimizing for smooth animation and minimal resource usage

---

## Project Status and Progress

### Completed Work (as of April 30, 2025)
- **Spinner Package Development (100% Complete)**
  - Created core spinner architecture with SpinnerBase abstract class
  - Implemented client interfaces for web, docs, and extension
  - Built comprehensive test suite and integration tests
  - Optimized performance for smooth animations
  - Created detailed documentation including migration guide

- **Documentation Site (100% Complete)**
  - Set up Fumadocs-based documentation infrastructure
  - Created comprehensive spinner API documentation
  - Added modern landing page design
  - Implemented navigation and search functionality
  - Added favicon and metadata

- **Project Infrastructure (100% Complete)**
  - Established GitHub project workflow with custom status tracking
  - Created automation scripts for issue management
  - Set up monorepo structure with Turborepo

- **Bug Fixes and Optimizations (100% Complete)**
  - Fixed TypeScript errors across the codebase
  - Resolved build issues in extension
  - Fixed dynamic import in web application
  - Improved ESLint configuration in documentation app

### Current Focus
- **Chrome Extension Development (0% Complete)**
  - Setting up shared components for extension
  - Creating extension foundation with manifest v3
  - Implementing local storage integration
  - Building spinner basic functionality
  - Developing CSV upload and parsing

### Upcoming Work
- **Backend Integration (0% Complete)**
  - Setting up Directus for user settings storage
  - Implementing settings page integration with Directus
  - Creating authentication mechanism

- **User Experience and Polish (0% Complete)**
  - Enhancing spinner UI with advanced customization options
  - Optimizing Chrome extension side panel performance
  - Adding accessibility improvements
  - Creating onboarding experience for new users

- **Launch Preparation (0% Complete)**
  - Conducting comprehensive testing across browsers
  - Preparing Chrome Web Store assets and descriptions
  - Creating launch marketing materials
  - Finalizing website content

---

## Why This Product Should Exist

Currently, independent raffle companies face two poor choices:

1. **Use spreadsheets or random.org results** — flat, boring, and unprofessional.
2. **Use proprietary tumblers from service providers like WhatsNot** — but only if they give up control and move their business to those platforms.

There is a growing market of **independent rafflers** who want the freedom to build their brand and retain customer trust without sacrificing showmanship.  
**Winner Spinner bridges that gap** by providing a professional reveal tool that enhances, rather than replaces, the raffler's workflow.

---

## Target Market

- **Primary:**  
  Independent raffle companies operating through Facebook Live, Instagram Live, Twitch, or other social media platforms.

- **Secondary:**  
  Small auction businesses, online fundraiser organizers, community giveaways, and boutique event promoters.

These users value:

- **Control** over their operations.
- **Trust** with their customers.
- **Excitement** during their live events.
- **Professional presentation** to grow their brand image.

---

## Importance of the Product

- **Improves customer retention** by making the raffle moment exciting and satisfying.
- **Differentiates independent raffle businesses** from hobbyists or less polished competitors.
- **Grows brand loyalty** with consistent, professional presentation across events.
- **Supports scalability** for raffle companies aiming to expand their operations without sacrificing control.

Winner Spinner isn't just a "cool add-on." It's a necessary evolution for modern, professional raffle companies who want to **own their experience**, **build their brand**, and **delight their customers**.

---

# Winner Spinner

**By BetterMadeTech**  
Bringing excitement, professionalism, and independence to the heart of your raffles.