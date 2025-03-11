# Job Portal API

This API allows users to create an account, login, update their profile, upload their resume and also delete resume, update. Users can also apply for jobs and view all jobs they have applied for. 

The API is built using Node.js, Express.js, Prisma and TypeScript.

## Getting Started

1. Clone the repository: `git clone `
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Make sure you have running prisma cli and prisma server

## Endpoints

- `POST /register`: Create a new user account
- `POST /login`: Login to an existing user account
- `PUT /users/:id`: Update a user's profile
- `PUT /users/:id/resume`: Upload a user's resume
- `POST /jobs`: Add a new job listing
- `PUT /jobs/:id`: Update an existing job listing
- `GET /jobs/:id`: Retrieve a single job listing
- `POST /jobs/:id/apply`: Apply for a job listing
- `GET /users/:id/jobs`: Retrieve all jobs a user has applied for

## Note

This project is still under development and the endpoints may not be completely functional yet.



