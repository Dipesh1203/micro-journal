# MicroJournal - Emotional Intelligence Through Journaling

A modern journaling application that helps users track their emotional well-being through daily entries and AI-powered emotion analysis.

## Features

- **Secure Authentication**: Email and password-based user accounts with JWT
- **Journal Entries**: Create, view, edit, and delete personal journal entries
- **Emotion Analysis**: Automatic emotion detection from journal content
- **Manual Emotion Tagging**: Option to manually tag entries with emotions
- **Rich Analytics**:
  - Emotion distribution visualization
  - Weekly and monthly emotion trends
  - Personal emotional pattern insights
- **Responsive Design**: Beautiful, mobile-friendly interface

## Tech Stack

- **Frontend**:

  - React 18
  - TypeScript
  - Tailwind CSS
  - Chart.js
  - Framer Motion
  - Lucide Icons

- **Backend**:
  - Node.js
  - Express
  - MongoDB
  - JWT Authentication
  - Natural Language Processing

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or a remote instance)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Dipesh1203/micro-journal.git
   cd micro-journal
   ```

2. Install dependencies:

   ```bash
   pnpm i
   ```

3. Create a `.env` file in the root directory and take .sample.env as a sample:

   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/journal_app
   JWT_SECRET=your_jwt_secret
   ```

4. Start the development servers:
   ```bash
   pnpm run dev:all
   ```

The application will be available at `http://localhost:5173`

## Project Structure

```
MicroJournal/
├── server/                # Backend server code
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── utils/            # Utility functions
├── src/                  # Frontend source code
│   ├── components/       # Reusable React components
│   ├── contexts/         # React context providers
│   ├── pages/           # Page components
│   └── utils/           # Utility functions
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/user` - Get user profile

### Journal Entries

- `GET /api/journal` - Get all entries
- `POST /api/journal` - Create new entry
- `GET /api/journal/:id` - Get specific entry
- `PUT /api/journal/:id` - Update entry
- `DELETE /api/journal/:id` - Delete entry

### Analytics

- `GET /api/analytics/emotions` - Get emotion distribution
- `GET /api/analytics/weekly` - Get weekly emotion breakdown
- `GET /api/analytics/monthly` - Get monthly emotion trends
