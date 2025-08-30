# Citizen Environmental Reporting Platform

A comprehensive web application that enables citizens to report environmental incidents, NGOs to verify and manage reports, and government agencies to track and respond to environmental alerts.

## 🌱 Overview

This platform creates a collaborative ecosystem for environmental protection by connecting three key stakeholders:

- **Citizens**: Report environmental incidents and earn eco-points for contributions
- **NGOs**: Verify reports, analyze data, and escalate critical issues to authorities
- **Government**: Monitor alerts, manage cases, and coordinate response efforts

## 🏗️ Architecture

### Backend (Node.js/Express)
- **Framework**: Express.js with ES6 modules
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based auth with refresh tokens
- **Security**: bcrypt password hashing, CORS protection
- **File Handling**: Image upload support for incident reports

### Frontend (React/Vite)
- **Framework**: React 19 with Vite build tool
- **Styling**: Tailwind CSS with custom components
- **Routing**: React Router DOM with role-based access
- **Forms**: React Hook Form with Zod validation
- **UI/UX**: Framer Motion animations, Lucide React icons
- **State Management**: React hooks and context

## 📱 Features

### For Citizens
- **Dashboard**: Personal stats showing eco-points, reports submitted, and leaderboard ranking
- **Incident Reporting**: 
  - Photo upload with GPS geotagging
  - Categorization (Cutting, Dumping, Land Clearing, Pollution)
  - Optional notes and location adjustment
- **Report History**: Track status of submitted reports
- **Leaderboard**: Gamified system with rankings and eco-points
- **Profile Management**: Update personal information and preferences

### For NGOs
- **Verification Dashboard**: Queue of pending reports for review
- **Satellite Analysis**: AI-powered mangrove status assessment
- **Report Management**: Verify, reject, or flag reports for follow-up
- **Analytics**: Generate charts and trends on incident data
- **Alert Creation**: Escalate critical reports to government authorities

### For Government
- **Alert Management**: Monitor active alerts from NGOs
- **Case Management**: Track investigation progress and resolutions
- **Analytics Dashboard**: Comprehensive environmental data analysis
- **User Management**: Create and manage NGO user accounts
- **Hotspot Mapping**: Geographic visualization of incident clusters

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

   Create `.env` file in backend directory:
   ```env
   PORT=8000
   FRONTEND_URL=http://localhost:5173
   MONGODB_URI=mongodb://localhost:27017/db_v0
   ACCESS_TOKEN_SECRET=your_access_token_secret
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRY=10d
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

   Create `.env` file in frontend directory:
   ```env
   VITE_BACKEND_URL=http://localhost:8000/api/v1
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Server runs on http://localhost:8000

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
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

## 🛡️ Security Features

- JWT-based authentication with access and refresh tokens
- Password hashing with bcrypt
- CORS protection for cross-origin requests
- Input validation with Zod schemas
- Role-based route protection
- Transaction control middleware

## 🎯 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Token refresh

### User Management
- `GET /api/v1/user/profile` - Get user profile
- `PUT /api/v1/user/profile` - Update profile
- `GET /api/v1/user/leaderboard` - Get leaderboard

### Reports
- `POST /api/v1/reports/new` - Submit new report
- `GET /api/v1/reports/my-history` - User's report history
- `PUT /api/v1/reports/verify` - Verify report (NGO)
- `GET /api/v1/reports/analytics` - Report analytics

## 🌍 Environmental Impact

This platform contributes to environmental protection by:
- Enabling rapid incident reporting and response
- Creating accountability through verification systems
- Gamifying environmental stewardship
- Providing data-driven insights for policy decisions
- Facilitating collaboration between citizens, NGOs, and government

## 🔧 Development

### Project Structure
```
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── models/         # Database schemas
│   │   ├── routes/         # API route definitions
│   │   ├── middlewares/    # Custom middleware
│   │   ├── utils/          # Utility functions
│   │   └── config/         # Configuration files
│   └── index.js           # Server entry point
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Route components
│   │   ├── routes/        # Route configuration
│   │   ├── utils/         # Helper functions
│   │   └── schema/        # Validation schemas
│   └── index.html         # Entry HTML file
```

### Available Scripts

**Backend:**
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests

**Frontend:**
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Built with modern web technologies for scalability and performance
- Designed with environmental sustainability and community engagement in mind
- Implements best practices for security and user experience