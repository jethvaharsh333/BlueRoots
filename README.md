# Citizen Environmental Reporting Platform

A comprehensive web application that enables citizens to report environmental incidents, NGOs to verify and manage reports, and government agencies to track and respond to environmental alerts.

## 🌱 Overview

This platform creates a collaborative ecosystem for environmental protection by connecting three key stakeholders:

- *Citizens*: Report environmental incidents and earn eco-points for contributions
- *NGOs*: Verify reports, analyze data, and escalate critical issues to authorities
- *Government*: Monitor alerts, manage cases, and coordinate response efforts

## 🏗 Architecture

### Backend (Node.js/Express)
- *Framework*: Express.js with ES6 modules
- *Database*: MongoDB with Mongoose ODM
- *Authentication*: JWT-based auth with refresh tokens
- *Security*: bcrypt password hashing, CORS protection
- *File Handling*: Image upload support for incident reports

### Frontend (React/Vite)
- *Framework*: React 19 with Vite build tool
- *Styling*: Tailwind CSS with frosted glass design system
- *Routing*: React Router DOM with role-based access control
- *Forms*: React Hook Form with Zod validation
- *UI/UX*: 
  - Framer Motion animations and transitions
  - Lucide React icons and emoji integration
  - Responsive design with mobile-first approach
  - Gradient backgrounds and glassmorphism effects
- *AI Integration*: Google Gemini AI for chat assistance
- *State Management*: React hooks, context, and real-time updates
- *Real-time Features*: Auto-refresh dashboards and live data sync

## 📱 Features

### For Citizens
- *Real-time Dashboard*: 
  - Live eco-points tracking with animated counters
  - Personal statistics and achievement badges
  - Leaderboard ranking with podium visualization
  - Auto-refreshing data every 30 seconds
- *Smart Incident Reporting*: 
  - Photo upload with automatic GPS geotagging
  - Categorization (Tree Cutting, Waste Dumping, Land Clearing, Water Pollution)
  - Read-only location fields to ensure GPS accuracy
  - Rich text notes and incident descriptions
- *Interactive Leaderboard*: 
  - Animated podium for top 3 performers
  - Comprehensive user statistics and rankings
  - Achievement system with eco-point rewards
- *AI-Powered Chat Assistant*: 
  - Gemini AI integration for environmental guidance
  - Real-time chat with scrollable message history
  - Environmental tips and report assistance
- *Profile Management*: Update personal information and track contributions

### For NGOs
- *Verification Dashboard*: Queue of pending reports for review
- *Satellite Analysis*: AI-powered mangrove status assessment
- *Report Management*: Verify, reject, or flag reports for follow-up
- *Analytics*: Generate charts and trends on incident data
- *Alert Creation*: Escalate critical reports to government authorities

### For Government
- *Real-time Dashboard*: 
  - Live monitoring of new alerts and active cases
  - Auto-refresh functionality with manual controls
  - Priority alert feed with severity indicators
  - Recent actions tracking and case status updates
- *Comprehensive Analytics*: 
  - Environmental data trends and patterns
  - Geographic hotspot identification
  - Statistical reporting and insights
- *Alert & Case Management*: 
  - Priority-based alert queue with severity levels
  - Investigation progress tracking
  - Case resolution workflow management
- *User Administration*: 
  - Create and manage NGO user accounts
  - Role-based access control
  - User activity monitoring
- *System Controls*: 
  - Dashboard refresh controls (manual/auto)
  - Real-time data synchronization
  - System status monitoring

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB database
- npm or yarn package manager

### Installation

1. *Clone the repository*
   bash
   git clone <repository-url>
   cd <project-directory>
   

2. *Backend Setup*
   bash
   cd backend
   npm install
   

   Create .env file in backend directory:
   env
   PORT=8000
   FRONTEND_URL=http://localhost:5173
   MONGODB_URI=mongodb://localhost:27017/db_v0
   ACCESS_TOKEN_SECRET=your_access_token_secret
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRY=10d
   

3. *Frontend Setup*
   bash
   cd frontend
   npm install
   

   Create .env file in frontend directory:
   env
   VITE_BACKEND_URL=http://localhost:8000/api/v1
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   

### Running the Application

1. *Start Backend Server*
   bash
   cd backend
   npm run dev
   
   Server runs on http://localhost:8000

2. *Start Frontend Development Server*
   bash
   cd frontend
   npm run dev
   
   Application runs on http://localhost:5173

## 📊 Database Schema

### User Model
- Authentication and profile information
- Role-based access control (Citizen, NGO, Government)
- Eco-points tracking system
- Social login support (Google, GitHub)

