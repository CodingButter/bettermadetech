# Spinner Module Refactor – Developer Instructions

## Overview

We are undertaking an overhaul of the spinner functionality to improve modularity and maintainability across all parts of the project. The goal is to **encapsulate all spinner-related code** in a dedicated module and enforce a clear separation of concerns. This involves creating a new **`spinner` package** (similar in structure to our existing `ui` package) and using an **abstract class** to handle spinner logic. Each application (web app, documentation site, and browser extension) will provide its own implementation of this abstract class.

## Objectives and Requirements

### 1. Create a Dedicated `spinner` Package

- Set up the new package under `packages/spinner`, structured like `packages/ui`.
- Move existing spinner components and settings UI to this package.

### 2. Design a Shared Abstract Spinner Class

- Define an abstract class (`SpinnerBase`) in the spinner package.
- Spinner components should invoke methods defined by this class, without direct logic.

### 3. Extend the Abstract Class in Each Application

- **Web App:** Implement spinner logic (e.g., API calls, local storage).
- **Documentation App:** Provide minimal or demo implementation.
- **Browser Extension:**

  - The **extension** must contain **all of its logic inside itself**. - The **Side Panel**, **Options**, and **Popup** in the extension will each **reuse the spinner components** from the `spinner` package. - Each of these views will **import the spinner component** they need **and provide it an instance of the `ExtensionSpinnerClient` class**. - `ExtensionSpinnerClient` must **extend the abstract `SpinnerBase` class** and provide **extension-specific implementations** for all required functions (such as loading and saving settings, authenticating with Directus, or local storage interactions specific to Chrome Extension APIs). - This ensures that the spinner components behave the same visually and structurally, but their behavior is correctly tailored for the extension environment.

### 4. Integrate Spinner Components Using Dependency Injection

- Inject the app-specific Spinner service into spinner components (via props/context).
- Components should rely entirely on the provided service for logic.

### 5. Centralize Settings Storage on the Server

- Store spinner settings on Directus server.
- Local storage limited to authentication tokens.

## Action Plan & Next Steps

### Step 1: Set Up the `spinner` Package

- Establish folder structure and transfer relevant components and UI elements.

### Step 2: Define the Abstract Class in `spinner` Package

- Clearly specify required abstract methods (e.g., `saveSpinnerSettings`, `loadSpinnerSettings`, `getAuthToken`).

### Step 3: Implement Abstract Class in Each Application

- Complete implementations for Web App, Docs App, and Browser Extension as outlined above.

### Step 4: Integrate the Spinner UI with Implementations

- Update components to use the abstract class methods exclusively.

### Step 5: Server-Side Settings Confirmation

- Validate consistent server-side storage of settings.
- Conduct thorough testing across all apps.

## Documentation & Handoff

- Provide clear documentation within the spinner package.
- Plan for a detailed code review and testing cycle.

## Conclusion

Following these guidelines will ensure the spinner module is modular, maintainable, and consistently implemented across our platforms.

Please proceed accordingly and reach out with any questions or for further clarification.
