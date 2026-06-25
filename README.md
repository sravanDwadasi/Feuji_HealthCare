# Feuji Healthcare Connector Platform

## Overview

The Healthcare Connector Platform is a microservices-based application developed to streamline communication between healthcare providers and payers during the authorization process.

Traditional authorization workflows often involve incomplete requests, resulting in repeated communication between providers and payers. This solution introduces an **AI Copilot powered by Google Gemini**, which reviews authorization requests before submission and provides intelligent recommendations to help providers identify missing information, improve clinical documentation, and reduce authorization rework.

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
│   └── Integrates with Google Gemini AI for intelligent authorization review
│
└── UI
    └── healthcare-ui
        └── React frontend application
```

---

# Technology Stack

## Backend

* Java 21
* Spring Boot
* Spring Data JPA
* MySQL
* REST APIs
* Maven

## Frontend

* React
* Bootstrap

## AI

* Google Gemini 2.5 Flash API
* REST Integration

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

* Integrates with Google Gemini AI
* Reviews authorization requests before submission
* Identifies missing mandatory information
* Evaluates clinical notes
* Provides intelligent recommendations
* Determines whether the request is ready for submission

Instead of predefined validation rules, the AI Service communicates with Google Gemini and generates contextual recommendations based on the authorization request.
### In application.properties user need's to add a newly generated API KEY.
* gemini.api.key= API-KEY
* **Link to generate API Key:** https://aistudio.google.com/api-keys?project=gen-lang-client-0047636997
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

## AI Copilot Workflow

1. Provider creates an authorization request.
2. Provider clicks **AI Review**.
3. Provider Service sends the request to the AI Service.
4. AI Service forwards the request to Google Gemini.
5. Google Gemini analyzes the request.
6. AI recommendations are returned to the Provider Service.
7. Provider updates the request if required.
8. Provider submits the request to the Payer Service.

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

Successful Flow

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

Rejection Flow

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

Create the following databases before starting the services.

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

Start the services in the following order.

### AI Service

```bash
cd ai-service

mvn spring-boot:run
```

Runs on

```text
http://localhost:8082
```

---

### Payer Service

```bash
cd payer-service

mvn spring-boot:run
```

Runs on

```text
http://localhost:8083
```

---

### Provider Service

```bash
cd provider-service

mvn spring-boot:run
```

Runs on

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

Frontend URL

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

### Sample Response

```json
{
  "id": 1,
  "status": "DRAFT",
  "aiRecommendation": "Summary:\nThe authorization request is incomplete.\n\nMissing Information:\nInsurance ID\n\nClinical Notes Review:\nClinical notes should include symptoms, duration and medical necessity.\n\nRecommendations:\n• Add the Insurance ID.\n• Expand the clinical notes with additional clinical details.\n• Review the request before submission.\n\nReady For Submission:\nNO"
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
  "clinicalNotes": "Patient has severe lower back pain for three weeks. Conservative treatment has failed. MRI requested to evaluate lumbar disc pathology."
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

The request is forwarded to the Payer Service and the status changes to **UNDER_REVIEW**.

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

1. Create an authorization request with incomplete information.
2. Click **AI Review**.
3. Verify that Google Gemini AI identifies missing information and provides recommendations.
4. Update the authorization request.
5. Run AI Review again.
6. Verify that the AI indicates the request is ready for submission.
7. Submit the request.
8. Verify the request status changes to **UNDER_REVIEW**.
9. Open the Payer Dashboard.
10. Approve the request.
11. Verify the Provider dashboard displays the status as **APPROVED**.
12. Verify a notification is generated.

---

## Scenario 2 - Rejection Flow

1. Create an authorization request.
2. Review the request using AI Copilot.
3. Submit the request.
4. Open the Payer Dashboard.
5. Reject the request with comments.
6. Verify the Provider dashboard displays the status as **REJECTED**.
7. Verify a notification is generated.
8. Edit the request.
9. Run AI Review again.
10. Resubmit the request.

---

# Features Implemented

* Authorization Request Management
* Google Gemini AI Copilot Integration
* Intelligent AI-Based Authorization Review
* Authorization Request Update Workflow
* Provider-Payer Communication
* Approval Workflow
* Rejection Workflow
* Request Status Tracking
* Notification Management
* React Frontend
* Spring Boot Microservices
* MySQL Persistence
* REST-Based Service Communication
* End-to-End Authorization Lifecycle
