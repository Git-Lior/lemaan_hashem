# למען השם (Lema'an Hashem) - Interactive Surname Experience

## Project Description

"Lema'an Hashem" is an interactive web application designed for a cultural exhibition in Israel. It explores the historical phenomenon of **"עברות שמות משפחה" - the Hebraization of surnames** undertaken by many Jewish immigrants upon arriving in Israel.

The core experience allows visitors (Clients) to input their original family surname and cultural origin. The application then renders this name using a stylized font visually associated with their heritage. An animation sequence follows, where parts of each letter in the stylized surname are progressively "broken" and replaced by corresponding parts from a standard Hebrew block font, visually representing the cultural adaptation and name change process.

The application includes separate interfaces for a Designer to set up the visual assets and animation parameters before the exhibition.

## Cultural Context

Upon immigrating to Israel, particularly during the early and mid-20th century, many individuals and families were encouraged or chose to change their diaspora surnames to Hebrew ones. This act, known as "עברות שמות משפחה" was part of forging a new Israeli identity, connecting to the Hebrew language, and sometimes shedding names associated with past persecutions. This project aims to create a personal, visual connection to this complex and meaningful historical process through typography.

## Core Concept: Animated Font Blending

The central visual idea is to represent the surname transformation by blending two distinct typographic styles:

1.  **Stylized Font:** Represents the Client's claimed cultural origin (e.g., Arabic, Polish, Ethiopian influences). Each stylized font consists of *individual image files for each letter*.
2.  **Base Font:** A standard Hebrew block font, also composed of *individual letter images*.

The application takes the Client's original surname, renders it using the selected stylized letter images, and then animates a transition. This animation works by replacing *geometric sections* of each stylized letter image with the corresponding sections from the base letter image. These sections (cuts) are manually defined by the Designer beforehand to ensure visual coherence.

## User Roles & Flows

There are two main user roles and associated phases:

**1. The Designer (Setup Phase - Before the Exhibition)**

The Designer uses dedicated sections of the application to prepare the visual assets and configure the experience. This happens on a development machine or before locking the app for the exhibition.

* **Font Management (`/designer/fonts`):**
    * Upload individual letter images for the Base Hebrew font.
    * Upload individual letter images for various Stylized fonts.
    * Tag each Stylized font with its corresponding Culture of Origin (e.g., "Arabic", "Russian", "German"). This list populates the dropdown for the Client.
    * Use a **Visual Cutting Tool**: For each letter in a Stylized font, manually define geometric cuts (e.g., lines, rectangles) directly on the letter image. This tool should show the Base letter image alongside for alignment reference (ensuring similar size, centering) and offer a preview of the cuts.
    * Save all font data, tags, and cut definitions.
* **Animation Configuration (`/designer/animation`):**
    * Adjust parameters controlling the animation on the exhibition screen.
    * Settings include: speed of section replacement, percentage of sections to replace per letter, randomness/order of replacement.
    * Save these animation settings.

**2. The Client (Exhibition Phase - During the Exhibition)**

The Client interacts with the application displayed on a dedicated computer at the exhibition venue.

* **Exhibition Screen (`/exhibition`):**
    * Reads brief background information about the project and Hebraization.
    * Enters their *original* surname (the one used before potential Hebraization).
    * Selects their *culture of origin* from the predefined list (populated by the Designer).
    * Submits the information.
    * Watches the animation: Their surname is rendered using the chosen Stylized font's letter images, and then sections of the letters transform into the Base Hebrew font style based on the Designer's cuts and animation settings.
    * After the animation concludes, the interface likely resets for the next Client.
* **Exhibition Mode:** The application should have a mode (potentially activated via a button in the Designer interface or an environment variable) that locks it to the `/exhibition` screen. To exit this mode (e.g., for adjustments), a specific key combination (Ctrl+Ctrl+Ctrl) is required.

## Current Status (As of May 3, 2025)

* **Foundation:** The project is set up using Next.js 14+ (App Router), React, TypeScript, and Tailwind CSS. Shadcn UI is used for base UI components.
* **Routing:** Basic page components exist for the three main routes:
    * `/designer/fonts/page.tsx`
    * `/designer/animation/page.tsx`
    * `/exhibition/page.tsx`
