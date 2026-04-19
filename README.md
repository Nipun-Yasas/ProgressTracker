# Progress Flow

A modern, web-based daily habit and progress tracker built with Next.js, React, Tailwind CSS, and MongoDB.

## Features

- **Daily Habit Tracking**: Easily log your daily habits and activities.
- **Monthly Overview**: View your progress over the current month with an intuitive checklist.
- **Targets Tracking**: Define, edit, and safely track long-term, text-based goals across months.
- **Progress Visualization**: Track your consistency and success rates with interactive charts powered by Recharts.
- **Activity Management**: Add new habits or delete old ones as your routines change.
- **Smart Carry-over**: Copy your activities from the previous month to easily continue your tracking.
- **User Authentication**: Secure login and sign-up flows powered by Clerk.
- **Modern UI & Theming**: A sleek interface built using Tailwind CSS with seamless Dark and Light mode support.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Frontend**: React, Tailwind CSS
- **Authentication**: Clerk
- **Database**: MongoDB (via Mongoose)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Dates**: date-fns
- **Theming**: next-themes
- **Notifications**: react-hot-toast

## Getting Started

First, ensure you have your MongoDB instance running and connection string available, along with your Clerk API keys.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory and add your MongoDB connection string and Clerk credentials (if not already set up):

   ```env
   NEXT_PUBLIC_MONGODB_URI=your_mongodb_connection_string
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.
