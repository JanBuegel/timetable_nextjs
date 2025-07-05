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

## API Endpoints

### `/api/timetable`

This API endpoint provides the Open Flair Festival timetable data.

- **Method:** `GET`
- **URL:** `/api/timetable`
- **Response:** A JSON object representing the grouped timetable data. The data is grouped by date, then by stage, with events sorted by time.

  Example Response Structure:
  ```json
  {
    "06.08.2025": {
      "SB": [
        {
          "name": "Hi Spencer!",
          "date": "06.08.2025",
          "time": "16:15",
          "stage": "SB"
        },
        // ... more events
      ]
    },
    "07.08.2025": {
      "EW": [
        {
          "name": "Open Flair Eröffnungsshow",
          "date": "07.08.25",
          "time": "13:45",
          "stage": "EW"
        },
        // ... more events
      ],
      // ... more stages
    }
  }
  ```
