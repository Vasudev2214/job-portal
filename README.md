Here's a sample README file for your GitHub repository:

---

# Job Portal API & Frontend

## Project Overview

This project is a **Job Portal Application** developed with **Next.js** (TypeScript) for the frontend and **Node.js** with **Express.js**, **Prisma**, and **MySQL** for the backend. The application allows users to create accounts, manage their profiles, upload and delete resumes, and apply for jobs. HR personnel can manage job listings, track applications, and send notifications to users.

The project is structured in two main parts:
1. **Backend (API)** – Handles the business logic, user authentication, job management, and data storage.
2. **Frontend** – Provides an intuitive user interface to interact with the API, manage user profiles, and apply for jobs.

## Features

### User Features:
- **User Registration & Authentication**: Users can register, log in, and securely manage their session.
- **Profile Management**: Users can edit their profiles and upload a resume using coludinary for storage.
- **Job Applications**: Users can apply for jobs, view job details, and track application statuses.
- **Password Management**: Users can change their password securely.


### Admin Features:
- **Job Listing Management**: Admins can create.
- **Application Status Tracking**: Admins can update application statuses to track stages like "Under Review", "Shortlisted", and "Rejected".
- **Email Notifications**: Admins can notify users about job updates.

### Security:
- **JWT Authentication**: Users and admins authenticate using JWT (JSON Web Tokens) for secure communication.
- **Password Hashing**: Passwords are securely hashed using **bcryptjs**.
- **Authorization Middleware**: Ensures that users and admins have the correct permissions to access certain features.

### Tech Stack:
- **Frontend**: Next.js, TypeScript, React
- **Backend**: Node.js, Express.js, Prisma, MySQL
- **Authentication**: JWT (JSON Web Token)
- **File Storage**: Amazon S3 (for storing resumes)
- **Database**: MySQL (via Prisma ORM)

## Setup Instructions

### 1. Clone the Repository:
```bash
git clone https://github.com/Vasudev2214/job-portal.git
```

### 2. Backend Setup:
#### Prerequisites:
- Node.js (v14 or higher)
- MySQL Database

#### Steps:
1. Navigate to the `job-portal-api` directory:
   ```bash
   cd job-portal-api
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file at the root of the backend project and add the following environment variables:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your-database-password
   DB_NAME=job_portal
   JWT_SECRET=your-jwt-secret
   AWS_ACCESS_KEY=your-aws-access-key
   AWS_SECRET_KEY=your-aws-secret-key
   AWS_BUCKET_NAME=your-aws-bucket-name
   ```

4. Run database migrations with Prisma:
   ```bash
   npx prisma migrate dev
   ```

5. Start the backend server:
   ```bash
   npm start
   ```

### 3. Frontend Setup:
#### Prerequisites:
- Node.js (v14 or higher)

#### Steps:
1. Navigate to the `job-portal-frontend` directory:
   ```bash
   cd job-portal-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the frontend project and add:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. Start the frontend server:
   ```bash
   npm run dev
   ```

The frontend will now be available at `http://localhost:3000`, and the backend will be available at `http://localhost:5000`.

## Testing

To run the tests, navigate to the root of the project and run:
```bash
npm run test
```

## Contribution

If you want to contribute to the project:
1. Fork the repository
2. Create a new branch
3. Make your changes
4. Open a pull request with a description of your changes

## License

This project is licensed under the MIT License.

---

