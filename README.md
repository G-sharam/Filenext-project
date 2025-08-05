# FileNest

A simple monorepo search engine that indexes and searches documents (PDFs, text, images) using a Flask backend and a React & Tailwind CSS frontend.

## Contents

- `backend/` – Flask API server for indexing and searching files
- `frontend/` – React application for querying and displaying search results

## Prerequisites

- **Node.js** (v14+)
- **npm** (v6+)
- **Python** (v3.8+)
- **virtualenv** or built-in `venv`

## Setup & Installation

### 1. Clone the repository
```bash
git clone git@github.com:<your-username>/<your-repo>.git
cd <your-repo>
```
### 2. Backend
```
Navigate to the backend directory:
bash terminal
cd backend

Create a virtual environment and activate it:
python3 -m venv venv
source venv/bin/activate   # On Windows use: venv\Scripts\activate

Install dependencies:
pip install -r requirements.txt

Start the Flask server:
python app.py

The backend will run on http://localhost:5000 by default.
```
### 3. Frontend
Open a new terminal, navigate to the frontend directory:
```
bash terminal
cd frontend

Install npm packages:
npm install

Start the development server:
npm run dev

The frontend will run on http://localhost:5173 (or another port shown in the console).
```
### 4. Usage
```
Open your browser to http://localhost:5173 to access the search UI.

Type queries to search indexed documents served by the Flask API.
```
### 5. Folder Structure
Filenest
├── backend/           # Flask API server
│   ├── app.py         # Entry point
│   ├── requirements.txt
│   └── data/          # Sample files for indexing
└── frontend/          # React + Tailwind UI
    ├── src/           # React components
    ├── public/        # Static assets
    ├── package.json
    └── tailwind.config.js
