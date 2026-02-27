# Progress Flow

A modern, web-based daily habit and progress tracker built with Next.js, React, Tailwind CSS, and MongoDB.

## Features

- **Daily Habit Tracking**: Easily log your daily habits and activities.
- **Monthly Overview**: View your progress over the current month with an intuitive checklist.
- **Progress Visualization**: Track your consistency and success rates with interactive charts powered by Recharts.
- **Activity Management**: Add new habits or delete old ones as your routines change.
- **Smart Carry-over**: Copy your activities from the previous month to easily continue your tracking.
- **Modern UI**: A sleek, dark-themed interface built using Tailwind CSS and Lucide React icons.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Frontend**: React, Tailwind CSS
- **Database**: MongoDB (via Mongoose)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Dates**: date-fns
- **Notifications**: react-hot-toast

## Getting Started

First, ensure you have your MongoDB instance running and connection string available.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory and add your MongoDB connection string (if not already set up):

   ```env
   MONGODB_URI=your_mongodb_connection_string
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.
