# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## Project Architecture Additions

To prepare for Firebase integration and an admin dashboard, the following folders have been added:

- `src/services/` – network or backend services (Firebase wrappers will live here)
- `src/hooks/` – reusable custom React hooks (e.g. `useAuth`, `useLoading`)
- `src/context/` – global state providers (an `AppContext` handles loading and user state)
- `src/utils/` – generic helper functions and utilities
- `src/constants/` – shared constants such as route names and configuration keys
- `src/admin/` – placeholder for future protected dashboard components

A basic Firebase service skeleton (`firebaseConfig.js`, `authService.js`, `databaseService.js`) has been created with environment-variable placeholders. `AppContext` is wired up around the router in `App.jsx`, and a `ProtectedRoute` component skeleton exists to guard admin pages.

No existing UI components were modified; these changes are architectural and backward-compatible with your current routes and layout.

The `AppContext` now provides a `globalLoading` flag and a `GlobalLoader` component which is rendered in `Layout.jsx`. When any page sets `globalLoading` to `true` (e.g. during data fetching in `Home.jsx`), a full-screen semi-transparent overlay with a spinner appears above the normal UI.

### UI / UX Upgrades

The front end has been enhanced with a professional NGO-style design system:

- **Typography**: improved hierarchy and custom fonts (`Poppins` for headings, `Inter` for body). Headings and paragraphs use `text-dark` or appropriate off-white hues to ensure readable contrast on themed backgrounds.
- **Color palette**: refined palette built around the logo’s warm brown/gold; includes deep trust blue, warm cream, soft gold, neutral light, and muted brown accents. Multiple background utilities support immersive page tones.
- **Immersive backgrounds**: each page now applies a full-viewport background via `Layout` (never leaving blank white space). Gradients and subtle radial glows are used sparingly for emotional warmth and focus.
- **Spacing**: consistent `py-24`, `px-6` rhythm and extended Tailwind scale.
- **Buttons**: primary buttons use trust blue, secondary use warm gold; hover states darken slightly and scale up. Central `Button` component includes ripple effect.
- **Navbar**: glass blur background, animated underline for active links, smooth mobile menu. Logo integrates the brown/gold tones.
- **Page transitions**: upgraded Framer Motion enter/exit animations.
- **Scroll interactions**: progress indicator at top, staggered section reveals, image zoom on hover.
- **Team section**: interactive member grid with modal details using shared layout animations.
- **Impact map**: map embed with animated markers and regional counters.
- **Donation CTA**: animated gradient background, trust badges, strong call to action.
- **Global loader & scroll restoration**: across all pages.

- **Donation page overhaul**: new payment options (UPI QR, card form, net banking), animated impact transparency cards, navy/sky-blue gradient with gold CTA accents.
- **Events cards**: now show images, elevate on hover, and reveal extra details via a smooth slide-up animation when clicked.
- **Trust member cards**: replaced modal interaction with 3D flip cards featuring tagline overlays and back-side bio/socials.
- **Contact page**: added Instagram/LinkedIn/email/phone icons with hover/tap animations for stronger user engagement.
- **Footer**: quick links are real `NavLink` elements with underline animation and opacity transitions.

Color psychology guide followed:
- Trust & Stability → muted navy/deep blue (`trustBlue`)
- Warmth & Humanity → soft cream (`warmCream`)
- Encouragement & Action → warm gold (`softGold`)
- Credibility → clean white for cards/content
- Emotional comfort → subtle radial gradients
- Logo brown used as small accents (borders, underlines)

These stylistic changes are applied without altering routing or component
structure, keeping the site architecture intact while delivering a cohesive,
trustworthy, emotionally warm visual experience.

# 🌟 KVG Trust Platform – Frontend

> Frontend application for the **KVG Trust Platform**, developed using React to provide a modern, responsive, and user-friendly interface for volunteers, donors, members, and administrators.

---

## 🚀 Overview

The KVG Trust Platform Frontend is designed to digitize the operations of K V G Shanmukh Sai Trust by providing an intuitive web interface for community engagement, volunteer management, event participation, online donations, and administrative operations.

This application communicates with the Spring Boot backend through REST APIs and delivers a seamless experience across desktop and mobile devices.

---

## 🔗 Related Repository

**Backend Repository:**
https://github.com/kvgshanmukhsaitrust-ops/trust-backend

---

## ✨ Features

### 🌍 Public Website

* Responsive Home Page
* About Us
* Vision & Mission
* Trust History
* Success Stories
* Impact Statistics
* Team Members
* Gallery
* Contact Page

### 📅 Events

* Upcoming Events
* Completed Events
* Event Details
* Volunteer Registration

### ❤️ Donations

* Online Donation Portal
* Razorpay Payment Integration
* Donation Success & Failure Pages

### 👥 User Features

* Registration
* Login
* Google OAuth Login
* User Dashboard
* Profile Management

### 🛠 Admin Portal

* Dashboard
* Event Management
* Volunteer Management
* Member Management
* CMS
* Donation Monitoring
* Website Content Management

---

## 🛠 Tech Stack

* React.js
* JavaScript
* Material UI (MUI)
* HTML5
* CSS3
* Axios
* React Router

---

## 📂 Project Structure

```
src/
├── components/
├── pages/
├── services/
├── hooks/
├── utils/
├── assets/
└── layouts/
```

---

## ⚙️ Getting Started

### Clone the Repository

```bash
git clone https://github.com/Rohith-vijay/trust_frontend.git
```

### Install Dependencies

```bash
npm install
```

### Run the Development Server

```bash
npm start
```

The application will be available at:

```
http://localhost:3000
```

---

## 🌐 Live Demo

Frontend:

https://trust-frontend-git-main-rtesting.vercel.app/

> **Note:** The backend deployment may be temporarily unavailable if the hosting service is inactive.

---

## 🚀 Future Enhancements

* AI-powered Volunteer Assistant
* Multi-language Support
* Progressive Web App (PWA)
* Improved Analytics Dashboard
* Accessibility Enhancements
* Performance Optimization

---

## 👨‍💻 Developer

**Rohith Vijay**

B.Tech Computer Science Engineering (Generative AI)

KL University

Vice President — K V G Shanmukh Sai Trust

---

## 📄 License

This project is developed for **K V G Shanmukh Sai Trust** as part of its digital transformation initiative.
