# Task Specification: Hand-Drawn Sketchbook Rust CRM (PaperCRM)

## 1. Project Overview
**PaperCRM** is an enterprise-grade Customer Relationship Management (CRM) platform featuring a unique, playful **Hand-Drawn Sketchbook / Paper** aesthetic. It combines robust backend systems engineering (Rust + Axum + SQLx + SQLite) with an expressive, tactile, human-crafted React frontend powered by custom-adapted Aceternity UI components.

## 2. Functional Requirements

### 2.1 Authentication & Profile
- **User Authentication**: Secure signup and login with token/session credentials.
- **User Profile**: Display current active user, role (Sales Rep, Account Executive, Manager), avatar scribble, and settings.
- **Mock / Quick-Switch Demo**: In addition to standard credentials, provide one-click demo login accounts (e.g., "Sarah - Lead Sales Rep", "Alex - Sales Director") for instant evaluation.

### 2.2 Dashboard & Analytics
- **Executive Summary Bento Grid**:
  - Total Pipeline Value ($) with month-over-month growth.
  - Active Deals count and Win Rate percentage.
  - New Contacts / Leads acquired this month.
  - Tasks Pending vs. Completed today.
- **Visual Hand-Drawn Charts**:
  - Monthly Deal Flow / Pipeline breakdown by stage.
  - Revenue target milestone thermometer/meter.
- **Recent Activity Feed**:
  - Chronological stream of calls, notes, emails, and deal stage transitions.
- **Quick Action Bar**:
  - Quick Add Lead, Quick Add Deal, Quick Add Task directly from dashboard.

### 2.3 Contacts & Leads Management
- **Contact Directory**:
  - Searchable, filterable list of all business contacts and leads.
  - Attributes: Name, Company, Email, Phone, Title, Lead Status (`New`, `Contacted`, `Qualified`, `Proposal`, `Customer`, `Churned`), Value, Tags, Assigned Rep, Avatar/Color.
- **Contact Details View**:
  - Full profile card with editable contact information.
  - Attached Notes and Activity Timeline.
  - Associated Deals.
- **CRUD Operations**:
  - Create new contact with validation.
  - Update details inline or via modal.
  - Delete with confirmation.
  - Status filter pill tabs.

### 2.4 Deals & Pipeline (Kanban Board)
- **Visual Pipeline Stages**:
  1. `Lead In` (New opportunities)
  2. `Contact Made` (Discovery / initial meeting)
  3. `Meeting Scheduled` (Product demo / presentation)
  4. `Proposal Sent` (Pricing & quote delivered)
  5. `Negotiation` (Contract review)
  6. `Won` (Closed won - celebrated!)
  7. `Lost` (Closed lost - archive)
- **Kanban Card Details**:
  - Deal Title, Company, Value ($), Contact Person, Close Probability (%), Expected Close Date, Priority (`Low`, `Medium`, `High`, `Urgent`).
- **Interactive Stage Transitions**:
  - Ability to move deals between stages (drag-and-drop or select stage).
  - Stage column headers showing deal count and total cumulative value.
- **Deal Modals**:
  - Add new deal with association to contact and company.
  - Edit deal details and financial metrics.

### 2.5 Tasks & Reminders (Sticky Notes)
- **To-Do Management**:
  - Create, complete, and prioritize tasks (Follow-up call, Send contract, Prepare deck, Quarterly check-in).
  - Due date tracking with badges (`Overdue`, `Today`, `Upcoming`).
  - Categorized as Post-It / Sticky Notes with color options (Yellow, Pink, Mint, Blue).
  - Toggle completion status with hand-drawn checklist tick.

### 2.6 Activity & Interaction Log
- **Comprehensive Audit Log**:
  - Record calls, meetings, notes, status changes, and deal creations.
  - Filter by activity type (`Call`, `Email`, `Meeting`, `Note`, `Stage Change`).

## 3. Visual & Aesthetic Requirements
- **Theme**: Hand-Drawn Sketchbook / Paper / Tactile Human Craftsmanship.
- **Primary Color Tokens**:
  - Background: `#fdfbf7` (Warm cream sketchbook paper)
  - Foreground / Ink: `#2d2d2d` (Charcoal pencil / fountain pen ink)
  - Muted: `#e5e0d8` (Draft pencil lines / grid dots)
  - Accent Red: `#ff4d4d` (Red pen circle / highlighter / stamp)
  - Border: `#2d2d2d` (2px solid ink outline)
  - Secondary Blue: `#2d5da1` (Ballpoint blue ink)
  - Post-it Yellow: `#fff9c4` (Classic Post-It note)
- **Typography**:
  - Headings: `Kalam`, cursive, bold 700.
  - Body: `Patrick Hand`, casual handwriting, 400.
- **Borders & Shadows**:
  - Wobbly border-radius utilities (`255px 15px 225px 15px / 15px 225px 15px 255px`).
  - Hard ink drop-shadows: `4px 4px 0px 0px #2d2d2d` and `8px 8px 0px 0px #2d2d2d`.
  - Tactile button press on active: translates `translate-x-[2px] translate-y-[2px]` and reduces shadow.
- **Textures & Annotations**:
  - Notebook dot-grid paper background.
  - Washi tape strips on card corners.
  - Sticky-notes tilted by 1-2 degrees.
  - Hand-drawn scribble underlines, badges, and sketch arrows.
- **Aceternity UI Adaptations**:
  - Bento Grid adapted to sketchbook paper cards.
  - Card Spotlight adapted to warm graphite pencil glow.
  - Animated Tabs styled as physical notebook tabs.

## 4. Technical Requirements
- **Frontend**: React + Vite + Tailwind CSS + Lucide React + custom Aceternity UI components.
- **Backend**: Rust + Axum + Tokio + SQLx + SQLite + Serde + Tower HTTP (CORS, Trace).
- **Docker**:
  - `frontend/Dockerfile` supporting development & build.
  - `backend/Dockerfile` multi-stage optimized Rust binary.
  - Root `docker-compose.yml` linking frontend (port 5173) and backend (port 8080).
- **Seed Data**: Pre-loaded realistic CRM database with 15+ contacts, 12+ deals across all stages, tasks, and activities.
