# Requirements Specification

Mirrored from `Task/REQUIREMENTS.md` to ensure complete agent alignment.

## Core Functional Modules
1. **Authentication & Session**:
   - Secure login / registration with JWT / token handling.
   - Demo switch for instant evaluator sign-in without typing credentials.
2. **Dashboard Overview**:
   - Bento Grid with high-impact CRM KPIs: Total Pipeline Value, Active Deals, Won Rate, Total Leads.
   - Stage breakdown visualization.
   - Real-time activity timeline.
3. **Contacts / Leads Directory**:
   - Full CRUD: Add, View, Edit, Delete contacts.
   - Statuses: `New`, `Contacted`, `Qualified`, `Proposal`, `Customer`, `Churned`.
   - Search by name, company, email; Filter by status and tags.
4. **Deals & Pipeline (Interactive Kanban)**:
   - Stages: `Lead In`, `Contact Made`, `Meeting Scheduled`, `Proposal Sent`, `Negotiation`, `Won`, `Lost`.
   - Card info: Value, probability, expected close date, company, priority.
   - Drag or click to advance/regress stage with immediate update.
5. **Tasks / Reminders (Sticky Notes)**:
   - Sticky-note to-do cards with priority badges (`Urgent`, `High`, `Normal`, `Low`).
   - Checkbox toggle for completion.
   - Post-it color selection (Yellow, Pink, Green, Blue).
6. **Activity Log**:
   - Audit trail of communications (calls, emails, meetings, notes, stage transitions).
   - Filterable by type.

## Non-Functional Requirements
- **Performance**: Rust async Axum backend sub-millisecond response times.
- **Portability**: Docker containerization; does not depend on local Node.js.
- **Reliability**: Graceful error handling with descriptive JSON errors.
- **Accessibility**: Semantic HTML, visible focus states, >= 48px touch targets.
