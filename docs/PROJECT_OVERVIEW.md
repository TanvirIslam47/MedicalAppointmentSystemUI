# Medical Appointment System UI

## 1. Project Purpose

Medical Appointment System UI is an Angular web application for managing medical appointments and related patient visit information. It provides a browser-based interface for registering users, signing in, booking appointments, reviewing appointment records, maintaining visit details, and recording prescriptions.

This repository contains the frontend application. It communicates with a separate backend API running at `http://localhost:5265/api`.

## 2. Intended Users

### Patients and general users

- Create an account and sign in.
- Browse the appointment booking form.
- Select an appointment date, visit type, department, doctor, and patient.
- View appointment records available to their account.

### Doctors

- Review appointment records.
- Search and filter appointments.
- Update diagnoses, notes, and prescription details for visits.
- Generate a prescription report as a PDF.

### Administrators

- View appointment records across the system.
- Search and filter appointments.
- Edit appointment details.
- Delete appointments when required.

### Public visitors

- View the About page.
- Navigate to the login and signup pages.

## 3. Main Functionality

### Authentication and account management

- Signup uses a form to submit new account details to the backend.
- Login submits credentials to the backend.
- The signed-in user is stored in browser `localStorage` under the `user` key.
- `AuthService` exposes the current user through an RxJS `BehaviorSubject`.
- Logout removes the stored user and clears the current session in the UI.

### Appointment booking

The booking screen loads departments, doctors, patients, and medicines from the backend. A user can submit a new appointment through the appointment API.

### Appointment management

The appointment list supports:

- Paginated appointment retrieval.
- Search by patient-related information.
- Filtering by visit type and doctor.
- Viewing appointment information.
- Editing diagnoses, notes, and prescriptions.
- Deleting appointments for administrator users.

The appointment list changes the available actions based on the role stored in the current user object.

### Prescriptions and notifications

Doctors can enter medicine, dosage, start date, end date, and notes for prescriptions. The application uses `pdfmake` to generate a prescription PDF. `ngx-toastr` is used for success and error notifications.

## 4. Application Routes

| Route | Component | Purpose |
| --- | --- | --- |
| `/about` | `AboutComponent` | Displays application information. |
| `/appointment` | `AppointmentListComponent` | Displays and manages appointment records. |
| `/book-appointment` | `AppointmentComponent` | Provides the appointment booking form. |
| `/login` | `LoginComponent` | Signs an existing user in. |
| `/signup` | `SignupComponent` | Creates a new user account. |
| `/` | Redirect | Redirects to `/login`. |

Routes are defined in `src/app/app-routing.module.ts`.

## 5. Technology Stack

- **Angular 18** for the frontend framework.
- **TypeScript 5.5** for application code and type definitions.
- **RxJS 7.8** for observables and reactive state updates.
- **Angular Router** for page navigation.
- **Angular HttpClient** for backend API requests.
- **Angular Reactive Forms and template-driven forms** for user input.
- **SCSS** for component and global styling.
- **Bootstrap 5** and **Tailwind CSS 3** for styling utilities and layout.
- **ngx-toastr** for toast notifications.
- **pdfmake** for prescription PDF generation.
- **Jasmine, Karma, and Angular CLI** for the test and development toolchain.
- **NgModule architecture** for application and component registration.

The dependency and script definitions are in `package.json`.

## 6. Frontend Structure

```text
src/app/
  about/                 About page
  appointment/           Appointment booking
  appointment-list/      Appointment listing and management
  login/                 Login form
  navbar/                Shared navigation
  signup/                Registration form
  app-routing.module.ts  Route definitions
  app.module.ts          Root module

src/core/services/
  appointment.service.ts Appointment API and lookup operations
  auth.service.ts        Signup, login, logout, and session state
  notification.service.ts Toast notification helpers
```

### Service responsibilities

`AuthService` communicates with `/signup` and `/login`, and maintains the current user in `localStorage` and an RxJS observable.

`AppointmentService` communicates with the appointment API and provides lookup data for patients, doctors, medicines, and departments. Its appointment operations include paginated retrieval, creation, lookup by ID, update, save, and deletion.

## 7. API Integration

The frontend currently uses the following API base URL:

```text
http://localhost:5265/api
```

The services use these backend operations:

| Operation | Endpoint |
| --- | --- |
| Register | `POST /signup` |
| Login | `POST /login` |
| List patients | `GET /get-all-patients` |
| List doctors | `GET /get-all-doctors` |
| List medicines | `GET /get-all-medicines` |
| List departments | `GET /get-all-department` |
| List appointments | `GET /appointments` |
| Create appointment | `POST /appointments` |
| Get appointment | `GET /appointments/{id}` |
| Save appointment record | `POST /save-appointment` |
| Update appointment | `PUT /appointments/{id}` |
| Delete appointment | `DELETE /appointments/{id}` |

The backend must be running and accessible at this address for login, lookup, booking, and appointment management features to work.

## 8. Local Development

### Prerequisites

- Node.js and npm.
- A running backend API at `http://localhost:5265`.
- A browser supported by the installed Angular version.

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm start
```

The Angular CLI will serve the application locally, normally at `http://localhost:4200`.

### Build the application

```bash
npm run build
```

### Run tests

```bash
npm test
```

## 9. Current Limitations and Security Notes

The following points describe the current implementation and should be considered before using the application in production:

- The API URL is hard-coded in the services. There are no environment-specific API configuration files in the current frontend.
- Angular route guards are not implemented. The appointment route can be opened directly without a frontend authentication guard.
- There is no HTTP authentication interceptor. The frontend sends role and contact information as request parameters, so the backend must perform the real authorization checks.
- Role-based controls are primarily UI behavior. Hiding an edit or delete control in the frontend is not sufficient security by itself.
- The signup form allows the user to select elevated roles such as `Admin` or `Doctor`. A production backend should restrict role assignment and validate it server-side.
- The appointment list expects a valid `localStorage.user` value. Direct access without a session may not be handled gracefully.
- The department selection currently loads the available doctor list but does not visibly enforce department-based doctor filtering in the frontend.
- The login `Remember me` and `Forgot password?` controls are presentational and do not currently implement those workflows.
- The mobile navigation toggle does not currently include a complete interactive toggle behavior.
- The repository contains the Angular test setup, but application-specific test coverage is limited.

## 10. Source of Truth

This document describes behavior currently visible in the frontend code. Backend validation, authorization, database behavior, and API response contracts must be confirmed in the backend repository or API documentation before production deployment.