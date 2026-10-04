# HIRE - Hotels, Inns and Restaurants Ecosystem

HIRE is a multi-role hospitality, travel, and dining ecosystem built using React, Vite, and Bootstrap. The application connects travelers, property managers, certified hospitality critics, and platform administrators into a single unified platform.

Repository: https://github.com/ryshaan1/HIRE

## Core Team

Devansh (devansh13@somaiya.edu) - Lead Architect, Admin Governance and Critic Portals. Developed the application foundation, client-side routing, shared storage layer with BroadcastChannel synchronization, administrator moderation console with multi-reason flagging and undo capabilities, and the critic editorial review system.

Ryshaan Shah (ryshaan.shah@somaiya.edu) - Venue Manager Portal and Commercial Operations. Developed dynamic rate classification for night, day, and per-dish pricing, property profile management, amenity lifecycle controls, custom amenity creation, and the canvas-based photo compressor with clipboard paste support.

Usman Kazi (usmankazi24@gmail.com) - Customer Journey, Discovery and Comparison Matrix. Developed the landing page, global navigation, multi-parameter search engine with location and budget filters, property listing cards, side-by-side venue comparison, reservation checkout, and customer grievance reporting.

## Key Platform Features

Platform Administration and Governance: Administrators can inspect property listings, enforce compliance through a multi-reason moderation system with directives for managers, verify official critic license credentials, handle unflag requests, and roll back accidental moderation actions using a reversible undo stack.

Venue Manager Console: Managers can customize base rates categorized per night, per day, or average per dish, along with secondary package tiers. They can toggle amenities, mark facilities under repair, add custom facilities with duplicate checks, author frequently asked questions, and upload venue photos using file browse or clipboard paste.

Critic Editorial Hub: Certified critics can submit license credentials for administrative approval, audit active, flagged, or banned venues, and publish weighted multi-criteria scorecards that dynamically recalculate platform ratings.

Guest Discovery and Booking Experience: Travelers can filter venues by destination city, category, cuisine, and budget range. Guests can compare two properties side-by-side, inspect photo galleries and frequently asked questions, make reservations with instant confirmation, and submit complaints to platform administrators.

## Client-Side Architecture

The application runs as a responsive single-page application without requiring an external database server. Data persistence is managed through localStorage for listings, reviews, bookings, and audit records, while sessionStorage handles active user sessions and comparison selections. Real-time updates between open browser tabs on localhost are coordinated through the HTML5 BroadcastChannel API. Photos are automatically compressed in-browser via HTML5 Canvas to keep storage well within browser quotas.

## Getting Started

Prerequisites: Node.js version 18 or higher and npm.

Installation and Setup:
Clone the repository using git clone https://github.com/ryshaan1/HIRE.git, navigate to the directory with cd HIRE, and install dependencies using npm install.

To start the local development server, run npm run dev. The application will be accessible at http://localhost:5173.

To create a production build, run npm run build.

## Demo Access Accounts

Admin Access: admin@hire.com with password admin@123 for governance, venue admissions, critic license verification, and moderation.

Critic Access: critic@hire.com with password critic@123 for professional scorecard reviews and audit inspections.

Manager Access: manager@hire.com with password manager@123 for Grand Harbour Hotel, or select any listed venue with the first three letters of the venue name followed by @123.

Customer Access: Any valid email address with any password to browse, compare, book, and submit reports.

## License

This project is licensed under the MIT License for educational and academic showcase purposes.
