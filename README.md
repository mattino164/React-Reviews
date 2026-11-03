# MyReviewList

A full-stack review website where users can browse, filter, sort, and read reviews, create an account, and submit their own reviews with an optional image.

🔗 Project Links
Live Demo: ([https://marvel-rivals.vercel.app/](https://react-reviews-murex.vercel.app/))

## Features

- Browse reviews from the home page
- Filter reviews by category
- Sort reviews by newest, oldest, highest rating, or lowest rating
- Open an individual review page
- Sign up, log in, and log out
- Create reviews while logged in
- Add multiple categories and an optional JPG/PNG image to a review
- Delete your own reviews
- Store users and reviews in MongoDB

## Tech Stack

**Frontend**
- React 19
- React Router
- Axios
- React Icons
- Create React App

**Backend**
- Node.js
- Express 5
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- Multer for image uploads
- Cookie Parser and CORS

## Project Structure

```text
React-Reviews/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── styles/
│       └── api.js          # Backend API base URL
└── server/                 # Express backend
    ├── models/             # Mongoose models
    ├── routes/             # Review and authentication routes
    ├── uploads/            # Uploaded review images
    ├── .env.example        # Backend environment variable template
    └── index.js            # API server entry point
```

## Run Locally

### Requirements

- Node.js and npm
- A MongoDB database (MongoDB Atlas or a local MongoDB instance)

### 1. Clone the repository

```bash
git clone https://github.com/mattino164/React-Reviews.git
cd React-Reviews
```

### 2. Configure the backend

Install backend dependencies:

```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder. You can use `.env.example` as a template:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/MyReviewList
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

**Important:** Set the database name in your MongoDB connection string to the database that contains your data. This project uses the `MyReviewList` database. Mongoose creates/uses the `reviews` and `users` collections in that database.

Keep your real `.env` file and secrets private. Do not commit database credentials or your JWT secret to GitHub.

Start the backend:

```bash
npm start
```

The API runs at `http://localhost:5000` by default.

### 3. Configure the frontend

Open a second terminal and install the frontend dependencies:

```bash
cd client
npm install
```

The frontend reads its backend URL from `REACT_APP_API_URL`. For local development, it defaults to:

```text
http://localhost:5000
```

To override it, create a `.env` file inside `client`:

```env
REACT_APP_API_URL=http://localhost:5000
```

Start the React development server:

```bash
npm start
```

The frontend runs at `http://localhost:3000`.

## Deployment

This project can be deployed with the frontend on **Vercel**, the backend on **Render**, and the database on **MongoDB Atlas**.

### MongoDB Atlas

1. Create or select your Atlas cluster.
2. Make sure the database containing your app data is named `MyReviewList`.
3. Confirm that it contains the `reviews` and `users` collections.
4. Copy your Atlas connection string and use it as the backend's `MONGO_URI`.
5. Replace the username and password placeholders with your database credentials. Never put this connection string in frontend code.

The database name matters: connecting to the same cluster but using a different database name can make the app appear to have no reviews.

### Render (Backend)

Create a Web Service connected to this repository and configure:

- **Root Directory:** `server`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

Add these environment variables in Render:

| Variable | Value |
| --- | --- |
| `MONGO_URI` | Your MongoDB Atlas connection string ending in `/MyReviewList` |
| `JWT_SECRET` | A long, private random secret |
| `CLIENT_URL` | Your deployed Vercel website origin, for example `https://your-site.vercel.app` |
| `NODE_ENV` | `production` |

Render provides the `PORT` environment variable automatically.

After deployment, the backend API base URL will look similar to:

```text
https://your-backend.onrender.com
```

You can test that reviews are being returned by opening:

```text
https://your-backend.onrender.com/api/reviews
```

### Vercel (Frontend)

Import the same GitHub repository into Vercel and configure:

- **Root Directory:** `client`
- **Build Command:** `npm run build`
- **Output Directory:** `build`

Add this environment variable in Vercel:

| Variable | Value |
| --- | --- |
| `REACT_APP_API_URL` | Your Render backend base URL, for example `https://your-backend.onrender.com` |

Use only the backend base URL here—do not add `/api/reviews` to the end. Redeploy the frontend after changing environment variables.

Also make sure Render's `CLIENT_URL` matches the deployed Vercel origin exactly.

## API Routes

All routes are prefixed with `/api`.

### Reviews — `/api/reviews`

| Method | Endpoint | Description | Authentication |
| --- | --- | --- | --- |
| GET | `/api/reviews` | Get reviews; accepts optional `category` and `sort` query parameters | No |
| GET | `/api/reviews/:id` | Get one review by ID | No |
| POST | `/api/reviews` | Create a review; supports an optional image upload | Yes |
| DELETE | `/api/reviews/:id` | Delete a review you authored | Yes |

Supported sort values: `newest`, `oldest`, `ratingHigh`, and `ratingLow`.

### Authentication — `/api/auth`

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/signup` | Create an account |
| POST | `/api/auth/login` | Log in |
| POST | `/api/auth/logout` | Log out |
| GET | `/api/auth/me` | Get the currently logged-in user |

Authentication uses an HTTP-only cookie. In production, the frontend and backend must use HTTPS and the backend CORS `CLIENT_URL` must allow the frontend origin.

## Notes

- Review images are uploaded to the backend's `server/uploads` directory and served from `/uploads`. If your hosting provider uses an ephemeral filesystem, uploaded files may not survive redeployments or service restarts; use persistent storage or an object-storage service for durable production image uploads.
- The backend requires both `MONGO_URI` and `JWT_SECRET` to be configured.
- The frontend's `REACT_APP_API_URL` is embedded at build time, so redeploy Vercel after changing it.
