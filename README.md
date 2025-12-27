# Pamula Prabhu Teja - Interactive 3D Portfolio

A high-performance, immersive 3D portfolio website built with **Angular 19**, **Three.js**, and **GSAP**. This project showcases advanced frontend engineering skills, featuring a realistic interactive globe, 3D social hub, and glassmorphism UI design.

## 🚀 Tech Stack

- **Framework**: Angular 19 (Standalone Components, Signals, SSR-ready)
- **3D Engine**: Three.js
- **Animations**: GSAP (GreenSock Animation Platform) & Angular Animations
- **Styling**: SCSS (Scoped & Global)
- **State Management**: RxJS & Angular Signals

## 📂 Project Structure

### `src/app/experience`
The heart of the 3D visualizations. This module operates largely outside of Angular's Change Detection zone for maximum performance (60fps).

- **`globe-engine.service.ts`**:
    - Manages the Three.js `Scene`, `Camera`, `Renderer`, and `Lighting`.
    - Handles the **Earth Mesh**, **Atmosphere Shader**, **Clouds**, and **Starfield**.
    - Implements smooth mouse/touch interaction using Raycasting and GSAP interpolation.
    - Manages seamless camera transitions between routes (Home, Work, About, Social).

### `src/app/layout`
Contains the structural elements of the application.

- **`shell.component`**:
    - Acts as the main orchestrator.
    - Contains the **Navigation Bar** and the **Router Outlet**.
    - Manages the initial "Typewriter" loading sequence.
    - Persists the 3D Background (`<app-globe>`) across route changes to prevent re-rendering.

### `src/app/pages`
Feature-specific modules for each section of the portfolio.

- **`HomeComponent`**: A minimal landing page allowing full view of the 3D globe.
- **`AboutComponent`**:
    - Features a vertical timeline of my career/education.
    - Uses Angular Stagger Animations for a cascading entrance effect.
- **`WorkComponent`**:
    - Displays professional experience in a split-pane "Glassmorphism" layout.
    - **Anchor Pane**: Static 3D-style text for the company name.
    - **Content Pane**: Scrollable/Interactive cards detailing projects.
- **`SocialComponent`**:
    - **`SocialWorldService`**: A dedicated, separate Three.js instance for this page.
    - Features a 3D avatar orbiting with social media icons.
    - Icons react to mouse hover/touch and accelerate rotation when sending emails.
    - Integrates **EmailJS** for a functional contact form within a 3D context.

## 🌟 Key Features

1.  **Seamless Route Transitions**: The 3D camera smoothly pans and zooms to different angles of the Earth based on the active route.
2.  **Performance Optimization**:
    - Heavy 3D logic runs inside `ngZone.runOutsideAngular`.
    - "Butter-smooth" camera movement using frame-rate independent LERP.
    - Touch-action optimization for mobile devices.
3.  **Atmospheric Shader**: Custom GLSL vertex and fragment shaders to create a realistic glowing atmosphere around the Earth.
4.  **Glassmorphism UI**: High-end UI design using backdrop-filters, noise textures, and translucent gradients.

## 🛠️ Setup & Development

### Prerequisites
- Node.js (v18+)
- Angular CLI (v19+)

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install
```

### Running Locally

```bash
# Start the dev server
ng serve

# Navigate to http://localhost:4200
```

### Building for Production

```bash
ng build
```

## 📝 License
This project is created by **Pamula Prabhu Teja**. All rights reserved.
