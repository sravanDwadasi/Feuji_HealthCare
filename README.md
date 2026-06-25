# Feuji Healthcare Connector Platform

## Overview

The Healthcare Connector Platform is a microservices-based application developed to streamline communication between healthcare providers and payers during the authorization process.

Traditional authorization workflows often involve incomplete requests, resulting in repeated communication between providers and payers. This solution introduces an AI Copilot that validates authorization requests before submission, helping providers identify and correct missing information early in the process.

The application consists of three Spring Boot microservices and a React-based frontend.

---

# Repository Structure

```text
Feuji_HealthCare
│
├── provider-service
│   └── Handles provider operations, request management and notifications
│
├── payer-service
│   └── Handles authorization review, approval and rejection
│
├── ai-service
│   └── Provides AI-based request validation and recommendations
│
└── UI
    └── healthcare-ui
        └── React frontend application
```

---

# Technology Stack

## Backend

* Java 17
* Spring Boot
* Spring Data JPA
* MySQL
* REST APIs
* Maven

## Frontend

* React
* Bootstrap

## Database

* MySQL

---

# Microservices

## Provider Service

Port: **8081**

Responsibilities:

* Create authorization requests
* Update authorization requests
* Integrate with AI Copilot
* Submit requests to payer
* Track request status
* Manage notifications

---

## AI Service

Port: **8082**

Responsibilities:

* Review authorization requests
* Detect missing information
* Recommend corrections before submission

Example recommendations:

* Insurance ID is missing
* Clinical Notes are missing
* Request looks good. Ready for submission

---

## Payer Service

Port: **8083**

Responsibilities:

* Receive authorization requests
* Review requests
* Approve requests
* Reject requests
* Notify Provider Service of status updates

---

# Application Workflow

## Provider Workflow

1. Create Authorization Request
2. Review Request using AI Copilot
3. View AI Recommendations
4. Update Request if required
5. Submit Request to Payer

---

## Payer Workflow

1. View Submitted Requests
2. Approve Request

OR

3. Reject Request with comments

---

## Notification Workflow

Whenever a request status changes:

* UNDER_REVIEW
* APPROVED
* REJECTED

A notification is automatically created and displayed in the Provider application.

---

# Request Lifecycle

Successful Flow:

```text
DRAFT
   ↓
AI REVIEW
   ↓
SUBMITTED
   ↓
UNDER_REVIEW
   ↓
APPROVED
```

Rejection Flow:

```text
DRAFT
   ↓
AI REVIEW
   ↓
SUBMITTED
   ↓
UNDER_REVIEW
   ↓
REJECTED
   ↓
EDIT
   ↓
AI REVIEW
   ↓
RESUBMIT
```

---

# Service URLs

## Provider Service

```text
http://localhost:8081
```

## AI Service

```text
http://localhost:8082
```

## Payer Service

```text
http://localhost:8083
```

## React UI

```text
http://localhost:5173
```

---

# Database Setup

Create the following databases before starting the services:

```sql
CREATE DATABASE provider_db;

CREATE DATABASE payer_db;
```

Update MySQL credentials in each service's `application.properties` file if required.

---

# Running the Application

## Step 1 - Start MySQL

Ensure MySQL is running and the required databases are created.

---

## Step 2 - Start Backend Services

Start the services in the following order:

### AI Service

```bash
cd ai-service
mvn spring-boot:run
```

Runs on:

```text
http://localhost:8082
```

---

### Payer Service

```bash
cd payer-service
mvn spring-boot:run
```

Runs on:

```text
http://localhost:8083
```

---

### Provider Service

```bash
cd provider-service
mvn spring-boot:run
```

Runs on:

```text
http://localhost:8081
```

---

## Step 3 - Start Frontend

```bash
cd UI/healthcare-ui

npm install

npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

# API Reference

## 1. Create Authorization Request

### Request

```http
POST http://localhost:8081/provider/requests
```

```json
{
  "patientName": "John",
  "insuranceId": "",
  "diagnosisCode": "D001",
  "procedureCode": "MRI001",
  "clinicalNotes": "Back Pain"
}
```

### Response

```json
{
  "id": 1,
  "patientName": "John",
  "insuranceId": "",
  "diagnosisCode": "D001",
  "procedureCode": "MRI001",
  "clinicalNotes": "Back Pain",
  "status": "DRAFT"
}
```

---

## 2. Review Request Using AI Copilot

### Request

```http
POST http://localhost:8081/provider/requests/1/review
```

### Response

```json
{
  "id": 1,
  "status": "DRAFT",
  "aiRecommendation": "Insurance ID is missing."
}
```

---

## 3. Update Authorization Request

### Request

```http
PUT http://localhost:8081/provider/requests/1
```

```json
{
  "patientName": "John",
  "insuranceId": "INS123",
  "diagnosisCode": "D001",
  "procedureCode": "MRI001",
  "clinicalNotes": "Back Pain"
}
```

### Response

```json
{
  "id": 1,
  "status": "DRAFT"
}
```

---

## 4. Submit Authorization Request

### Request

```http
POST http://localhost:8081/provider/requests/1/submit
```

### Response

Request is forwarded to the Payer Service and status is updated.

---

## 5. Get All Provider Requests

### Request

```http
GET http://localhost:8081/provider/requests
```

---

## 6. Get Notifications

### Request

```http
GET http://localhost:8081/provider/notifications
```

### Sample Response

```json
[
  {
    "id": 1,
    "requestId": 1,
    "message": "Request APPROVED : Authorization Approved"
  }
]
```

---

## 7. Get Payer Requests

### Request

```http
GET http://localhost:8083/payer/requests
```

---

## 8. Approve Request

### Request

```http
PUT http://localhost:8083/payer/requests/1/approve
```

### Response

```json
{
  "status": "APPROVED"
}
```

---

## 9. Reject Request

### Request

```http
PUT http://localhost:8083/payer/requests/1/reject
```

```json
{
  "comments": "Missing supporting documents"
}
```

### Response

```json
{
  "status": "REJECTED",
  "comments": "Missing supporting documents"
}
```

---

# Validation Scenarios

## Scenario 1 - Successful Approval Flow

1. Create a request without Insurance ID.
2. Review the request using AI Copilot.
3. Verify AI recommends adding Insurance ID.
4. Edit and update the request.
5. Review again.
6. Verify AI recommendation says request is ready.
7. Submit request.
8. Verify status becomes UNDER_REVIEW.
9. Open Payer Dashboard.
10. Approve request.
11. Verify Provider status becomes APPROVED.
12. Verify notification is generated.

---

## Scenario 2 - Rejection Flow

1. Create request.
2. Review using AI.
3. Submit request.
4. Open Payer Dashboard.
5. Reject request with comments.
6. Verify status becomes REJECTED.
7. Verify notification is generated.
8. Edit request.
9. Review again.
10. Resubmit request.

---

# Features Implemented

* Authorization Request Management
* AI Copilot Validation
* Request Update Workflow
* Provider-Payer Communication
* Approval Workflow
* Rejection Workflow
* Status Tracking
* Notification Management
* React Frontend
* Spring Boot Microservices
* MySQL Persistence
* REST-Based Communication
* End-to-End Authorization Lifecycle