### Report Model
- Geospatial incident data with 2dsphere indexing
- Image attachments and categorization
- Status tracking (Pending, Verified, Rejected, Actioned)
- User attribution and verification workflow

### Alert Model
- Escalated reports for government attention
- Severity levels (Low, Medium, Critical)
- Investigation status tracking
- Multi-report aggregation

## ✨ Key Features & Technologies

### Real-time Updates
- Auto-refreshing dashboards (30-second intervals)
- Live data synchronization across all user roles
- Manual refresh controls with loading states
- Real-time eco-point tracking and leaderboard updates

### AI Integration
- *Google Gemini AI*: Intelligent chat assistant for environmental guidance
- Contextual responses about environmental issues
- Report submission assistance and tips
- Educational content delivery through conversational interface

### Modern UI/UX
- *Glassmorphism Design*: Frosted glass cards with backdrop blur effects
- *Framer Motion Animations*: Smooth transitions and micro-interactions
- *Responsive Design*: Mobile-first approach with adaptive layouts
- *Gradient Backgrounds*: Dynamic color schemes for visual appeal
- *Interactive Elements*: Hover effects, loading skeletons, and feedback

### Performance Optimizations
- Lazy loading for improved initial load times
- Optimized API calls with error handling and fallbacks
- Efficient state management with React hooks
- Image optimization for report uploads

## 🛡 Security Features

- *JWT Authentication*: Secure access and refresh token system
- *Password Security*: bcrypt hashing with salt rounds
- *CORS Protection*: Cross-origin request security
- *Input Validation*: Zod schemas for type-safe data validation
- *Role-based Access*: Route protection based on user roles
- *API Security*: Rate limiting and request validation middleware
- *GPS Verification*: Location accuracy enforcement for reports

## 🎯 API Endpoints

### Authentication
- POST /api/v1/auth/register - User registration
- POST /api/v1/auth/login - User login
- POST /api/v1/auth/logout - User logout
- POST /api/v1/auth/refresh - Token refresh

### User Management
- GET /api/v1/user/profile - Get user profile
- PUT /api/v1/user/profile - Update profile
- GET /api/v1/user/leaderboard - Get leaderboard rankings

### Reports & Incidents
- POST /api/v1/reports/new - Submit new incident report
- GET /api/v1/reports/my-history - User's report history
- PUT /api/v1/reports/verify - Verify report (NGO only)
- GET /api/v1/reports/analytics - Report analytics and trends

### Dashboards
- GET /api/v1/dashboard/citizen - Citizen dashboard data
- GET /api/v1/dashboard/government - Government dashboard data
- GET /api/v1/dashboard/ngo - NGO dashboard data

### Alerts & Cases
- GET /api/v1/alerts - Get environmental alerts
- POST /api/v1/alerts/create - Create new alert (NGO)
- GET /api/v1/cases/my-cases - Get assigned cases
- PUT /api/v1/cases/update - Update case status

## 🌍 Environmental Impact

This platform contributes to environmental protection by:
- *Rapid Response*: Real-time incident reporting with GPS accuracy
- *Community Engagement*: Gamified eco-point system encouraging participation
- *AI-Powered Assistance*: Intelligent chat support for environmental guidance
- *Data-Driven Decisions*: Comprehensive analytics for policy makers
- *Collaborative Ecosystem*: Seamless coordination between citizens, NGOs, and government
- *Transparency*: Public leaderboards and progress tracking
- *Educational*: AI chatbot provides environmental tips and awareness

## 🔧 Development

### Project Structure

├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers and business logic
│   │   ├── models/         # MongoDB schemas and models
│   │   ├── routes/         # API route definitions
│   │   ├── middlewares/    # Authentication and validation middleware
│   │   ├── utils/          # Helper functions and utilities
│   │   └── config/         # Database and server configuration
│   └── index.js           # Server entry point
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Route-specific page components
│   │   │   ├── citizen/   # Citizen dashboard and features
│   │   │   ├── government/# Government admin interface
│   │   │   ├── ngo/       # NGO verification tools
│   │   │   └── common/    # Shared components (chat, auth)
│   │   ├── routes/        # Route configuration and protection
│   │   ├── utils/         # API clients and helper functions
│   │   ├── schema/        # Form validation schemas
│   │   └── constant.js    # Application constants
│   └── index.html         # Entry HTML file


### Available Scripts

*Backend:*
- npm run dev - Start development server with nodemon
- npm test - Run tests

*Frontend:*
- npm run dev - Start Vite development server
- npm run build - Build for production
- npm run preview - Preview production build
- npm run lint - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Built with modern web technologies for scalability and performance
- Designed with environmental sustainability and community engagement in mind
- Implements best practices for security and user experience
