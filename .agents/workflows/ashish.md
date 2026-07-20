---
description: framer website
---

# MASTER EXECUTION WORKFLOW
Role: Expert Senior Frontend Engineer & UI/UX Specialist
Task: Build a high-end, ultra-responsive minimalist portfolio website from scratch with premium micro-interactions.

Tech Stack & Libraries:
- React (Vite)
- Tailwind CSS (Styling)
- Framer Motion (Animations, Parallax, Magnetic buttons, Custom cursor)
- @studio-freight/react-lenis (Smooth inertia scrolling)
- Lucide React (SVG Icons)
- Web3Forms or EmailJS (Serverless contact form handling)

Design System & Aesthetic:
- Theme: Strict dark mode (`bg-black`), ambient SVG grain overlay, subtle mouse-following radial glow.
- Typography: Clean, geometric sans-serif with heavy uppercase tracking for subheadings.
- Interactivity: Custom trailing dot cursor that expands on hover states.

## PHASE 1: Discovery & Initialization (HALT AND ASK)
Before writing any code or running any commands, you MUST ask the user the following clarifying questions:
1. "What should the target root directory/folder name be?"
2. "Do you have a preference between Web3Forms or EmailJS for the functional contact form?"
3. "Please upload any reference photos, screenshots of the original Framer site, or Figma mockups. I will use my vision capabilities to analyze these images and match the exact colors, typography scale, and spatial layout."
*Wait for the user's response and image uploads before proceeding to Phase 2.*

## PHASE 2: Environment Setup & Scaffolding
Once the user answers Phase 1, execute the setup:
1. Initialize the project: `npm create vite@latest . -- --template react`.
2. Install standard dependencies: `npm install`
3. Install styling & animation tools: `npm install tailwindcss postcss autoprefixer framer-motion lucide-react @studio-freight/react-lenis clsx tailwind-merge`
4. Initialize Tailwind: `npx tailwindcss init -p` and configure `tailwind.config.js` for the strict dark mode theme.
5. Create the modular architecture: `/src/components`, `/src/layouts`, `/src/hooks`, `/src/assets`, `/src/utils`.
6. Setup global `Lenis` smooth scrolling wrapper in `App.jsx`.

## PHASE 3: Component Development (Iterative Execution)
Build the architecture in batches. Render the UI in the integrated browser after each batch.
- Batch 1 (Core & Hero): 
  - `CustomCursor.jsx`: Trailing dot pointer.
  - `Navbar.jsx`: Fixed header with a live IST (Indian Standard Time) clock + local weather badge. Include a magnetic hover effect on the "CONTACT NOW" button.
  - `HeroSection.jsx`: Massive scaling text, ambient background grain.
- Batch 2 (Showcase): 
  - `ApproachSection.jsx`: 3-step process layout.
  - `LogoMarquee.jsx`: Infinite scrolling client logos.
  - `PortfolioGrid.jsx` & `CaseStudyDrawer.jsx`: Grid of projects. Clicking a project slides out a deep-dive details drawer.
- Batch 3 (Social Proof & Footer): 
  - `AboutSection.jsx`: Massive header with overlapping portrait placeholders.
  - `StatsGrid.jsx`: Responsive layout for key metrics.
  - `TestimonialMarquee.jsx`: Infinite scroll cards.
  - `FAQ.jsx`: Framer Motion animated accordion.
  - `Footer.jsx`: Massive "LET'S WORK TOGETHER" text. Include `ContactModal.jsx` (functional form with validation) and `ResumeViewer.jsx` (PDF overlay).

## PHASE 4: Responsiveness Audit (All Viewports)
Once all components are built, perform a strict CSS audit:
1. Mobile-First: Ensure base Tailwind classes look perfect on 320px-400px screens.
2. Tablet (`md:`): Adjust layouts for 768px screens.
3. Desktop & Ultrawide (`lg:`, `xl:`, `2xl:`): Ensure maximum widths are set (e.g., `max-w-7xl mx-auto`) so the UI does not stretch infinitely on large monitors. Remove any hardcoded pixel widths (e.g., `w-[1920px]`).

## PHASE 5: SEO, Security & Performance Audit
Before final delivery, implement the following:
1. SEO & Meta Tags: Add `<title>`, custom Open Graph (OG) tags, and standard meta descriptions in `index.html`. Add JSON-LD schema for a "Person/Designer".
2. Security: Ensure all external links use `target="_blank" rel="noopener noreferrer"`.
3. Performance: Implement React `lazy()` for the Case Study Drawers and Contact Modal so they don't block the initial load. Ensure Framer Motion uses hardware-accelerated properties (`transform`, `opacity`).

## PHASE 6: Final Handoff
1. Start the development server using `npm run dev`.
2. Present a summary of the completed architecture.
3. Provide the user with exact commands to deploy to Vercel (`vercel`) or Netlify (`netlify deploy`).
4. Ask the user: "The premium build is complete. Would you like to review the live preview, or should we fine-tune any specific animations or breakpoints?"