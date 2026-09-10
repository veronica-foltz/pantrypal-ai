# PantryPal AI

PantryPal AI is a full-stack pantry management and recipe assistant that helps users track pantry items, monitor expiration dates, generate recipe suggestions, and build shopping lists.

The application also integrates AI-powered recipe generation using the OpenAI API.

## Live Demo

Frontend:
https://main.dyyad06ps29td.amplifyapp.com

## Features

- User authentication with JWT
- Guest login
- Add, edit, delete, search, and filter pantry items
- Track item quantities, categories, and expiration dates
- Dashboard with pantry statistics
- Expiring-soon alerts
- Recipe suggestions based on available pantry ingredients
- AI-generated recipes using the OpenAI API
- Shopping list generation
- Manual shopping list items
- Interactive completed-item tracking
- Responsive mobile-style interface

## Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS

### Backend
- Python
- FastAPI
- SQLAlchemy
- PostgreSQL
- JWT authentication
- OpenAI API

### DevOps / Cloud
- AWS Amplify Hosting
- Amazon CloudFront
- Amazon EC2
- Docker
- Docker Compose
- GitHub

## AWS Architecture

The production application uses the following architecture:

React / Vite
    ↓
AWS Amplify Hosting
    ↓
Amazon CloudFront (HTTPS API endpoint)
    ↓
Amazon EC2
    ↓
Docker Compose
    ├── FastAPI API
    └── PostgreSQL
    ↓
OpenAI API

CloudFront provides HTTPS access to the FastAPI API running inside Docker on EC2. The React frontend is deployed through AWS Amplify.
