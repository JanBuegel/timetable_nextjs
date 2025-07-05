# Open Flair Timetable PWA

This is a Next.js project for the Open Flair Festival timetable, designed to be a Progressive Web Application (PWA).

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

Make sure you have Node.js (version 18.x or higher recommended) and npm installed on your machine.

### Installation

1. Clone the repository (if applicable, otherwise navigate to the project directory):

   ```bash
   cd open-flair-timetable-nextjs
   ```

2. Install the project dependencies:

   ```bash
   npm install
   ```

### Running the Development Server

To start the development server with hot-reloading:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

The timetable will be available at [http://localhost:3000/timetable](http://localhost:3000/timetable).

### Building for Production

To build the application for production:

```bash
npm run build
```

This command optimizes the application for production and creates an optimized build in the `.next` folder.

### Running in Production Mode

To run the built application in production mode:

```bash
npm run start
```

This will serve the production build of your application.

## Data

The timetable data is sourced from `app/data/open_flair_custom.csv`.