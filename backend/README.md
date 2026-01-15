# Appointment Booking Backend API

A production-ready Node.js backend for handling appointment bookings with SQLite.

## Features

- **Check Availability**: Get available time slots for a specific date.
- **Book Appointment**: Book a slot with validation (prevents double booking and enforces 1 booking per person per day).
- **Daily Report**: View all bookings for a specific date.
- **Validation**: Ensures valid phone numbers (8 digits) and date/time formats.

## Tech Stack

- Node.js
- Express.js
- SQLite (local file-based database)

## Prerequisites

- Node.js installed on your machine.

## Setup & Run Locally

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the server:**
    ```bash
    npm start
    ```
    The server will start on `http://localhost:3000`.

4.  **Populate Sample Data (Optional):**
    If you want to add some dummy bookings to test with:
    ```bash
    node seed.js
    ```

## API Endpoints

### 1. Get Available Slots

*   **URL:** `/available-slots`
*   **Method:** `GET`
*   **Query Params:** `date=YYYY-MM-DD`
*   **Example:**
    ```
    GET http://localhost:3000/available-slots?date=2024-01-01
    ```

### 2. Book Appointment

*   **URL:** `/book-appointment`
*   **Method:** `POST`
*   **Body:**
    ```json
    {
      "customer_name": "John Doe",
      "phone_number": "12345678",
      "service_name": "Haircut",
      "date": "2024-01-01",
      "time": "10:00"
    }
    ```

### 3. Get Daily Report

*   **URL:** `/daily-report`
*   **Method:** `GET`
*   **Query Params:** `date=YYYY-MM-DD`
*   **Example:**
    ```
    GET http://localhost:3000/daily-report?date=2024-01-01
    ```

## Deployment (Render / Railway)

### Deploy to Render.com

1.  Create a new **Web Service** on Render.
2.  Connect your GitHub repository.
3.  Set the **Root Directory** to `backend`.
4.  Set the **Build Command** to `npm install`.
5.  Set the **Start Command** to `npm start`.
6.  Click **Deploy**.

> **Note on SQLite in Production:**
> Render and Railway use ephemeral file systems, meaning the SQLite `appointments.db` file will be reset every time the app redeploys. For a persistent production database, you should switch to a hosted PostgreSQL service (like Supabase, Neon, or Railway's Postgres plugin) and update `database.js` to connect to it instead.
