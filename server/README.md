# Server (Backend)

This directory contains the Node.js/Express backend for the Market Map Application. It provides API endpoints for managing market data, including locations, schedules, and closed roads.

## Main Files and Folders
- `src/`: Source code for the backend.
  - `server.js`: Entry point for the Express server.
  - `controllers/`: Logic for handling API requests (e.g., market.controller.js).
  - `models/`: Mongoose models for MongoDB (e.g., market.model.js).
  - `routes/`: Express route definitions (e.g., markets.routes.js).
- `package.json`: Lists dependencies and scripts for running the backend.

The backend connects to a MongoDB database and serves data to the frontend via a RESTful API.