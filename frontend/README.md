# Walksy Frontend

React + Vite frontend for the Walksy application.

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Shadcn UI Components
- React Router
- Axios for API calls

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```env
VITE_API_URL=http://localhost:5000/api
```

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── context/        # React context providers
├── pages/          # Page components
├── services/       # API service layer
├── hooks/          # Custom React hooks
├── lib/            # Utility functions
└── App.jsx         # Main app component
```
