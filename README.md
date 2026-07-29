# EduElevate Backend

Node.js + Express + TypeScript + Prisma backend for the EduElevate learning platform.

## Prerequisites

- Node.js 18+
- PostgreSQL 14+ (running locally)
- npm

## Setup

1. Clone the repository:

   ```bash
   git clone git@github.com:V-Mugisha/eduelevate-backend.git
   cd eduelevate-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a PostgreSQL database:

   ```bash
   createdb eduelevate
   ```

4. Create a `.env` file in the project root:

   ```env
   DATABASE_URL="postgresql://<user>:<password>@localhost:5432/eduelevate"
   JWT_SECRET="your-secret-key"
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   AUDIT_LOG_RETENTION_DAYS=90
   ```

5. Run database migrations and seed:

   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

6. Start the dev server:

   ```bash
   npm run dev
   ```

The API runs at `http://localhost:3001`.  
Swagger docs at `http://localhost:3001/api/docs`.

## Default Admin Account

After running the seed, log in with:

- **Email:** `admin@eduelevate.com`
- **Password:** `Admin@123`

## Environment Variables

| Variable                   | Required | Description                              |
| -------------------------- | -------- | ---------------------------------------- |
| `DATABASE_URL`             | Yes      | PostgreSQL connection string             |
| `JWT_SECRET`               | Yes      | Secret key for JWT signing               |
| `CLOUDINARY_CLOUD_NAME`    | Yes      | Cloudinary cloud name for image uploads  |
| `CLOUDINARY_API_KEY`       | Yes      | Cloudinary API key                       |
| `CLOUDINARY_API_SECRET`    | Yes      | Cloudinary API secret                    |
| `AUDIT_LOG_RETENTION_DAYS` | No       | Days to keep audit logs (defaults to 90) |
| `PORT`                     | No       | Server port (defaults to 3001)           |

## Available Commands

| Command                  | Description                                   |
| ------------------------ | --------------------------------------------- |
| `npm run dev`            | Start dev server with hot reload              |
| `npm run build`          | Type-check with `tsc --noEmit`                |
| `npm run start`          | Start production server                       |
| `npm run lint`           | Run ESLint                                    |
| `npm run format`         | Check Prettier formatting                     |
| `npm run check`          | Run lint + format                             |
| `npx prisma migrate dev` | Create and apply database migrations          |
| `npx prisma db seed`     | Seed roles, permissions, and admin user       |
| `npx prisma studio`      | Open Prisma Studio to browse data             |
| `npm run audit:cleanup`  | Delete audit logs older than retention period |