* **API Routes:** Basic API route structure exists for handling backend logic:
    * `/api/fonts/*`: Routes for fetching font config, uploading letter images, saving font config/cuts.
    * `/api/animation/*`: Route for fetching/saving animation settings.
* **UI Components:** Some basic UI components from Shadcn UI are included, along with potential custom components (`font-list.tsx`, `font-details.tsx`) likely intended for the Font Management screen.
* **Configuration:** Placeholder or initial JSON configuration files likely exist in `/public/fonts/config.json` and `/public/animation/config.json`.
* **Core Logic:** The essential logic for the Font Management (especially the visual cutting tool), Animation Settings configuration, and the core rendering/animation on the Exhibition screen is likely **not yet fully implemented**. The existing pages and APIs provide the structure but need functional implementation.

## Project Structure Overview
```
/app                    # Next.js App Router: Pages and API routes
./app/api               # Server-side API logic
./app/designer          # Pages for the Designer interface
./app/exhibition        # Page for the Client-facing exhibition screen
./components            # Shared React components (incl. Shadcn UI)
./public                # Static assets
./public/fonts          # Stores uploaded letter images and fonts config
./public/animation      # Stores animation config
./lib                   # Utility functions and types
./hooks                 # Custom React hooks
./docs                  # Development context and documentation
```
## Key Technologies

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **UI:** React
* **Styling:** Tailwind CSS
* **UI Components:** Shadcn UI
* **Runtime:** Node.js

## Getting Started

1.  **Prerequisites:** Node.js (check `package.json` for version) and npm.
2.  **Clone:** `git clone <repository-url>`
3.  **Install Dependencies:** `cd <project-directory>` && `npm install`
4.  **Run Development Server:** `npm run dev`
5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Persistence

This project uses a simple file-based persistence mechanism suitable for its specific use case (single exhibition, pre-configuration):

* **Letter Images:** Uploaded letter images are stored directly in the `/public/fonts/` directory on the server.
* **Font Configuration:** Metadata about fonts (name, type, tag), paths to their letter images, and the defined geometric cuts for each letter are stored in `/public/fonts/config.json`.
* **Animation Configuration:** Animation parameters (speed, percentage, etc.) are stored in `/public/animation/config.json`.

**Note:** There is no database. The API routes read from and write to these files directly.

## Next Steps / Future Implementation

Based on the current status, the immediate focus should be on implementing the core functionalities:

1.  **Font Management (`/designer/fonts`):**
    * Implement file upload logic for letter images via the API.
    * Implement saving/loading of font tags via the API.
    * Develop the **Visual Cutting Tool**:
        * Use HTML Canvas or SVG for displaying letter images.
        * Implement drawing tools (lines, rectangles) on the canvas/SVG.
        * Implement the preview logic showing combined base/stylized sections.
        * Save/load cut definitions (coordinates) via the API to `fonts/config.json`.
    * Implement font deletion logic.
2.  **Animation Settings (`/designer/animation`):**
    * Create UI controls (sliders, inputs) for animation parameters.
    * Implement saving/loading of these settings via the API to `animation/config.json`.
3.  **Exhibition Screen (`/exhibition`):**
    * Implement fetching font/animation configurations from the API.
    * Develop the core rendering logic: Take the input surname, find the corresponding letter images (based on selected origin), and display them (likely using Canvas or dynamically created image elements).
    * Implement the **Animation Logic**: Based on fetched cuts and animation settings, progressively replace sections of the stylized letter images with sections from the base letter images on the Canvas/DOM.
4.  **Exhibition Mode:** Implement the screen lock and Ctrl+Ctrl+Ctrl unlock mechanism.
5.  **API Refinement:** Solidify API logic, add basic validation and error handling.
6.  **Styling & Polish:** Refine the visual appearance and user experience across all screens.

## Documentation Context

The `/docs` folder contains notes and summaries from the initial conceptualization and AI-assisted development phase (e.g., conversation summaries), which might provide additional context.
