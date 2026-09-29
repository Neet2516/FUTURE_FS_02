# API Contract: PaperCRM RESTful Endpoints

Base URL: `/api`
Default Header: `Content-Type: application/json`
Auth Header: `Authorization: Bearer <token>`

---

## 1. Authentication (`/api/auth`)

### `POST /api/auth/register`
- **Request**:
  ```json
  {
    "name": "Sarah Miller",
    "email": "sarah@papercrm.io",
    "password": "Password123!",
    "role": "Sales Rep"
  }
  ```
- **Response** (201 Created):
  ```json
  {
    "token": "jwt-token-string",
    "user": {
      "id": "usr_123",
      "name": "Sarah Miller",
      "email": "sarah@papercrm.io",
      "role": "Sales Rep"
    }
  }
  ```

### `POST /api/auth/login`
- **Request**:
  ```json
  {
    "email": "sarah@papercrm.io",
    "password": "Password123!"
  }
  ```
- **Response** (200 OK):
  ```json
  {
    "token": "jwt-token-string",
    "user": {
      "id": "usr_123",
      "name": "Sarah Miller",
      "email": "sarah@papercrm.io",
      "role": "Sales Rep"
    }
  }
  ```

### `GET /api/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response** (200 OK):
  ```json
  {
    "user": {
      "id": "usr_123",
      "name": "Sarah Miller",
      "email": "sarah@papercrm.io",
      "role": "Sales Rep"
    }
  }
  ```

---

## 2. Dashboard (`/api/dashboard`)

### `GET /api/dashboard/stats`
- **Response** (200 OK):
  ```json
  {
    "total_pipeline_value": 485000.0,
    "active_deals_count": 18,
    "won_deals_count": 8,
    "win_rate_percentage": 68.5,
    "total_contacts_count": 42,
    "pending_tasks_count": 7,
    "completed_tasks_count": 23,
    "stage_breakdown": [
      { "stage": "Lead In", "count": 5, "value": 75000.0 },
      { "stage": "Contact Made", "count": 4, "value": 90000.0 },
      { "stage": "Meeting Scheduled", "count": 3, "value": 110000.0 },
      { "stage": "Proposal Sent", "count": 3, "value": 125000.0 },
      { "stage": "Negotiation", "count": 2, "value": 65000.0 },
      { "stage": "Won", "count": 8, "value": 240000.0 },
      { "stage": "Lost", "count": 2, "value": 30000.0 }
    ]
  }
  ```

---

## 3. Contacts / Leads (`/api/contacts`)

### `GET /api/contacts?search=&status=&tag=`
- **Response** (200 OK):
  ```json
  [
    {
      "id": "ct_001",
      "name": "Jane Cooper",
      "company": "Acme Dynamics",
      "title": "VP of Technology",
      "email": "jane@acmedynamics.com",
      "phone": "+1 (555) 234-5678",
      "status": "Qualified",
      "lead_value": 35000.0,
      "tags": ["Enterprise", "SaaS"],
      "notes": "Looking for high-concurrency CRM backend.",
      "created_at": "2026-09-20T10:00:00Z"
    }
  ]
  ```

### `POST /api/contacts`
- **Request**:
  ```json
  {
    "name": "Jane Cooper",
    "company": "Acme Dynamics",
    "title": "VP of Technology",
    "email": "jane@acmedynamics.com",
    "phone": "+1 (555) 234-5678",
    "status": "Qualified",
    "lead_value": 35000.0,
    "tags": ["Enterprise"],
    "notes": "Met at Tech Summit."
  }
  ```
- **Response** (201 Created): Returns created contact object.

### `GET /api/contacts/:id`
- **Response** (200 OK): Returns contact with associated deals and activity logs.

### `PUT /api/contacts/:id`
- **Request**: Partial or complete update fields.
- **Response** (200 OK): Returns updated contact.

### `DELETE /api/contacts/:id`
- **Response** (204 No Content)

---

## 4. Deals & Pipeline (`/api/deals`)

### `GET /api/deals`
- **Response** (200 OK):
  ```json
  [
    {
      "id": "dl_001",
      "title": "Enterprise Cloud Migration",
      "company": "Acme Dynamics",
      "contact_id": "ct_001",
      "contact_name": "Jane Cooper",
      "stage": "Proposal Sent",
      "value": 45000.0,
      "probability": 75,
      "priority": "High",
      "expected_close": "2026-10-15",
      "notes": "Sent customized pricing proposal."
    }
  ]
  ```

### `POST /api/deals`
- **Request**:
  ```json
  {
    "title": "Quarterly Expansion Deal",
    "company": "Starlight Ventures",
    "contact_id": "ct_002",
    "stage": "Lead In",
    "value": 20000.0,
    "probability": 30,
    "priority": "Medium",
    "expected_close": "2026-11-01",
    "notes": "Inbound inquiry via website."
  }
  ```
- **Response** (201 Created): Created deal.

### `PUT /api/deals/:id/stage`
- **Request**:
  ```json
  {
    "stage": "Negotiation"
  }
  ```
- **Response** (200 OK): Updated deal.

### `PUT /api/deals/:id`
- **Request**: Updates deal metadata.
- **Response** (200 OK): Updated deal.

### `DELETE /api/deals/:id`
- **Response** (204 No Content)

---

## 5. Tasks (`/api/tasks`)

### `GET /api/tasks`
- **Response** (200 OK):
  ```json
  [
    {
      "id": "tsk_001",
      "title": "Prepare Enterprise SLA Document",
      "due_date": "2026-09-30",
      "priority": "Urgent",
      "completed": false,
      "color": "yellow",
      "associated_type": "deal",
      "associated_id": "dl_001"
    }
  ]
  ```

### `POST /api/tasks`
- **Request**: Task fields.
- **Response** (201 Created)

### `PUT /api/tasks/:id`
- **Request**: Task fields or `{"completed": true}`
- **Response** (200 OK)

### `DELETE /api/tasks/:id`
- **Response** (204 No Content)

---

## 6. Activities (`/api/activities`)

### `GET /api/activities?limit=20`
- **Response** (200 OK): List of recent activities.

### `POST /api/activities`
- **Request**:
  ```json
  {
    "activity_type": "Call",
    "description": "Discussed SLA terms with Jane Cooper",
    "contact_id": "ct_001",
    "deal_id": "dl_001"
  }
  ```
- **Response** (201 Created)
