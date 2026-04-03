# Library Management System

A robust, modern library management system built with an architecture consisting of a C++ backend, a Node.js bridge, and a React frontend.

## Project Structure

* **backend/**: Core C++ backend holding all OOP business logic, file I/O template logic, and CLI argument parsing.
* **bridge/**: Node.js Express server acting as a bridge. Dispatches calls to the C++ binary for write operations and reads directly from `.txt` databases for fast GETs.
* **frontend/**: React Vite frontend with Tailwind CSS styling and Context API. Modern dark/light mode UI.

## Build and Run Instructions

### Prerequisites
* g++ (C++17 or later)
* CMake
* Node.js 18+
* npm

### Step 1: Build C++ backend
```bash
cd backend
mkdir build && cd build
cmake ..
make
```
Binary outputs to `backend/build/library_backend`.

### Step 2: Seed sample data
On first run (or through startup of the bridge/backend), sample data inside `.txt` files will automatically generate in `backend/data`.

### Step 3: Start Node bridge
```bash
cd bridge
npm install
node server.js
```
Runs on `http://localhost:3001`

### Step 4: Start React frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`. Open your browser.

### Login Credentials
**Admin User**:
Email: `admin@library.edu`
Password: `admin123`

**Student User**:
Email: `aanya@college.edu`
Password: `pass123`

## Features

- Runtime Polymorphism & OOP demonstration.
- Template-driven generic File Handlers.
- Custom exception handling logic for missing assets.
- Tiered fines penalty configuration.
- Aesthetic modern dashboard visualization (Recharts).
- Dynamic Dark / Light theme.
