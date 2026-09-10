# Blog Platform with Comments

## Project Overview

This project is a full-stack blogging platform where users can register, log in, create blog posts, edit or delete their own posts, and comment on articles. It uses a React frontend, Express backend, and MongoDB database with JWT-based authentication.

## Features

- User registration and login
- JWT-based secure authentication
- Protected routes and authorization checks
- Create, list, view, edit, and delete blog posts
- User ownership enforcement for editing and deleting posts
- Comment system with add/delete support
- Search and filter on the homepage
- Responsive modern UI for desktop, tablet, and mobile
- RESTful API with MongoDB integration

## Technology Stack

Frontend:
- React
- Vite
- Axios
- React Router

Backend:
- Node.js
- Express.js
- REST APIs

Database:
- MongoDB
- Mongoose

Authentication:
- JWT
- bcryptjs

## Project Structure

```text
blog-platform/
├── client/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── src/
│   ├── .env.example
│   └── package.json
├── .gitignore
├── package.json
├── README.md
├── render.yaml
└── .env.example
```

## Prerequisites

Before running the app, ensure you have installed:

- Node.js 18+
- npm
- A MongoDB local instance or MongoDB Atlas cluster

## Installation

From the project root:

```bash
npm install
npm --prefix server install
npm --prefix client install
```

## Environment Variables

Create `server/.env` using `server/.env.example`:

```bash
cp server/.env.example server/.env
```

Set values appropriate for the environment:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/blog-platform
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
```

`JWT_SECRET` is required and must be a long random value. The server refuses to start when it is missing or still set to the example placeholder.

For a hosted frontend, create `client/.env` with the public backend URL:

```env
VITE_API_URL=https://your-backend-host.example.com/api
```

Do not commit either `.env` file. The repository ignores them by default.

Production must use a real MongoDB Atlas or hosted MongoDB connection string. The optional in-memory fallback is only for non-production local testing.

## Running Locally

Start the backend:

```bash
npm run server
```

Start the frontend:

```bash
npm run client
```

To run both together:

```bash
npm run dev
```

The frontend runs on `http://localhost:5173` and the API runs on `http://localhost:5000` by default. Confirm the API is available at `GET /api/health`.

## API Endpoints

### Authentication

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

### Posts

- GET /api/posts
- GET /api/posts/:id
- POST /api/posts
- PUT /api/posts/:id
- DELETE /api/posts/:id

### Comments

- GET /api/posts/:postId/comments
- POST /api/posts/:postId/comments
- PUT /api/comments/:id
- DELETE /api/comments/:id

## Database Setup

### MongoDB Atlas

1. Create a cluster and database user in MongoDB Atlas.
2. Add the backend host's outbound IP range to Atlas Network Access. For a temporary hosted test, Atlas supports `0.0.0.0/0`, but a restricted range is recommended for production.
3. Copy the driver connection string into `MONGODB_URI`.
4. URL-encode special characters in the database username or password.
5. Keep the database name in the connection string, for example `blog-platform`.

The backend connects before opening its HTTP port, so a bad MongoDB URI causes startup to fail instead of silently accepting requests without persistence.

### Local MongoDB

For local development:

```bash
mongod
```

Then set `MONGODB_URI` in `server/.env` to point to your Mongo instance.

## Testing

Use Postman or curl to test the API:

1. Register a user
2. Log in and copy the JWT token
3. Set Authorization: Bearer token for protected routes
4. Create posts and comments
5. Verify unauthorized users cannot edit or delete another user's content

Example:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"secret123","confirmPassword":"secret123"}'
```

## Deployment

The repository includes deployment manifests for the recommended split deployment:

- `render.yaml` defines a production Node API and a static React site.
- `client/vercel.json` configures SPA route fallback when the client is deployed to Vercel.
- `client/.env.example` documents the public API URL required by the Vite build.

### Frontend

Deploy the `client` folder to Vercel, Netlify, Render Static Sites, or another static hosting provider.

Set the environment variable:

```env
VITE_API_URL=https://your-backend-url/api
```

Build command: `npm run build` from the `client` folder. Publish directory: `client/dist`.

Configure the host to serve `index.html` for unknown paths so React Router routes such as `/posts/:id` work after refresh. Vercel is configured by `client/vercel.json`; the Render rewrite is included in `render.yaml`.

### Backend

Deploy the `server` folder to Render, Railway, or another Node.js hosting service.

Set the environment variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secure_secret
CLIENT_URL=https://your-frontend-url
NODE_ENV=production
```

Start command: `npm start` from the `server` folder. The host must expose the configured `PORT` and allow outbound access to MongoDB Atlas.

### Render Blueprint

To use the included `render.yaml`, create a Render Blueprint from the repository. Render will create:

1. `blogverse-api`, using `server` as its root directory and `/api/health` as its health check.
2. `blogverse-client`, using `client/dist` as its static publish directory with SPA rewrites.

After the services are created, set the Blueprint's secret values:

- API `MONGODB_URI`: the MongoDB Atlas driver URI.
- API `JWT_SECRET`: a long random secret.
- API `CLIENT_URL`: the final HTTPS URL of the client service.
- Client `VITE_API_URL`: the final HTTPS API URL ending in `/api`.

The client must be rebuilt after `VITE_API_URL` is set because Vite embeds public environment variables at build time.

### Database

Use MongoDB Atlas and configure a secure database user and network access.

## Final Testing Checklist

- [x] Frontend production build succeeds with `npm run build`.
- [x] Backend starts only with valid JWT configuration and connects to MongoDB before listening.
- [x] `GET /api/health` returns a successful response.
- [x] Registration, login, logout, and JWT session restoration work.
- [x] Post create, list, detail, edit, and delete flows work with server-side ownership checks.
- [x] Comment create, list, and own-comment delete flows work with server-side authorization.
- [x] Unauthorized post and comment mutations return `403`.
- [x] Client routes load after refresh through SPA hosting rewrites.
- [x] Desktop and mobile layouts were checked for overflow and responsive behavior.
- [x] Client and server production dependency audits report no known vulnerabilities.

## Deployment Ready Notes

- CORS is restricted to the configured `CLIENT_URL`.
- JWT secrets and database credentials are read only from environment variables.
- The server fails fast when the database or JWT configuration is missing.
- Authentication, post ownership, and comment ownership are enforced server-side.
- Post content is rendered as text, not unsanitized HTML.
- MongoDB data is persisted through Mongoose models for users, posts, and comments.
- The API exposes `GET /api/health` for hosting health checks.
- The deployment manifests keep secrets as provider-managed `sync: false` values.
- The frontend and backend can be deployed independently while retaining the same REST API contract.
